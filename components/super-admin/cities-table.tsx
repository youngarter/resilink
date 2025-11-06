"use client"
import { EditCityDialog } from "./edit-city-dialog"
import { DeleteCityDialog } from "./delete-city-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"

type City = {
  id: string
  name: string
  country: string
  created_at: string
}

export function CitiesTable({ cities }: { cities: City[] }) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>City Name</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                No cities yet. Create your first city to get started.
              </TableCell>
            </TableRow>
          ) : (
            cities.map((city) => (
              <TableRow key={city.id}>
                <TableCell className="font-medium">{city.name}</TableCell>
                <TableCell>{city.country}</TableCell>
                <TableCell>{format(new Date(city.created_at), "MMM dd, yyyy")}</TableCell>
                <TableCell className="text-right space-x-2">
                  <EditCityDialog city={city} />
                  <DeleteCityDialog cityId={city.id} cityName={city.name} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
