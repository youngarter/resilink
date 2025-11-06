import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.user?.id).single()

  const { data: residencesData } = await supabase
    .from("residences")
    .select("id")
    .eq("city_id", profile?.city_id)
    .then((res) => ({
      data: res.data || [],
    }))

  const { data: assetsData } = await supabase
    .from("assets")
    .select("id, amount")
    .in("residence_id", residencesData?.map((r) => r.id) || [])
    .then((res) => ({
      data: res.data || [],
    }))

  const totalAssets = assetsData?.reduce((sum, asset) => sum + (asset.amount || 0), 0) || 0

  const { data: paymentsData } = await supabase
    .from("payments")
    .select("amount, status")
    .in("asset_id", assetsData?.map((a) => a.id) || [])
    .then((res) => ({
      data: res.data || [],
    }))

  const pendingAmount =
    paymentsData?.filter((p) => p.status === "pending").reduce((sum, p) => sum + (p.amount || 0), 0) || 0

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Welcome, {profile?.first_name} {profile?.last_name}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Residences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">{residencesData?.length || 0}</div>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Properties under your management</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">${totalAssets.toFixed(2)}</div>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Total asset value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-orange-600">${pendingAmount.toFixed(2)}</div>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Awaiting payment</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
