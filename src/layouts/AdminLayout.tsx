import { Outlet } from 'react-router-dom'

import AdminSidebar from '@/components/admin/AdminSidebar'
import Header from '@/components/layout/Header'

export default function AdminLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-8 bg-muted/30">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
