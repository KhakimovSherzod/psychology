import { PrismaClient, CartStatus } from "@prisma/client"
import type { ICartRepository } from "../../domain/repository/cart.repository"
import { Cart } from "../../domain/entity/cart.entity"
import { CartItem } from "../../domain/entity/cart.item"


const prisma = new PrismaClient()

export class CartPrismaRepository implements ICartRepository {

  // ===============================
  // FIND ACTIVE CART
  // ===============================
async findActiveByUser(userUuid: string): Promise<Cart | null> {

  // 1️⃣ Resolve user internal id
  const user = await prisma.user.findUnique({
    where: { uuid: userUuid }
  })

  if (!user) return null

  // 2️⃣ Find active cart
  const record = await prisma.cart.findFirst({
    where: {
      userId: user.id,
      status: CartStatus.ACTIVE
    },
    include: {
      items: {
        include: {
          playlist: true   // 🔥 join playlist
        }
      }
    }
  })

  if (!record) return null

  // 3️⃣ Map items to domain
  const items = record.items.map(item =>
    CartItem.reconstruct({
      uuid: item.uuid,
      cartId: record.uuid,
      playlistId: item.playlist.uuid, // ✅ use playlist UUID
      price: item.price,
      createdAt: item.createdAt,
      internalId: item.id
    })
  )

  // 4️⃣ Rebuild aggregate
  return Cart.reconstruct({
    uuid: record.uuid,
    userId: userUuid,
    status: record.status,
    items,
    createdAt: record.createdAt,
    internalId: record.id
  })
}

  // ===============================
  // CREATE ACTIVE CART
  // ===============================
  async createActiveCart(userUuid: string): Promise<Cart> {

    const user = await prisma.user.findUnique({
      where: { uuid: userUuid }
    })

    if (!user) {
      throw new Error("User not found")
    }

    const created = await prisma.cart.create({
      data: {
        userId: user.id,
        status: CartStatus.ACTIVE
      }
    })

    return Cart.reconstruct({
      uuid: created.uuid,
      userId: userUuid,
      status: created.status,
      items: [],
      createdAt: created.createdAt,
      internalId: created.id
    })
  }

  // ===============================
  // SAVE CART (UPSERT ITEMS)
  // ===============================
async save(cart: Cart): Promise<void> {
  if (!cart.internalId) {
    throw new Error("Cart internal ID missing")
  }

 await prisma.$transaction(async (tx) => {

  await tx.cartItem.deleteMany({
    where: { cartId: cart.internalId }
  })

  if (cart.items.length > 0) {

    // 🔥 Resolve playlist internal IDs
    const playlistRecords = await tx.playlist.findMany({
      where: {
        uuid: {
          in: cart.items.map(i => i.playlistId)
        }
      }
    })

    const playlistMap = new Map(
      playlistRecords.map(p => [p.uuid, p.id])
    )
    console.log("playlist map", playlistMap)

    await tx.cartItem.createMany({
      data: cart.items.map(item => {
        const playlistInternalId = playlistMap.get(item.playlistId)
        console.log("playlist", item.playlistId)
        console.log("playlistInternalId:", playlistInternalId)
        if (!playlistInternalId) {
          throw new Error("Playlist not found")
        }
        console.log(item.playlistId)

        return {
          uuid: item.id,
          cartId: cart.internalId, // numeric DB id
          playlistId: playlistInternalId, // numeric DB id
          price: item.price.amount,
           ...(item.createdAt && { createdAt: item.createdAt })
        }
      })
    })
  }
})
}
}