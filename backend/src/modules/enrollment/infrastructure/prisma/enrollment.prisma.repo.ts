import { prisma } from "@/shared/client";
import type { EnrollmentPort } from "../../application/ports/enrollment.port";
import { Enrollment } from "../../domain/entity/enrollment";

export class PrismaEnrollmentRepository implements EnrollmentPort {
async getByUserAndPlaylist(
  userUUID: string,
  playlistUUID: string
): Promise<Enrollment | null> {

  const record = await prisma.enrollment.findFirst({
    where: {
      user: { uuid: userUUID },
      playlist: { uuid: playlistUUID },
    },
    include: {
      user: { select: { uuid: true } },
      playlist: { select: { uuid: true } },
    },
  });

  if (!record) return null;

  return Enrollment.reconstruct({
    id: record.id,
    uuid: record.uuid,
    userId: record.user.uuid,
    playlistId: record.playlist.uuid,
    status: record.status,
    expiresAt: record.expiresAt,
    
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
     ...(record.orderId != null && {
          orderId: record.orderId,
        }),
  });
}

async save(enrollment: Enrollment): Promise<Enrollment> {
  // -------------------------------
  // Step 0: swap UUIDs -> numeric IDs
  // -------------------------------
  const userRecord = await prisma.user.findUnique({
    where: { uuid: enrollment.userId },
  });
  const playlistRecord = await prisma.playlist.findUnique({
    where: { uuid: enrollment.playlistId },
  });

  if (!userRecord || !playlistRecord) {
    throw new Error("User or Playlist not found");
  }

  const userInternalId = userRecord.id;
  const playlistInternalId = playlistRecord.id;

  // -------------------------------
  // Step 1: CREATE
  // -------------------------------
  if (!enrollment.internalId) {
    const saved = await prisma.enrollment.create({
      data: {
        uuid: enrollment.uuid,
        userId: userInternalId,        // numeric FK
        playlistId: playlistInternalId, // numeric FK
        status: enrollment.status,
        expiresAt: enrollment.expiresAt,
        ...(enrollment.orderId != null && {
          orderId: enrollment.orderId,
        }),
        createdAt: enrollment.createdAt,
        updatedAt: enrollment.updatedAt,
      },
      include: {
        user: { select: { uuid: true } },
        playlist: { select: { uuid: true } },
      },
    });

    return Enrollment.reconstruct({
      id: saved.id,
      uuid: saved.uuid,
      userId: saved.user.uuid,          // back to UUID
      playlistId: saved.playlist.uuid,  // back to UUID
      status: saved.status,
      expiresAt: saved.expiresAt,
      ...(saved.orderId != null && { orderId: saved.orderId }),
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    });

  // -------------------------------
  // Step 2: UPDATE
  // -------------------------------
  } else {
    const updated = await prisma.enrollment.update({
      where: { id: enrollment.internalId },
      data: {
        status: enrollment.status,
        expiresAt: enrollment.expiresAt,
        updatedAt: enrollment.updatedAt,
        ...(enrollment.orderId != null && {
          orderId: enrollment.orderId,
        }),
        userId: userInternalId,        // numeric FK update
        playlistId: playlistInternalId, // numeric FK update
      },
      include: {
        user: { select: { uuid: true } },
        playlist: { select: { uuid: true } },
      },
    });

    return Enrollment.reconstruct({
      id: updated.id,
      uuid: updated.uuid,
      userId: updated.user.uuid,         // back to UUID
      playlistId: updated.playlist.uuid, // back to UUID
      status: updated.status,
      expiresAt: updated.expiresAt,
      ...(updated.orderId != null && { orderId: updated.orderId }),
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }
}
async getByUserAndPlaylists(
  userUUID: string,
  playlistUUIDs: string[]
): Promise<Enrollment[]> {
  // Step 1: fetch numeric IDs for user & playlists
  const [user, playlists] = await prisma.$transaction([
    prisma.user.findUnique({ where: { uuid: userUUID } }),
    prisma.playlist.findMany({ where: { uuid: { in: playlistUUIDs } } })
  ]);

  if (!user) throw new Error(`User not found: ${userUUID}`);
  if (playlists.length === 0) return []; // no matching playlists

  const playlistIds = playlists.map(p => p.id); // numeric IDs

  // Step 2: query enrollments using numeric IDs
  const records = await prisma.enrollment.findMany({
    where: {
      userId: user.id,
      playlistId: { in: playlistIds },
    },
    include: {
      user: { select: { uuid: true } },
      playlist: { select: { uuid: true } },
    },
  });

  // Step 3: map to domain entity with UUIDs
  return records.map(record =>
    Enrollment.reconstruct({
      id: record.id,
      uuid: record.uuid,
      userId: record.user.uuid,         // back to UUID
      playlistId: record.playlist.uuid, // back to UUID
      status: record.status,
      expiresAt: record.expiresAt,
      ...(record.orderId != null && { orderId: record.orderId }),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    })
  );
}

async findAll(userUUID: string): Promise<Enrollment[]> {
const records = await prisma.enrollment.findMany({
  where: {
    user: {
      uuid: userUUID
    }
  },
  include: {
    user: {
      select: { uuid: true }
    },
    playlist: {
      select: { uuid: true }
    }
  },
  orderBy: {
    createdAt: 'desc'
  }
});

  return records.map(record =>
    Enrollment.reconstruct({
      id: record.id,
      uuid: record.uuid,
      userId: record.user.uuid,
      playlistId: record.playlist.uuid,
      status: record.status,
      expiresAt: record.expiresAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      ...(record.orderId !== null && { orderId: record.orderId }),
    })
  );
}

}
