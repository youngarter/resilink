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

type Residence = {
  id: string
  name: string
}

export function AddAssetDialog({ residences }: { residences: Residence[] }) {
  const [open, setOpen] = useState(false)
  const [residenceId, setResidenceId] = useState("")
  const [assetNumber, setAssetNumber] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("0")
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

      const { error: dbError } = await supabase.from("assets").insert({
        residence_id: residenceId,
        owner_id: user?.user?.id,
        asset_number: assetNumber,
        description: description || null,
        amount: Number.parseFloat(amount),
      })

      if (dbError) throw dbError

      setResidenceId("")
      setAssetNumber("")
      setDescription("")
      setAmount("0")
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
          Add Asset
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
          <DialogDescription>Create a new property asset for a residence</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="residence">Residence</Label>
            <Select value={residenceId} onValueChange={setResidenceId}>
              <SelectTrigger id="residence">
                <SelectValue placeholder="Select a residence" />
              </SelectTrigger>
              <SelectContent>
                {residences.map((residence) => (
                  <SelectItem key={residence.id} value={residence.id}>
                    {residence.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assetNumber">Asset Number</Label>
            <Input
              id="assetNumber"
              placeholder="e.g., APT-101"
              value={assetNumber}
              onChange={(e) => setAssetNumber(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g., 2 Bedroom Apartment"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
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

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Asset"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
