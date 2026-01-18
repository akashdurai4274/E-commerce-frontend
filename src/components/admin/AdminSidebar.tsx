import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Star,
  Plus,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: Package,
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Reviews',
    href: '/admin/reviews',
    icon: Star,
  },
]

export default function AdminSidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 border-r bg-background h-[calc(100vh-4rem)] sticky top-16">
      <div className="flex flex-col h-full p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    isActive && 'bg-secondary'
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            )
          })}
        </div>

        <Separator className="my-4" />

        <Link to="/admin/product/new">
          <Button className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            New Product
          </Button>
        </Link>
      </div>
    </aside>
  )
}
