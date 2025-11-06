import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"

export default async function OwnerDashboard() {
  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()
  if (!user?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.user.id).single()

  const { data: assets } = await supabase.from("assets").select("id, amount").eq("owner_id", user.user.id)

  const totalAssets = assets?.reduce((sum, asset) => sum + (asset.amount || 0), 0) || 0

  const { data: payments } = await supabase.from("payments").select("amount, status").eq("owner_id", user.user.id)

  const pendingAmount =
    payments?.filter((p) => p.status === "pending").reduce((sum, p) => sum + (p.amount || 0), 0) || 0

  const paidAmount = payments?.filter((p) => p.status === "paid").reduce((sum, p) => sum + (p.amount || 0), 0) || 0

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">My Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Welcome, {profile?.first_name} {profile?.last_name}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">{assets?.length || 0}</div>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Properties in your name</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Asset Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">${totalAssets.toFixed(2)}</div>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Total value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-orange-600">${pendingAmount.toFixed(2)}</div>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Due for payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-green-600">${paidAmount.toFixed(2)}</div>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Payments completed</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
