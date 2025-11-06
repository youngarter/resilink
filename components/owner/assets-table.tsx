"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"

type Asset = {
  id: string
  asset_number: string
  description: string | null
  amount: number
  created_at: string
  residences: { name: string; address: string; cities: { name: string; country: string } }
}

export function OwnerAssetsTable({ assets }: { assets: Asset[] }) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset Number</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Registered</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                You don't have any assets registered yet.
              </TableCell>
            </TableRow>
          ) : (
            assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell className="font-medium">{asset.asset_number}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{asset.residences?.name}</div>
                    <div className="text-xs text-muted-foreground">{asset.description || "No description"}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {asset.residences?.cities?.name}, {asset.residences?.cities?.country}
                </TableCell>
                <TableCell>${asset.amount.toFixed(2)}</TableCell>
                <TableCell>{format(new Date(asset.created_at), "MMM dd, yyyy")}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
