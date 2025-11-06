"use client"

import { useState, useMemo } from "react"
import { EditCityDialog } from "./edit-city-dialog"
import { DeleteCityDialog } from "./delete-city-dialog"
import { SearchInput } from "@/components/ui/search-input"
import { ExportButton } from "@/components/ui/export-button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"

type City = {
  id: string
  name: string
  country: string
  created_at: string
}

export function CitiesTableWithSearch({ cities }: { cities: City[] }) {
  const [search, setSearch] = useState("")

  const filteredCities = useMemo(() => {
    return cities.filter((city) => {
      const searchTerm = search.toLowerCase()
      return city.name.toLowerCase().includes(searchTerm) || city.country.toLowerCase().includes(searchTerm)
    })
  }, [cities, search])

  const exportData = filteredCities.map((city) => ({
    "City Name": city.name,
    Country: city.country,
    "Created Date": format(new Date(city.created_at), "MMM dd, yyyy"),
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search cities..." />
        <ExportButton data={exportData} filename="cities" />
      </div>

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
            {filteredCities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  {search ? "No cities match your search." : "No cities yet. Create your first city to get started."}
                </TableCell>
              </TableRow>
            ) : (
              filteredCities.map((city) => (
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
    </div>
  )
}
