import { createClient } from "@/lib/supabase/server"
import { OwnerPaymentsTableWithSearch } from "@/components/owner/payments-table-with-search"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"

export default async function MyPaymentsPage() {
  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()
  if (!user?.user) {
    redirect("/auth/login")
  }

  const { data: payments } = await supabase
    .from("payments")
    .select(`
      *,
      assets:asset_id (asset_number, residences:residence_id (name)),
      payment_proofs (*)
    `)
    .eq("owner_id", user.user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">My Payments</h1>
        <p className="text-muted-foreground">Track and manage your payment requests</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Requests</CardTitle>
          <CardDescription>{payments?.length || 0} payment requests</CardDescription>
        </CardHeader>
        <CardContent>
          <OwnerPaymentsTableWithSearch payments={payments || []} />
        </CardContent>
      </Card>
    </div>
  )
}
