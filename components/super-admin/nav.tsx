"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Building2, MapPin, LogOut, LayoutDashboard, Menu, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

const navItems = [
  {
    name: "Dashboard",
    href: "/super-admin",
    icon: LayoutDashboard,
  },
  {
    name: "Cities",
    href: "/super-admin/cities",
    icon: MapPin,
  },
  {
    name: "Residences",
    href: "/super-admin/residences",
    icon: Building2,
  },
]

export function SuperAdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 md:hidden z-50"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex w-64 bg-card border-r border-border flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="font-bold text-lg">ResiLink</h2>
          <p className="text-xs text-muted-foreground">Super Admin</p>
        </div>

        <div className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

            return (
              <Link key={item.href} href={item.href}>
                <Button variant={isActive ? "default" : "ghost"} className="w-full justify-start">
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation Sidebar */}
      {isMobileOpen && (
        <nav className="fixed inset-0 top-16 z-40 md:hidden bg-card border-r border-border flex flex-col w-64">
          <div className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

              return (
                <Link key={item.href} href={item.href} onClick={() => setIsMobileOpen(false)}>
                  <Button variant={isActive ? "default" : "ghost"} className="w-full justify-start">
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </div>

          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </nav>
      )}
    </>
  )
}
