import { getCurrentUser } from '@/lib/auth'
import AnalyticsDashboard from './AnalyticsDashboard'

// Mock data - replace with actual API calls
const mockAnalyticsData = {
  // Student Activity (last 30 days)
  studentActivity: {
    daily: [
      { date: '2024-03-01', activeStudents: 45, newRegistrations: 5, courseCompletions: 3 },
      { date: '2024-03-02', activeStudents: 52, newRegistrations: 8, courseCompletions: 7 },
      { date: '2024-03-03', activeStudents: 48, newRegistrations: 6, courseCompletions: 4 },
      { date: '2024-03-04', activeStudents: 61, newRegistrations: 12, courseCompletions: 9 },
      { date: '2024-03-05', activeStudents: 58, newRegistrations: 7, courseCompletions: 6 },
      { date: '2024-03-06', activeStudents: 65, newRegistrations: 9, courseCompletions: 8 },
      { date: '2024-03-07', activeStudents: 72, newRegistrations: 11, courseCompletions: 10 },
      { date: '2024-03-08', activeStudents: 68, newRegistrations: 8, courseCompletions: 7 },
      { date: '2024-03-09', activeStudents: 75, newRegistrations: 13, courseCompletions: 11 },
      { date: '2024-03-10', activeStudents: 81, newRegistrations: 15, courseCompletions: 14 },
      { date: '2024-03-11', activeStudents: 79, newRegistrations: 9, courseCompletions: 8 },
      { date: '2024-03-12', activeStudents: 85, newRegistrations: 11, courseCompletions: 12 },
      { date: '2024-03-13', activeStudents: 92, newRegistrations: 14, courseCompletions: 15 },
      { date: '2024-03-14', activeStudents: 88, newRegistrations: 10, courseCompletions: 9 },
      { date: '2024-03-15', activeStudents: 95, newRegistrations: 16, courseCompletions: 13 },
      { date: '2024-03-16', activeStudents: 102, newRegistrations: 18, courseCompletions: 16 },
      { date: '2024-03-17', activeStudents: 98, newRegistrations: 12, courseCompletions: 11 },
      { date: '2024-03-18', activeStudents: 105, newRegistrations: 15, courseCompletions: 14 },
      { date: '2024-03-19', activeStudents: 112, newRegistrations: 19, courseCompletions: 17 },
      { date: '2024-03-20', activeStudents: 108, newRegistrations: 14, courseCompletions: 12 },
      { date: '2024-03-21', activeStudents: 115, newRegistrations: 17, courseCompletions: 15 },
      { date: '2024-03-22', activeStudents: 122, newRegistrations: 21, courseCompletions: 18 },
      { date: '2024-03-23', activeStudents: 118, newRegistrations: 16, courseCompletions: 14 },
      { date: '2024-03-24', activeStudents: 125, newRegistrations: 19, courseCompletions: 17 },
      { date: '2024-03-25', activeStudents: 132, newRegistrations: 22, courseCompletions: 20 },
      { date: '2024-03-26', activeStudents: 128, newRegistrations: 18, courseCompletions: 16 },
      { date: '2024-03-27', activeStudents: 135, newRegistrations: 21, courseCompletions: 19 },
      { date: '2024-03-28', activeStudents: 142, newRegistrations: 24, courseCompletions: 22 },
      { date: '2024-03-29', activeStudents: 138, newRegistrations: 20, courseCompletions: 18 },
      { date: '2024-03-30', activeStudents: 145, newRegistrations: 23, courseCompletions: 21 },
    ],
    weekly: [
      { week: '2024-W09', activeStudents: 320, newRegistrations: 42, courseCompletions: 31 },
      { week: '2024-W10', activeStudents: 385, newRegistrations: 65, courseCompletions: 52 },
      { week: '2024-W11', activeStudents: 450, newRegistrations: 88, courseCompletions: 73 },
      { week: '2024-W12', activeStudents: 515, newRegistrations: 111, courseCompletions: 94 },
      { week: '2024-W13', activeStudents: 580, newRegistrations: 134, courseCompletions: 115 },
    ],
  },

  // Course Completion Rates
  courseCompletion: [
    {
      courseId: '1',
      courseName: 'Psixologiya Asoslari',
      enrolled: 145,
      completed: 89,
      completionRate: 61.4,
      averageTime: '15 kun',
    },
    {
      courseId: '2',
      courseName: 'Shaxsiy Rivojlanish',
      enrolled: 98,
      completed: 45,
      completionRate: 45.9,
      averageTime: '12 kun',
    },
    {
      courseId: '3',
      courseName: 'Murakkab Vaziyatlarda Qaror Qabul Qilish',
      enrolled: 76,
      completed: 28,
      completionRate: 36.8,
      averageTime: '18 kun',
    },
    {
      courseId: '4',
      courseName: 'Emotsional Intellekt',
      enrolled: 112,
      completed: 67,
      completionRate: 59.8,
      averageTime: '14 kun',
    },
    {
      courseId: '5',
      courseName: 'Vaqt Boshqaruvi',
      enrolled: 89,
      completed: 52,
      completionRate: 58.4,
      averageTime: '10 kun',
    },
  ],

  // Revenue by Course
  revenueByCourse: [
    { courseId: '1', courseName: 'Psixologiya Asoslari', revenue: 17800000, students: 89 },
    { courseId: '2', courseName: 'Shaxsiy Rivojlanish', revenue: 13500000, students: 45 },
    {
      courseId: '3',
      courseName: 'Murakkab Vaziyatlarda Qaror Qabul Qilish',
      revenue: 9800000,
      students: 28,
    },
    { courseId: '4', courseName: 'Emotsional Intellekt', revenue: 16750000, students: 67 },
    { courseId: '5', courseName: 'Vaqt Boshqaruvi', revenue: 10400000, students: 52 },
  ],

  // Most Watched Lessons
  mostWatchedLessons: [
    {
      lessonId: 'l1-1',
      lessonName: 'Psixologiya nima?',
      courseName: 'Psixologiya Asoslari',
      views: 892,
      completionRate: 94.2,
      averageWatchTime: '12:45',
    },
    {
      lessonId: 'l4-2',
      lessonName: 'EQ va IQ farqlari',
      courseName: 'Emotsional Intellekt',
      views: 765,
      completionRate: 91.8,
      averageWatchTime: '15:20',
    },
    {
      lessonId: 'l2-3',
      lessonName: "O'z-o'zini anglash",
      courseName: 'Shaxsiy Rivojlanish',
      views: 654,
      completionRate: 89.5,
      averageWatchTime: '18:30',
    },
    {
      lessonId: 'l5-1',
      lessonName: 'Vaqtni rejalashtirish',
      courseName: 'Vaqt Boshqaruvi',
      views: 598,
      completionRate: 92.1,
      averageWatchTime: '14:15',
    },
    {
      lessonId: 'l1-4',
      lessonName: 'Psixologik testlar',
      courseName: 'Psixologiya Asoslari',
      views: 543,
      completionRate: 87.3,
      averageWatchTime: '20:10',
    },
  ],

  // Device Statistics
  deviceStatistics: {
    devices: [
      { device: 'Mobile', percentage: 65, users: 325 },
      { device: 'Desktop', percentage: 25, users: 125 },
      { device: 'Tablet', percentage: 10, users: 50 },
    ],
    browsers: [
      { browser: 'Chrome', percentage: 45, users: 225 },
      { browser: 'Safari', percentage: 30, users: 150 },
      { browser: 'Firefox', percentage: 15, users: 75 },
      { browser: 'Edge', percentage: 8, users: 40 },
      { browser: 'Other', percentage: 2, users: 10 },
    ],
    operatingSystems: [
      { os: 'Android', percentage: 40, users: 200 },
      { os: 'iOS', percentage: 25, users: 125 },
      { os: 'Windows', percentage: 20, users: 100 },
      { os: 'macOS', percentage: 10, users: 50 },
      { os: 'Other', percentage: 5, users: 25 },
    ],
  },

  // Traffic Sources
  trafficSources: [
    { source: 'Direct', percentage: 35, users: 175 },
    { source: 'Social Media', percentage: 25, users: 125 },
    { source: 'Search Engines', percentage: 20, users: 100 },
    { source: 'Referral', percentage: 15, users: 75 },
    { source: 'Email', percentage: 5, users: 25 },
  ],

  // Overall Statistics
  overallStats: {
    totalStudents: 500,
    activeStudents: 145,
    totalCourses: 12,
    totalRevenue: 68250000,
    averageCompletionRate: 52.5,
    monthlyGrowth: 18.3,
  },
}

async function getAnalyticsData() {
  // TODO: Replace with actual API call
  // const response = await fetch('http://localhost:3001/api/admin/analytics')
  // return response.json()

  return mockAnalyticsData
}

export default async function AnalyticsPage() {
  const currentUser = await getCurrentUser()
  const analyticsData = await getAnalyticsData()

  if (currentUser?.role !== 'ADMIN') {
    return (
      <div className='p-6'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
          <h2 className='text-xl font-bold text-red-800 mb-2'>Ruxsat Yo&apos;q</h2>
          <p className='text-red-600'>Sizda admin paneliga kirish uchun ruxsat yo&apos;q.</p>
        </div>
      </div>
    )
  }

  return <AnalyticsDashboard data={analyticsData} />
}
