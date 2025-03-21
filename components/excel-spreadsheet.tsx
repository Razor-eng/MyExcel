"use client"

import { useState } from "react"
import { SpreadsheetHeader } from "./spreadsheet-header"
import { SpreadsheetGrid } from "./spreadsheet-grid"
import { SpreadsheetFormulaBar } from "./spreadsheet-formula-bar"
import { SpreadsheetStatusBar } from "./spreadsheet-status-bar"
import { SpreadsheetTabs } from "./spreadsheet-tabs"
import { useSpreadsheetStore } from "@/lib/store"

export function ExcelSpreadsheet() {
  const { data } = useSpreadsheetStore()
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })
  const [filterText, setFilterText] = useState("")
  const [selectedCell, setSelectedCell] = useState(null)
  const [activeCellValue, setActiveCellValue] = useState("")

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

  const handleCellSelect = (cell, value) => {
    setSelectedCell(cell)
    setActiveCellValue(value || "")
  }

  const handleFormulaChange = (value) => {
    setActiveCellValue(value)
  }

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-gray-950">
      <SpreadsheetHeader filterText={filterText} setFilterText={setFilterText} />

      <SpreadsheetFormulaBar selectedCell={selectedCell} value={activeCellValue} onChange={handleFormulaChange} />

      <div className="flex-1 overflow-hidden">
        <SpreadsheetGrid
          data={sortedData}
          sortConfig={sortConfig}
          setSortConfig={setSortConfig}
          onCellSelect={handleCellSelect}
          activeCellValue={activeCellValue}
        />
      </div>

      <SpreadsheetTabs />

      <SpreadsheetStatusBar rowCount={data.length} selectedCell={selectedCell} />
    </div>
  )
}

