import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SuperAdminDashboard() {
  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.user?.id).single()

  const { data: citiesData } = await supabase
    .from("cities")
    .select("id")
    .then((res) => ({
      data: res.data || [],
    }))

  const { data: residencesData } = await supabase
    .from("residences")
    .select("id")
    .then((res) => ({
      data: res.data || [],
    }))

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome, {profile?.first_name} {profile?.last_name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Cities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{citiesData?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Active cities in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Residences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{residencesData?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Properties under management</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground mt-1">All services operational</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
