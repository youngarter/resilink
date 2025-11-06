"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { exportToCSV } from "@/lib/utils/export"

interface ExportButtonProps {
  data: any[]
  filename: string
}

export function ExportButton({ data, filename }: ExportButtonProps) {
  const handleExport = () => {
    if (data.length === 0) {
      alert("No data to export")
      return
    }
    exportToCSV(data, filename)
  }

  return (
    <Button onClick={handleExport} variant="outline" size="sm">
      <Download className="w-4 h-4 mr-2" />
      Export CSV
    </Button>
  )
}
