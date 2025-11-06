"use client"

import { UploadProofDialog } from "./upload-proof-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

export function OwnerPaymentsTable({ payments }: { payments: Payment[] }) {
  return (
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
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No payment requests yet.
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
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
  )
}
