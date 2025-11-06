import { createClient } from "@/lib/supabase/server"
import { CitiesTableWithSearch } from "@/components/super-admin/cities-table-with-search"
import { AddCityDialog } from "@/components/super-admin/add-city-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function CitiesPage() {
  const supabase = await createClient()

  const { data: cities } = await supabase.from("cities").select("*").order("created_at", { ascending: false })

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Cities Management</h1>
          <p className="text-muted-foreground">Create and manage cities for the system</p>
        </div>
        <AddCityDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Cities</CardTitle>
          <CardDescription>{cities?.length || 0} cities in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <CitiesTableWithSearch cities={cities || []} />
        </CardContent>
      </Card>
    </div>
  )
}
