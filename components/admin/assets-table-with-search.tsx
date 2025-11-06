"use client"

import { useState, useMemo } from "react"
import { EditAssetDialog } from "./edit-asset-dialog"
import { DeleteAssetDialog } from "./delete-asset-dialog"
import { SearchInput } from "@/components/ui/search-input"
import { ExportButton } from "@/components/ui/export-button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"

type Asset = {
  id: string
  asset_number: string
  description: string | null
  amount: number
  created_at: string
  residences: { name: string; address: string }
  profiles: { first_name: string | null; last_name: string | null }
}

export function AssetsTableWithSearch({ assets }: { assets: Asset[] }) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const searchTerm = search.toLowerCase()
      const matchesSearch =
        asset.asset_number.toLowerCase().includes(searchTerm) ||
        asset.residences?.name.toLowerCase().includes(searchTerm) ||
        asset.profiles?.first_name?.toLowerCase().includes(searchTerm) ||
        asset.profiles?.last_name?.toLowerCase().includes(searchTerm)

      return matchesSearch
    })
  }, [assets, search])

  const exportData = filteredAssets.map((asset) => ({
    "Asset Number": asset.asset_number,
    Residence: asset.residences?.name,
    Address: asset.residences?.address,
    Owner: `${asset.profiles?.first_name} ${asset.profiles?.last_name}`,
    Amount: asset.amount,
    "Created Date": format(new Date(asset.created_at), "MMM dd, yyyy"),
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search assets..." />
        <ExportButton data={exportData} filename="assets" />
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset Number</TableHead>
              <TableHead>Residence</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {search ? "No assets match your search." : "No assets yet. Create your first asset to get started."}
                </TableCell>
              </TableRow>
            ) : (
              filteredAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.asset_number}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{asset.residences?.name}</div>
                      <div className="text-xs text-muted-foreground">{asset.residences?.address}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {asset.profiles?.first_name} {asset.profiles?.last_name}
                  </TableCell>
                  <TableCell>${asset.amount.toFixed(2)}</TableCell>
                  <TableCell>{format(new Date(asset.created_at), "MMM dd, yyyy")}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <EditAssetDialog asset={asset} />
                    <DeleteAssetDialog assetId={asset.id} assetNumber={asset.asset_number} />
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
