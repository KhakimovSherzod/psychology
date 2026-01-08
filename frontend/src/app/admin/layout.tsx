// app/dashboard/layout.tsx

import DashboardAdminLayout from '@/components/DashboardAdminLayout'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'

import { ReactNode } from 'react'

type DashboardLayoutProps = {
  children: ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const admin = await getCurrentUser()
  console.log('Current Admin:', admin)
  if (admin.role === 'ADMIN')
    return <DashboardAdminLayout admin={admin}>{children}</DashboardAdminLayout>
  return (
    <div className='text-4xl text-center mt-48 text-red-600 font-bold'>
      Kirish admin bolmagan odamlar uchun taqiqlanadi!{' '}
      <Link href='/' className='text-blue-600 underline'>
        bosh sahifa
      </Link>
    </div>
  )
}
