"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

type Asset = {
  id: string
  asset_number: string
  residences: { name: string }
}

export function AddPaymentDialog({ assets }: { assets: Asset[] }) {
  const [open, setOpen] = useState(false)
  const [assetId, setAssetId] = useState("")
  const [amount, setAmount] = useState("0")
  const [dueDate, setDueDate] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: user } = await supabase.auth.getUser()

      // Get asset to find owner
      const { data: asset } = await supabase.from("assets").select("owner_id").eq("id", assetId).single()

      const { error: dbError } = await supabase.from("payments").insert({
        asset_id: assetId,
        owner_id: asset?.owner_id,
        amount: Number.parseFloat(amount),
        due_date: dueDate,
        description: description || null,
        status: "pending",
      })

      if (dbError) throw dbError

      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user?.user?.id)
        .single()

      const assetNum = assets.find((a) => a.id === assetId)?.asset_number || ""

      await supabase.from("notifications").insert({
        user_id: asset?.owner_id,
        type: "payment_created",
        title: "New Payment Request",
        message: `A payment request of $${Number.parseFloat(amount).toFixed(2)} has been created for asset ${assetNum}`,
        read: false,
      })

      setAssetId("")
      setAmount("0")
      setDueDate("")
      setDescription("")
      setOpen(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-sm md:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Payment</DialogTitle>
          <DialogDescription>Create a payment request for an asset owner</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="asset">Asset</Label>
            <Select value={assetId} onValueChange={setAssetId}>
              <SelectTrigger id="asset">
                <SelectValue placeholder="Select an asset" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((asset) => (
                  <SelectItem key={asset.id} value={asset.id}>
                    {asset.asset_number} - {asset.residences?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g., Monthly maintenance fee"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Payment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
