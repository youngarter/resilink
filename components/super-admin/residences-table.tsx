"use client"
import { EditResidenceDialog } from "./edit-residence-dialog"
import { DeleteResidenceDialog } from "./delete-residence-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"

type Residence = {
  id: string
  name: string
  address: string
  unit_count: number
  created_at: string
  cities: { name: string; country: string }
}

export function ResidencesTable({ residences }: { residences: Residence[] }) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Units</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {residences.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No residences yet. Create your first property to get started.
              </TableCell>
            </TableRow>
          ) : (
            residences.map((residence) => (
              <TableRow key={residence.id}>
                <TableCell className="font-medium">{residence.name}</TableCell>
                <TableCell>{residence.address}</TableCell>
                <TableCell>
                  {residence.cities?.name}, {residence.cities?.country}
                </TableCell>
                <TableCell>{residence.unit_count}</TableCell>
                <TableCell>{format(new Date(residence.created_at), "MMM dd, yyyy")}</TableCell>
                <TableCell className="text-right space-x-2">
                  <EditResidenceDialog residence={residence} />
                  <DeleteResidenceDialog residenceId={residence.id} residenceName={residence.name} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
