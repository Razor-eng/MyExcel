"use client"

export function SpreadsheetStatusBar({ rowCount, selectedCell }) {
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
    <div className="flex items-center justify-between px-4 py-1 border-t border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-xs text-gray-600 dark:text-gray-400">
      <div>
        {rowCount} row{rowCount !== 1 ? "s" : ""}
      </div>
      <div>{selectedCell ? `Cell: ${getCellReference()}` : ""}</div>
      <div>100%</div>
    </div>
  )
}

