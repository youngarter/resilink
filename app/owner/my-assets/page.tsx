import { createClient } from "@/lib/supabase/server"
import { OwnerAssetsTable } from "@/components/owner/assets-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"

export default async function MyAssetsPage() {
  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()
  if (!user?.user) {
    redirect("/auth/login")
  }

  const { data: assets } = await supabase
    .from("assets")
    .select(`
      *,
      residences:residence_id (name, address, cities:city_id (name, country))
    `)
    .eq("owner_id", user.user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">My Assets</h1>
        <p className="text-muted-foreground">View all your properties and units</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Properties</CardTitle>
          <CardDescription>{assets?.length || 0} assets registered to you</CardDescription>
        </CardHeader>
        <CardContent>
          <OwnerAssetsTable assets={assets || []} />
        </CardContent>
      </Card>
    </div>
  )
}
