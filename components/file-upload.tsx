"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSpreadsheetStore } from "@/lib/store"
import { Upload } from "lucide-react"
import { read, utils } from "xlsx"

export function FileUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const { setData } = useSpreadsheetStore()

  const processExcelFile = async (file) => {
    try {
      setIsUploading(true)

      const arrayBuffer = await file.arrayBuffer()
      const workbook = read(arrayBuffer)

      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]

      // Get the cell styles to identify highlighted cells
      const cellStyles = {}
      Object.keys(worksheet).forEach((cell) => {
        if (cell[0] !== "!") {
          // Skip special keys
          if (worksheet[cell].s && worksheet[cell].s.fgColor) {
            cellStyles[cell] = worksheet[cell].s.fgColor.rgb
          }
        }
      })

      // Convert to JSON
      const jsonData = utils.sheet_to_json(worksheet, { header: "A" })

      // Map the first row to get column headers
      const headers = jsonData[0]

      // Process the data based on color coding
      const processedData = jsonData.slice(1).map((row, index) => {
        const processedRow = {
          srNo: row.A || "",
          hsCode: row.B || "",
          htsCode: row.C || "",
          marksAndNos: row.D || "",
          description: row.E || "",
          rateInUsd: row.F || "",
          totalBoxes: row.G || "",
          totalQty: row.H || "",
          exchangeRate: row.J || "",
          netWeight: row.L || "",
          // Calculated fields will be handled by the store
        }

        return processedRow
      })

      setData(processedData)
    } catch (error) {
      console.error("Error processing Excel file:", error)
      alert("Error processing the Excel file. Please check the format and try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      processExcelFile(file)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Input id="file-upload" type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" />
      <Label
        htmlFor="file-upload"
        className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
      >
        <Upload className="h-4 w-4 mr-2" />
        {isUploading ? "Uploading..." : "Upload Excel"}
      </Label>
    </div>
  )
}

