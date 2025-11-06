"use client"

import { useState, useMemo } from "react"
import { UploadProofDialog } from "./upload-proof-dialog"
import { SearchInput } from "@/components/ui/search-input"
import { ExportButton } from "@/components/ui/export-button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

type Payment = {
  id: string
  amount: number
  status: string
  due_date: string
  paid_date: string | null
  description: string | null
  created_at: string
  assets: { asset_number: string; residences: { name: string } }
  payment_proofs: Array<{ id: string; file_name: string; file_url: string }>
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
}

export function OwnerPaymentsTableWithSearch({ payments }: { payments: Payment[] }) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const searchTerm = search.toLowerCase()
      const matchesSearch =
        payment.assets?.asset_number.toLowerCase().includes(searchTerm) ||
        payment.assets?.residences?.name.toLowerCase().includes(searchTerm)

      const matchesStatus = statusFilter === "all" || payment.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [payments, search, statusFilter])

  const exportData = filteredPayments.map((payment) => ({
    "Asset Number": payment.assets?.asset_number,
    Residence: payment.assets?.residences?.name,
    Amount: payment.amount,
    "Due Date": format(new Date(payment.due_date), "MMM dd, yyyy"),
    "Paid Date": payment.paid_date ? format(new Date(payment.paid_date), "MMM dd, yyyy") : "Pending",
    Status: payment.status,
    "Proofs Uploaded": payment.payment_proofs?.length || 0,
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <SearchInput value={search} onChange={setSearch} placeholder="Search payments..." />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ExportButton data={exportData} filename="my-payments" />
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Proof</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {search || statusFilter !== "all" ? "No payments match your filters." : "No payment requests yet."}
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{payment.assets?.asset_number}</div>
                      <div className="text-xs text-muted-foreground">{payment.assets?.residences?.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>{format(new Date(payment.due_date), "MMM dd, yyyy")}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[payment.status as keyof typeof statusColors] || ""}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {payment.payment_proofs && payment.payment_proofs.length > 0 ? (
                      <div className="text-xs">
                        <Badge variant="outline" className="bg-green-50">
                          {payment.payment_proofs.length} file(s)
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {payment.status === "pending" && <UploadProofDialog paymentId={payment.id} />}
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
