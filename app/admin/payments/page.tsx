import { createClient } from "@/lib/supabase/server"
import { PaymentsTableWithSearch } from "@/components/admin/payments-table-with-search"
import { AddPaymentDialog } from "@/components/admin/add-payment-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"

export default async function PaymentsPage() {
  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()
  if (!user?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("city_id").eq("id", user.user.id).single()

  const residenceIds = await supabase
    .from("residences")
    .select("id")
    .eq("city_id", profile?.city_id)
    .then((res) => res.data?.map((r) => r.id) || [])

  const { data: payments } = await supabase
    .from("payments")
    .select(`
      *,
      assets:asset_id (asset_number, residences:residence_id (name)),
      profiles:owner_id (first_name, last_name)
    `)
    .in(
      "asset_id",
      await supabase
        .from("assets")
        .select("id")
        .in("residence_id", residenceIds)
        .then((res) => res.data?.map((a) => a.id) || []),
    )
    .order("created_at", { ascending: false })

  const { data: assets } = await supabase
    .from("assets")
    .select("id, asset_number, residences:residence_id (name)")
    .in("residence_id", residenceIds)

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Payments Management</h1>
          <p className="text-muted-foreground">Create and track payment requests for owners</p>
        </div>
        <AddPaymentDialog assets={assets || []} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Payments</CardTitle>
          <CardDescription>{payments?.length || 0} payment requests</CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentsTableWithSearch payments={payments || []} />
        </CardContent>
      </Card>
    </div>
  )
}
