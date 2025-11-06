import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { OwnerNav } from "@/components/owner/nav"

export default async function OwnerLayout({
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

  if (profile?.role !== "owner") {
    redirect("/")
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <OwnerNav />
      <main className="flex-1 overflow-auto md:ml-0 ml-0 pt-16 md:pt-0">{children}</main>
    </div>
  )
}
