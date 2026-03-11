// repository/prisma/prisma-order.repository.ts
import { PrismaClient } from "@prisma/client";
import type { IOrderRepository } from "../../domain/repository/order.repository";
import { Order } from "../../domain/entity/order.entity";
import { OrderItem } from "../../domain/entity/order.item.entity";
import { UserNotFound } from "@/shared/errors/repository/UserNotFound.error";
import { PlaylistNotFound } from "@/shared/errors/repository/PlaylistNotFound";
import { OrderNotFound } from "@/shared/errors/repository/OrderNotFound";

const prisma = new PrismaClient();

export class PrismaOrderRepository implements IOrderRepository {
  private static ORDER_EXPIRATION_MINUTES = 60;

async create(order: Order): Promise<Order> {
  return prisma.$transaction(async (tx) => {

    // Resolve user
    const user = await tx.user.findUnique({
      where: { uuid: order.userId },
    });
    if (!user) throw new UserNotFound("", order.userId);

    // Deduplicate playlist UUIDs
    const playlistUuids = [...new Set(order.items.map(i => i.playlistId))];

    const playlists = await tx.playlist.findMany({
      where: { uuid: { in: playlistUuids } },
    });

    const foundUuids = new Set(playlists.map(p => p.uuid));
    const missingUuids = playlistUuids.filter(uuid => !foundUuids.has(uuid));

    if (missingUuids.length > 0) {
      throw new PlaylistNotFound(missingUuids);
    }

    // Build maps
    const uuidToId = new Map<string, number>();
    const idToUuid = new Map<number, string>();

    playlists.forEach(p => {
      uuidToId.set(p.uuid, p.id);
      idToUuid.set(p.id, p.uuid);
    });

    // Create order
    const created = await tx.order.create({
      data: {
        uuid: order.id,
        userId: user.id,
        amount: order.totalAmount,
        currency: order.currency,
        status: order.status,
        expiresAt: new Date(Date.now() + PrismaOrderRepository.ORDER_EXPIRATION_MINUTES * 60 * 1000),
        items: {
          create: order.items.map(item => ({
            uuid: item.id,
            playlistId: uuidToId.get(item.playlistId)!,
            price: item.price,
            currency: item.currency,
          })),
        },
      },
      include: { items: true },
    });

    // Map back to domain
    const items = created.items.map(i =>
      OrderItem.create(
        i.uuid,
        idToUuid.get(i.playlistId)!,
        i.price,
        i.currency
      )
    );

    return Order.create(
      created.uuid,
      order.userId,
      items,
      created.currency
    );
  });
}

async findByUUID(orderId: string): Promise<Order> {

  const record = await prisma.order.findUnique({
    where: { uuid: orderId },
    include: {
      items: true,
      user: true
    }
  })

  if (!record) {
    throw new OrderNotFound(orderId)
  }

  // 🔹 Map order items to domain entities
  const items = record.items.map(item =>
    OrderItem.reconstruct({
      uuid: item.uuid,
      playlistId: item.playlistId.toString(), 
      price: item.price,
      currency: item.currency,
      createdAt: item.createdAt
    })
  )

  // 🔹 Rebuild aggregate root
  return Order.reconstruct({
    uuid: record.uuid,
    userId: record.user.uuid,
    items,
    status: record.status,
    currency: record.currency,
    createdAt: record.createdAt,
    ...(record.paidAt !== null && record.paidAt),
    internalId: record.id
  })
}

async findByUserUUID(userUUID: string): Promise<Order[]> {

  const user = await prisma.user.findUnique({
    where: { uuid: userUUID }
  });

  if (!user) {
    throw new UserNotFound("", userUUID);
  }

  const records = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: true,
      user: true
    },
    orderBy: { createdAt: "desc" }
  });

  return records.map(record => {

    const items = record.items.map(item =>
      OrderItem.reconstruct({
        uuid: item.uuid,
        playlistId: item.playlistId.toString(), // same as your existing logic
        price: item.price,
        currency: item.currency,
        createdAt: item.createdAt,
        internalId: item.id
      })
    );

    return Order.reconstruct({
      uuid: record.uuid,
      userId: record.user.uuid,
      items,
      status: record.status,
      currency: record.currency,
      createdAt: record.createdAt,
       ...(record.paidAt !== null && record.paidAt),
    internalId: record.id
    });

  });
}
}