export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) {
    console.log("No data to export")
    return
  }

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          if (value === null || value === undefined) return ""
          if (typeof value === "string" && value.includes(",")) {
            return `"${value}"`
          }
          if (typeof value === "object") {
            return `"${JSON.stringify(value)}"`
          }
          return value
        })
        .join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export function flattenForExport(data: any[], keyMap: Record<string, string>) {
  return data.map((item) => {
    const flatItem: Record<string, any> = {}
    Object.entries(keyMap).forEach(([sourceKey, displayKey]) => {
      const keys = sourceKey.split(".")
      let value = item
      for (const key of keys) {
        value = value?.[key]
      }
      flatItem[displayKey] = value
    })
    return flatItem
  })
}
