// import type { ICourseRepository } from '@/modules/course/application/repository/course.repository'
// import { Course, Playlist } from '@/modules/course/domain/entities/course.entity'
// import { prisma } from '@/shared/client'
// import type { CreateCourseInput } from '../interface/course.interface'

// export class PrismaCourseRepository implements ICourseRepository {
//   async getAllCourses(): Promise<Course[]> {
//     const records = await prisma.course.findMany()

//     return records.map(
//       record =>
//         new Course(
//           record.id,
//           record.title,
//           record.description,
//           record.subtitles,
//           record.videoUrl,
//           record.thumbnailUrl,
//           record.categoryId,
//           record.level,
//           record.price,
//           record.createdAt,
//           record.updatedAt,
//           record.status,
//           record.publishedAt,
//           record.playlistId,
//           record.order
//         )
//     )
//   }

//   async createCourse(courseData: CreateCourseInput): Promise<Course> {
//     let playlistId = courseData.playlistId ?? null
//     console.log('courseData', courseData)
//     if (courseData.newPlaylist) {
//       const newPlaylist = await prisma.playlist.create({
//         data: {
//           title: courseData.newPlaylist.title,
//           description: courseData.newPlaylist.description,
//           playlistThumbnailUrl: courseData.newPlaylist.playlistThumbnailUrl,
//         },
//       })
//       playlistId = newPlaylist.id
//     }

//     // 2️⃣ Create course
//     const record = await prisma.course.create({
//       data: {
//         title: courseData.title,
//         description: courseData.description,
//         subtitles: courseData.subtitles,
//         videoUrl: courseData.videoUrl,
//         thumbnailUrl: courseData.thumbnailUrl,
//         categoryId: courseData.categoryId,
//         level: courseData.level,
//         price: courseData.price,
//         status: courseData.status ?? 'DRAFT',
//         playlistId: playlistId,
//         order: courseData.order ?? null,
//         publishedAt: courseData.publishedAt ?? null,
//       },
//     })

//     return new Course(
//       record.id,
//       record.title,
//       record.description,
//       record.subtitles,
//       record.videoUrl,
//       record.thumbnailUrl,
//       record.categoryId,
//       record.level,
//       record.price,
//       record.createdAt,
//       record.updatedAt,
//       record.status,
//       record.publishedAt,
//       record.playlistId,
//       record.order
//     )
//   }

//   // Get playlists
//   async getCoursePlaylists(): Promise<Playlist[]> {
//     const playlists = await prisma.playlist.findMany()

//     return playlists.map(
//       playlist =>
//         new Playlist(
//           playlist.id,
//           playlist.title,
//           playlist.description,
//           playlist.playlistThumbnailUrl,
//           playlist.createdAt,
//           playlist.updatedAt
//         )
//     )
//   }
// }
