import { createClient } from "@/lib/supabase/server"
import { AssetsTableWithSearch } from "@/components/admin/assets-table-with-search"
import { AddAssetDialog } from "@/components/admin/add-asset-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"

export default async function AssetsPage() {
  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()
  if (!user?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("city_id").eq("id", user.user.id).single()

  const { data: assets } = await supabase
    .from("assets")
    .select(`
      *,
      residences:residence_id (name, address),
      profiles:owner_id (first_name, last_name)
    `)
    .in(
      "residence_id",
      await supabase
        .from("residences")
        .select("id")
        .eq("city_id", profile?.city_id)
        .then((res) => res.data?.map((r) => r.id) || []),
    )
    .order("created_at", { ascending: false })

  const { data: residences } = await supabase.from("residences").select("id, name").eq("city_id", profile?.city_id)

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Assets Management</h1>
          <p className="text-muted-foreground">Manage properties and units across your residences</p>
        </div>
        <AddAssetDialog residences={residences || []} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Assets</CardTitle>
          <CardDescription>{assets?.length || 0} assets in your system</CardDescription>
        </CardHeader>
        <CardContent>
          <AssetsTableWithSearch assets={assets || []} />
        </CardContent>
      </Card>
    </div>
  )
}
