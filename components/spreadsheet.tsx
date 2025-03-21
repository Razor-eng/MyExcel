"use client"

import { useState } from "react"
import { FileUpload } from "./file-upload"
import { SpreadsheetGrid } from "./spreadsheet-grid"
import { SpreadsheetControls } from "./spreadsheet-controls"
import { useSpreadsheetStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Download, Plus, Trash2, FileSpreadsheet } from "lucide-react"
import { utils, writeFile } from "xlsx"
import { Card } from "@/components/ui/card"

export function Spreadsheet() {
  const { data, addRow, clearData } = useSpreadsheetStore()
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })
  const [filterText, setFilterText] = useState("")

  const handleExport = () => {
    const worksheet = utils.json_to_sheet(data)
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, worksheet, "Spreadsheet")
    writeFile(workbook, "spreadsheet-export.xlsx")
  }

  const filteredData = data.filter((row) => {
    if (!filterText) return true
    return Object.values(row).some(
      (value) => value && value.toString().toLowerCase().includes(filterText.toLowerCase()),
    )
  })

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0

    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1
    }
    return 0
  })

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-4 shadow-md">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-medium">Excel Spreadsheet</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <FileUpload />
            <Button variant="outline" size="sm" onClick={addRow}>
              <Plus className="h-4 w-4 mr-2" />
              Add Row
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={clearData}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <SpreadsheetControls
            filterText={filterText}
            setFilterText={setFilterText}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
          />
        </div>
      </Card>

      <Card className="p-0 overflow-hidden shadow-md border">
        <div className="overflow-auto">
          <SpreadsheetGrid data={sortedData} sortConfig={sortConfig} setSortConfig={setSortConfig} />
        </div>
      </Card>
    </div>
  )
}

