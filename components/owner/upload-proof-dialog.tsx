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
import { Upload } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function UploadProofDialog({ paymentId }: { paymentId: string }) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError("Please select a file")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Upload file to storage
      const fileExt = file.name.split(".").pop()
      const fileName = `${paymentId}-${Date.now()}.${fileExt}`
      const filePath = `payment-proofs/${fileName}`

      const { error: uploadError, data } = await supabase.storage.from("payment-proofs").upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: publicUrl } = supabase.storage.from("payment-proofs").getPublicUrl(filePath)

      // Insert proof record
      const { error: dbError } = await supabase.from("payment_proofs").insert({
        payment_id: paymentId,
        file_url: publicUrl.publicUrl,
        file_name: file.name,
      })

      if (dbError) throw dbError

      const { data: user } = await supabase.auth.getUser()
      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user?.user?.id)
        .single()

      const { data: payment } = await supabase
        .from("payments")
        .select("assets:asset_id (asset_number)")
        .eq("id", paymentId)
        .single()

      const { data: admins } = await supabase.from("profiles").select("id").eq("role", "admin")

      if (admins) {
        for (const admin of admins) {
          await supabase.from("notifications").insert({
            user_id: admin.id,
            type: "proof_uploaded",
            title: "Payment Proof Uploaded",
            message: `${profile?.first_name} ${profile?.last_name} has uploaded proof for asset ${payment?.assets?.asset_number}`,
            read: false,
          })
        }
      }

      setFile(null)
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
        <Button size="sm" variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Upload Proof
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-sm">
        <DialogHeader>
          <DialogTitle>Upload Payment Proof</DialogTitle>
          <DialogDescription>Upload a receipt or transfer confirmation to prove payment</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Input
              id="file"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
            <p className="text-xs text-muted-foreground">Accepted formats: JPG, PNG, PDF (Max 5MB)</p>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Uploading..." : "Upload Proof"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
