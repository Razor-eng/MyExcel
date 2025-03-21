"use client"

import { Input } from "@/components/ui/input"
import { useSpreadsheetStore } from "@/lib/store"
import { ActivityIcon as Function } from "lucide-react"

export function SpreadsheetFormulaBar({ selectedCell, value, onChange }) {
  const { updateCell } = useSpreadsheetStore()

  const handleChange = (e) => {
    onChange(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && selectedCell) {
      updateCell(selectedCell.rowIndex, selectedCell.colKey, value)
    }
  }

  const getCellReference = () => {
    if (!selectedCell) return ""

    // Convert column index to letter (A, B, C, ...)
    const columnMap = {
      srNo: "A",
      hsCode: "B",
      htsCode: "C",
      marksAndNos: "D",
      description: "E",
      rateInUsd: "F",
      totalBoxes: "G",
      totalQty: "H",
      productValueUsd: "I",
      exchangeRate: "J",
      productValueInr: "K",
      netWeight: "L",
      amount: "M",
    }

    const column = columnMap[selectedCell.colKey] || "?"
    const row = selectedCell.rowIndex + 1

    return `${column}${row}`
  }

  return (
    <div className="flex items-center px-2 py-1 border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
      <Function className="h-4 w-4 mr-2 text-gray-500" />

      <div className="flex items-center border rounded-sm mr-2 px-2 py-0.5 bg-white dark:bg-gray-800 text-sm w-16">
        {getCellReference()}
      </div>

      <Input
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="h-7 border-gray-300 dark:border-gray-700 focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Enter a value or formula"
        disabled={!selectedCell}
      />
    </div>
  )
}

