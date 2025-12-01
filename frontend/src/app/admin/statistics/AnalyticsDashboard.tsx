'use client'

import { useState } from 'react'
import { 
  Users, 
  TrendingUp, 
  BookOpen, 
  DollarSign,
  Smartphone,
  Laptop,
  Tablet,
  Target,
  Globe,
  Monitor
} from 'lucide-react'

interface AnalyticsData {
  studentActivity: {
    daily: Array<{
      date: string
      activeStudents: number
      newRegistrations: number
      courseCompletions: number
    }>
    weekly: Array<{
      week: string
      activeStudents: number
      newRegistrations: number
      courseCompletions: number
    }>
  }
  courseCompletion: Array<{
    courseId: string
    courseName: string
    enrolled: number
    completed: number
    completionRate: number
    averageTime: string
  }>
  revenueByCourse: Array<{
    courseId: string
    courseName: string
    revenue: number
    students: number
  }>
  mostWatchedLessons: Array<{
    lessonId: string
    lessonName: string
    courseName: string
    views: number
    completionRate: number
    averageWatchTime: string
  }>
  deviceStatistics: {
    devices: Array<{ device: string; percentage: number; users: number }>
    browsers: Array<{ browser: string; percentage: number; users: number }>
    operatingSystems: Array<{ os: string; percentage: number; users: number }>
  }
  trafficSources: Array<{ source: string; percentage: number; users: number }>
  overallStats: {
    totalStudents: number
    activeStudents: number
    totalCourses: number
    totalRevenue: number
    averageCompletionRate: number
    monthlyGrowth: number
  }
}

interface AnalyticsDashboardProps {
  data: AnalyticsData
}

