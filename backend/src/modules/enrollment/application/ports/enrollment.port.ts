import type { Enrollment } from "../../domain/entity/enrollment";

export interface EnrollmentPort {
  // Fetch enrollment by user + playlist
  getByUserAndPlaylist(userUUID: string, playlistUUID: string): Promise<Enrollment | null>;

  // Save new or updated enrollment
  save(enrollment: Enrollment): Promise<Enrollment>;

  // NEW: Fetch multiple enrollments by user and playlist IDs
  getByUserAndPlaylists(userId:string, playlistIds: string[]): Promise<Enrollment[]>;

  findAll(userUUID:string): Promise<Enrollment[]>
}
