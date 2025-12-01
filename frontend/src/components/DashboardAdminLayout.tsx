// app/dashboard/DashboardClientLayout.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ReactNode, useState } from 'react'

type DashboardClientLayoutProps = {
  children: ReactNode
  admin?: {
    name: string
    phone: string
    avatarUrl?: string
    role: string
  }
}

export default function DashboardAdminLayout({ children, admin }: DashboardClientLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('/dashboard')
  console.log('Admin data in layout:', admin)
  // Admin-specific navigation
  const navigation = [
    { name: 'Boshqaruv paneli', href: '/admin', icon: '📊', role: 'admin' },
    { name: 'Foydalanuvchilar', href: '/admin/users', icon: '👥', role: 'admin' },
    { name: 'Kurslar', href: '/admin/courses', icon: '📚', role: 'admin' },
    { name: 'To‘lovlar', href: '/admin/payments', icon: '💳', role: 'admin' },
    { name: 'Statistika', href: '/admin/analytics', icon: '📈', role: 'admin' },
    { name: 'Sozlamalar', href: '/admin/settings', icon: '⚙️', role: 'admin' },
    { name: 'Xabarlar', href: '/admin/messages', icon: '💬', role: 'admin' },
    { name: 'Moderatsiya', href: '/admin/moderation', icon: '🛡️', role: 'admin' },
  ]

  return (
    <div className='flex min-h-screen bg-linear-to-br from-slate-50 via-blue-50/20 to-indigo-50/10'>
      {/* Mobile Menu Button - Now moves with sidebar */}
      <div
        className={`fixed top-4 z-50 transition-all duration-300 ${
          mobileMenuOpen ? 'left-80' : 'left-4'
        } lg:hidden`}
      >
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className='p-3 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/60'
        >
          <div className='w-6 h-6 flex flex-col justify-center space-y-1'>
            <div
              className={`h-0.5 bg-slate-700 transition-all duration-300 ${
                mobileMenuOpen ? 'w-6 rotate-45 translate-y-1.5' : 'w-4'
              }`}
            />
            <div
              className={`h-0.5 bg-slate-700 transition-all duration-300 ${
                mobileMenuOpen ? 'opacity-0' : 'w-6'
              }`}
            />
            <div
              className={`h-0.5 bg-slate-700 transition-all duration-300 ${
                mobileMenuOpen ? 'w-6 -rotate-45 -translate-y-1.5' : 'w-3'
              }`}
            />
          </div>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-80 bg-white/95 backdrop-blur-2xl border-r border-slate-200/60
          transform transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
          h-screen lg:h-auto
          shadow-xl lg:shadow-none
        `}
      >
        {/* Logo and user info */}
        <div className='p-4 sm:p-6 border-b border-slate-200/60'>
          <div className='flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6'>
            <div className='w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg'>
              {admin?.role === 'admin' ? '👑' : '🧠'}
            </div>
            <div>
              <h1 className='text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent'>
                MindAcademy
              </h1>
              <p className='text-xs sm:text-sm text-slate-500 font-medium'>
                {admin?.role === 'admin' ? 'Admin Panel' : 'Psixologiya Platformasi'}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-2xl border border-slate-200/60 shadow-sm'>
            {admin?.avatarUrl ? (
              <Image
                src={admin.avatarUrl}
                alt='Admin Avatar'
                width={48}
                height={48}
                className='rounded-xl shadow-sm'
              />
            ) : (
              <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-md'>
                {admin?.name?.[0]?.toUpperCase() || 'A'}
              </div>
            )}
            <div className='flex-1 min-w-0'>
              <h2 className='font-bold text-slate-800 truncate text-base sm:text-lg'>
                {admin?.name || 'Administrator'}
              </h2>
              <p className='text-xs sm:text-sm text-slate-500 truncate'>
                {admin?.phone || '+998 99 998-99-99'}
              </p>
              {admin?.role === 'admin' && (
                <span className='inline-block mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full'>
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className='flex-1 p-4 sm:p-6 overflow-y-auto'>
          <div className='space-y-1'>
            {navigation.map(item => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  setActiveNav(item.href)
                  setMobileMenuOpen(false)
                }}
                className={`
                  relative flex items-center gap-3 sm:gap-4 py-3 sm:py-4 px-3 sm:px-4 rounded-2xl transition-all duration-200 group
                  ${
                    activeNav === item.href
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50/50 border border-blue-200/60 shadow-sm'
                      : 'hover:bg-slate-50/80 hover:shadow-sm hover:border hover:border-slate-200/40'
                  }
                `}
              >
                {/* Active indicator */}
                {activeNav === item.href && (
                  <div className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 sm:h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full' />
                )}

                <span
                  className={`
                  text-xl sm:text-2xl transition-transform duration-200
                  ${activeNav === item.href ? 'scale-110' : 'group-hover:scale-110'}
                `}
                >
                  {item.icon}
                </span>

                <div className='flex-1 flex items-center justify-between'>
                  <span
                    className={`
                    font-semibold transition-colors duration-200 text-sm sm:text-base
                    ${
                      activeNav === item.href
                        ? 'text-blue-700'
                        : 'text-slate-700 group-hover:text-slate-900'
                    }
                  `}
                  >
                    {item.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </nav>

        {/* Admin Quick Actions */}
        {admin?.role === 'admin' && (
          <div className='p-4 sm:p-6 border-t border-slate-200/60'>
            <div className='space-y-2'>
              <Link
                href='/dashboard/create-course'
                className='w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md'
              >
                <span>➕</span>
                Yangi Kurs
              </Link>
              <Link
                href='/dashboard/system-settings'
                className='w-full flex items-center justify-center gap-2 py-2 px-4 bg-orange-600 text-white rounded-xl font-semibold text-sm hover:bg-orange-700 transition-all duration-200 shadow-sm hover:shadow-md'
              >
                <span>🔧</span>
                Tizim Sozlamalari
              </Link>
            </div>
          </div>
        )}

        {/* Logout Section */}
        <div className='p-4 sm:p-6 border-t border-slate-200/60'>
          <button className='w-full flex items-center gap-3 py-3 px-4 text-slate-600 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all duration-200 border border-slate-200/60 hover:border-slate-300 shadow-sm hover:shadow-md'>
            <span className='text-xl'>🚪</span>
            <span className='font-semibold text-sm sm:text-base'>Chiqish</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className='flex-1 flex flex-col min-h-screen lg:ml-0'>
        {/* Top Bar - Only on desktop */}
        <header className='hidden lg:block sticky top-0 z-30 bg-white/95 backdrop-blur-2xl border-b border-slate-200/60 shadow-sm'>
          <div className='flex p-6 justify-between items-center'>
            {/* Welcome message with admin data */}
            <div className='flex items-center gap-3'>
              <span className='text-lg font-semibold text-gray-700'>
                Xush kelibsiz,{' '}
                <span className='text-blue-600'>{admin?.name || 'Administrator'}</span>!
                {admin?.role === 'admin' && (
                  <span className='ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full'>
                    Admin Panel
                  </span>
                )}
              </span>
            </div>

            <div className='flex gap-4'>
              {/* Notifications */}
              <button className='p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md relative'>
                <span className='text-xl'>🔔</span>
                <div className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white' />
              </button>

              {/* Quick Actions for Admin */}
              {admin?.role === 'admin' && (
                <div className='flex items-center gap-2'>
                  <Link
                    href='/dashboard/create-user'
                    className='px-4 py-2 rounded-xl bg-green-50 text-green-700 border border-green-200 hover:border-green-300 font-semibold text-sm transition-all duration-200 hover:shadow-md'
                  >
                    Yangi Foydalanuvchi
                  </Link>
                  <Link
                    href='/dashboard/reports'
                    className='px-4 py-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 hover:border-purple-300 font-semibold text-sm transition-all duration-200 hover:shadow-md'
                  >
                    Hisobotlar
                  </Link>
                </div>
              )}

              {/* Quick Actions for Regular Users */}
              {admin?.role !== 'admin' && (
                <div className='flex items-center gap-2'>
                  <button className='px-4 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:border-blue-300 font-semibold text-sm transition-all duration-200 hover:shadow-md'>
                    Yangi Kurs
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Children */}
        <main className='flex-1 overflow-y-auto'>
          <div className='p-4 sm:p-6'>{children}</div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className='fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden'
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  )
}
