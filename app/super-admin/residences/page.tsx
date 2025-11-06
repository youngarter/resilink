import { createClient } from "@/lib/supabase/server"
import { ResidencesTable } from "@/components/super-admin/residences-table"
import { AddResidenceDialog } from "@/components/super-admin/add-residence-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ResidencesPage() {
  const supabase = await createClient()

  const { data: residences } = await supabase
    .from("residences")
    .select(`
      *,
      cities:city_id (name, country)
    `)
    .order("created_at", { ascending: false })

  const { data: cities } = await supabase.from("cities").select("id, name")

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Residences Management</h1>
          <p className="text-muted-foreground">Create and manage properties across cities</p>
        </div>
        <AddResidenceDialog cities={cities || []} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Residences</CardTitle>
          <CardDescription>{residences?.length || 0} properties in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <ResidencesTable residences={residences || []} />
        </CardContent>
      </Card>
    </div>
  )
}
