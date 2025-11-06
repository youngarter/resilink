import { createClient } from "@/lib/supabase/server"

export async function createNotification(userId: string, type: string, title: string, message: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    type,
    title,
    message,
    read: false,
  })

  if (error) {
    console.error("Failed to create notification:", error)
  }
}

export async function notifyPaymentCreated(ownerId: string, assetNumber: string, amount: number) {
  await createNotification(
    ownerId,
    "payment_created",
    "New Payment Request",
    `A payment request of $${amount.toFixed(2)} has been created for asset ${assetNumber}`,
  )
}

export async function notifyPaymentStatusChanged(ownerId: string, assetNumber: string, status: string) {
  await createNotification(
    ownerId,
    "payment_status_changed",
    `Payment ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    `The payment status for asset ${assetNumber} has been updated to ${status}`,
  )
}

export async function notifyProofUploaded(adminId: string, assetNumber: string, ownerName: string) {
  await createNotification(
    adminId,
    "proof_uploaded",
    "Payment Proof Uploaded",
    `${ownerName} has uploaded proof of payment for asset ${assetNumber}`,
  )
}
