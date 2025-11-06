import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminNav } from "@/components/admin/nav"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

  if (profile?.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminNav />
      <main className="flex-1 overflow-auto md:ml-0 ml-0 pt-16 md:pt-0">{children}</main>
    </div>
  )
}
