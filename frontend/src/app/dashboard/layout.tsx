// app/dashboard/layout.tsx
import DashboardClientLayout from '@/components/DashboardClientLayout'
import { getCurrentUser } from '@/lib/auth'

import { ReactNode } from 'react'

type DashboardLayoutProps = {
  children: ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getCurrentUser()
  return <DashboardClientLayout user={user}>{children}</DashboardClientLayout>
}
