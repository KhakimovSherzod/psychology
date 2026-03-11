import  { Enrollment } from "../../domain/entity/enrollment";
import type { EnrollmentPort } from "../ports/enrollment.port";
import { v4 as uuidv4 } from 'uuid'
import type { AdminEnrollmentResponse } from "../DTO/enrollment.dto";
export class EnrollmentService {
  constructor(
    private readonly enrollmentRepo: EnrollmentPort
  ) {}

  async userHasAccess(userUUID: string, playlistUUID: string): Promise<boolean> {
    const enrollment = await this.enrollmentRepo.getByUserAndPlaylist(userUUID, playlistUUID);
    return !!enrollment && enrollment.hasAccess();
  }
  async extendEnrollment(userUUID: string, playlistUUID: string, newExpiration: Date): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepo.getByUserAndPlaylist(userUUID, playlistUUID);
    if (!enrollment) throw new Error("Enrollment not found");

    enrollment.extend(newExpiration);
    return this.enrollmentRepo.save(enrollment);
  }

  async revokeEnrollment(userUUID: string, playlistUUID: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepo.getByUserAndPlaylist(userUUID, playlistUUID);
    if (!enrollment) throw new Error("Enrollment not found");

    enrollment.revoke();
    return this.enrollmentRepo.save(enrollment);
  }
  
async createEnrollment(params: {
  userUUID: string;
  playlistUUID: string;
  expiresAt: Date;
  orderId?: number;
}): Promise<Enrollment> {
  const enrollmentUUID = uuidv4();

  const enrollment = Enrollment.create({
    uuid: enrollmentUUID,
    userId: params.userUUID,        // ✅ pass UUID
    playlistId: params.playlistUUID, // ✅ pass UUID
    expiresAt: params.expiresAt,
  });

  return this.enrollmentRepo.save(enrollment); // swaps internally
}

async getEnrollments(
  userUUID: string
): Promise<AdminEnrollmentResponse[]> {

  const enrollments = await this.enrollmentRepo.findAll(userUUID);

  return enrollments.map((enrollment) => ({
    uuid: enrollment.uuid,
    userId: enrollment.userId,
    playlistId: enrollment.playlistId,
    status: enrollment.status,
    expiresAt: enrollment.expiresAt,
    ...(enrollment.orderId !== undefined && {
      orderId: enrollment.orderId
    }),
    createdAt: enrollment.createdAt,
    updatedAt: enrollment.updatedAt,
    hasAccess: enrollment.hasAccess(),
    isExpired: enrollment.isExpired(),
  }));
}

}