export default function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly'>('weekly')
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'courses' | 'revenue' | 'devices'>('overview')

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uz-UZ').format(amount) + ' so&apos;m'
  }

  // Format number with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('uz-UZ').format(num)
  }

  // Get device icon
  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'Mobile': return <Smartphone size={20} />
      case 'Desktop': return <Laptop size={20} />
      case 'Tablet': return <Tablet size={20} />
      default: return <Smartphone size={20} />
    }
  }

  // Get browser icon (using generic icons since specific browser icons don't exist)
  const getBrowserIcon = (browser: string) => {
    switch (browser) {
      case 'Chrome': return <Globe size={20} className="text-green-600" />
      case 'Safari': return <Globe size={20} className="text-blue-600" />
      case 'Firefox': return <Globe size={20} className="text-orange-600" />
      case 'Edge': return <Globe size={20} className="text-blue-500" />
      default: return <Globe size={20} className="text-gray-600" />
    }
  }

  // Calculate growth percentage
  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 100
    return ((current - previous) / previous) * 100
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analitika</h1>
          <p className="text-gray-600 mt-1">Platforma faoliyati va o&apos;quvchilar statistikasi</p>
        </div>
        
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as 'daily' | 'weekly')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="daily">Kunlik</option>
            <option value="weekly">Haftalik</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Jami O&apos;quvchilar</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.overallStats.totalStudents)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <TrendingUp size={16} className="mr-1" />
            <span>+{data.overallStats.monthlyGrowth}% oyiga</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Faol O&apos;quvchilar</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.overallStats.activeStudents)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Oxirgi 30 kun ichida
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Jami Daromad</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.overallStats.totalRevenue)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="text-purple-600" size={24} />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Barcha kurslar bo&apos;yicha
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">O&apos;rtacha Yakunlash</p>
              <p className="text-2xl font-bold text-gray-900">{data.overallStats.averageCompletionRate}%</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Target className="text-orange-600" size={24} />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Kurs yakunlash darajasi
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Umumiy Ko&apos;rinish', icon: <TrendingUp size={18} /> },
              { id: 'students', name: 'O&apos;quvchilar Faolligi', icon: <Users size={18} /> },
              { id: 'courses', name: 'Kurslar Statistikasi', icon: <BookOpen size={18} /> },
              { id: 'revenue', name: 'Daromad Tahlili', icon: <DollarSign size={18} /> },
              { id: 'devices', name: 'Qurilmalar va Manbalar', icon: <Monitor size={18} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Student Activity Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-4">O&apos;quvchilar Faolligi ({timeRange === 'daily' ? 'Kunlik' : 'Haftalik'})</h3>
                  <div className="space-y-3">
                    {(timeRange === 'daily' ? data.studentActivity.daily.slice(-7) : data.studentActivity.weekly).map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                        <span className="text-sm font-medium">
                          {timeRange === 'daily' ? new Date(item.date).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' }) : item.week}
                        </span>
                        <div className="flex gap-4 text-sm">
                          <span className="text-blue-600">{item.activeStudents} faol</span>
                          <span className="text-green-600">+{item.newRegistrations} yangi</span>
                          <span className="text-purple-600">{item.courseCompletions} tugatgan</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Completion */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-4">Kurslar Bo&apos;yicha Yakunlash Darajasi</h3>
                  <div className="space-y-3">
                    {data.courseCompletion.slice(0, 5).map((course, index) => (
                      <div key={course.courseId} className="bg-white p-3 rounded border">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-sm">{course.courseName}</span>
                          <span className="text-sm font-semibold">{course.completionRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${course.completionRate}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                          <span>{course.completed}/{course.enrolled} o&apos;quvchi</span>
                          <span>O&apos;rtacha: {course.averageTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Student Growth */}
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold mb-4">O&apos;quvchilar O&apos;sishi</h3>
                  <div className="space-y-4">
                    {data.studentActivity.weekly.map((week, index) => {
                      const previousWeek = data.studentActivity.weekly[index - 1]
                      const growth = previousWeek ? calculateGrowth(week.activeStudents, previousWeek.activeStudents) : 0
                      
                      return (
                        <div key={week.week} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">{week.week}</div>
                            <div className="text-sm text-gray-600">{week.activeStudents} faol o&apos;quvchi</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">+{week.newRegistrations} yangi</div>
                            {previousWeek && (
                              <div className={`text-sm ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {growth >= 0 ? '↑' : '↓'} {Math.abs(growth).toFixed(1)}%
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Course Completion Rates */}
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold mb-4">Kurs Yakunlash Statistikasi</h3>
                  <div className="space-y-4">
                    {data.courseCompletion.map((course) => (
                      <div key={course.courseId} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{course.courseName}</h4>
                          <span className="text-lg font-bold text-blue-600">{course.completionRate}%</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Yozilgan: {course.enrolled}</span>
                          <span>Yakunlagan: {course.completed}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${course.completionRate}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Most Watched Lessons */}
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold mb-4">Eng Ko&apos;p Ko&apos;rilgan Darslar</h3>
                  <div className="space-y-4">
                    {data.mostWatchedLessons.map((lesson) => (
                      <div key={lesson.lessonId} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{lesson.lessonName}</h4>
                            <p className="text-sm text-gray-600">{lesson.courseName}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-blue-600">{formatNumber(lesson.views)}</div>
                            <div className="text-sm text-gray-600">ko&apos;rish</div>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Yakunlash: {lesson.completionRate}%</span>
                          <span>O&apos;rtacha vaqt: {lesson.averageWatchTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Performance */}
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold mb-4">Kurslar Samaradorligi</h3>
                  <div className="space-y-4">
                    {data.courseCompletion.map((course) => (
                      <div key={course.courseId} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3">{course.courseName}</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-600">Yozilgan</div>
                            <div className="font-semibold">{formatNumber(course.enrolled)}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Yakunlagan</div>
                            <div className="font-semibold">{formatNumber(course.completed)}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Yakunlash Darajasi</div>
                            <div className="font-semibold text-green-600">{course.completionRate}%</div>
                          </div>
                          <div>
                            <div className="text-gray-600">O&apos;rtacha Vaqt</div>
                            <div className="font-semibold">{course.averageTime}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Revenue Tab */}
          {activeTab === 'revenue' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue by Course */}
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold mb-4">Kurslar Bo&apos;yicha Daromad</h3>
                  <div className="space-y-4">
                    {data.revenueByCourse.map((course) => (
                      <div key={course.courseId} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{course.courseName}</h4>
                            <p className="text-sm text-gray-600">{course.students} o&apos;quvchi</p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-green-600">{formatCurrency(course.revenue)}</div>
                            <div className="text-sm text-gray-600">
                              O&apos;rtacha: {formatCurrency(Math.round(course.revenue / course.students))}
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ 
                              width: `${(course.revenue / data.overallStats.totalRevenue) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revenue Summary */}
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold mb-4">Daromad Xulosasi</h3>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
                      <div className="text-3xl font-bold mb-2">
                        {formatCurrency(data.overallStats.totalRevenue)}
                      </div>
                      <div className="text-blue-100">Jami Daromad</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">
                          {formatCurrency(data.revenueByCourse[0].revenue)}
                        </div>
                        <div className="text-sm text-green-800">Eng Yuqori Kurs</div>
                        <div className="text-xs text-green-600">{data.revenueByCourse[0].courseName}</div>
                      </div>
                      
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-xl font-bold text-blue-600">
                          {formatCurrency(Math.round(data.overallStats.totalRevenue / data.overallStats.totalStudents))}
                        </div>
                        <div className="text-sm text-blue-800">O&apos;quvchi Boshiga</div>
                        <div className="text-xs text-blue-600">O&apos;rtacha Daromad</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Devices Tab */}
          {activeTab === 'devices' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Device Usage */}
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold mb-4">Qurilmalar Bo&apos;yicha Taqsimot</h3>
                  <div className="space-y-4">
                    {data.deviceStatistics.devices.map((device) => (
                      <div key={device.device} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          {getDeviceIcon(device.device)}
                          <span className="font-medium">{device.device}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{device.percentage}%</div>
                          <div className="text-sm text-gray-600">{device.users} foydalanuvchi</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Browser Usage */}
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold mb-4">Brauzerlar Bo&apos;yicha Taqsimot</h3>
                  <div className="space-y-4">
                    {data.deviceStatistics.browsers.map((browser) => (
                      <div key={browser.browser} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          {getBrowserIcon(browser.browser)}
                          <span className="font-medium">{browser.browser}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{browser.percentage}%</div>
                          <div className="text-sm text-gray-600">{browser.users} foydalanuvchi</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Traffic Sources */}
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold mb-4">Trafik Manbalari</h3>
                  <div className="space-y-4">
                    {data.trafficSources.map((source) => (
                      <div key={source.source} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          <Target size={20} className="text-gray-400" />
                          <span className="font-medium">{source.source}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{source.percentage}%</div>
                          <div className="text-sm text-gray-600">{source.users} foydalanuvchi</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}