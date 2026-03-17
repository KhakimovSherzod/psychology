'use client'

import { CourseManagementProps } from './types/course.management.type'

export async function CoursesManagement({ playlists }: CourseManagementProps) {
  return { playlists }
}
