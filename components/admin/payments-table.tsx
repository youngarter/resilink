"use client"

import { EditPaymentDialog } from "./edit-payment-dialog"
import { DeletePaymentDialog } from "./delete-payment-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

type Payment = {
  id: string
  amount: number
  status: string
  due_date: string
  paid_date: string | null
  created_at: string
  assets: { asset_number: string; residences: { name: string } }
  profiles: { first_name: string | null; last_name: string | null }
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
}

export function PaymentsTable({ payments }: { payments: Payment[] }) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No payments yet. Create your first payment to get started.
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
                <TableCell>
                  {payment.profiles?.first_name} {payment.profiles?.last_name}
                </TableCell>
                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                <TableCell>{format(new Date(payment.due_date), "MMM dd, yyyy")}</TableCell>
                <TableCell>
                  <Badge className={statusColors[payment.status as keyof typeof statusColors] || ""}>
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <EditPaymentDialog payment={payment} />
                  <DeletePaymentDialog paymentId={payment.id} assetNumber={payment.assets?.asset_number} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
