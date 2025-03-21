"use client"

import { useState, useRef, useEffect } from "react"
import { useSpreadsheetStore } from "@/lib/store"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Input } from "@/components/ui/input"

export function SpreadsheetGrid({ data, sortConfig, setSortConfig, onCellSelect, activeCellValue }) {
  const { updateCell } = useSpreadsheetStore()
  const [selectedCell, setSelectedCell] = useState(null)
  const [selectedRange, setSelectedRange] = useState(null)
  const [dragStart, setDragStart] = useState(null)
  const [columnWidths, setColumnWidths] = useState({})
  const [resizingColumn, setResizingColumn] = useState(null)
  const [startX, setStartX] = useState(0)
  const [startWidth, setStartWidth] = useState(0)
  const inputRef = useRef(null)
  const tableRef = useRef(null)

  const columns = [
    { key: "srNo", label: "SR No", editable: true, width: 80 },
    { key: "hsCode", label: "HS CODE", editable: true, width: 120 },
    { key: "htsCode", label: "HTS CODE", editable: true, width: 120 },
    { key: "marksAndNos", label: "MARKS & NOS", editable: true, width: 150 },
    { key: "description", label: "DESCRIPTION OF GOODS", editable: true, width: 200 },
    { key: "rateInUsd", label: "RATE IN USD", editable: true, numeric: true, width: 120 },
    { key: "totalBoxes", label: "TOTAL No. OF BOXES", editable: true, numeric: true, width: 150 },
    { key: "totalQty", label: "TOTAL QTY", editable: true, numeric: true, width: 120 },
    { key: "productValueUsd", label: "PRODUCT VALUE IN USD", editable: false, calculated: true, width: 180 },
    { key: "exchangeRate", label: "EXCHANGE RATE", editable: true, numeric: true, width: 140 },
    { key: "productValueInr", label: "PRODUCT VALUE IN INR", editable: false, calculated: true, width: 180 },
    { key: "netWeight", label: "Net Weight", editable: true, numeric: true, width: 120 },
    { key: "amount", label: "AMOUNT", editable: false, calculated: true, width: 120 },
  ]

  // Initialize column widths
  useEffect(() => {
    const initialWidths = {}
    columns.forEach((col) => {
      initialWidths[col.key] = col.width || 120
    })
    setColumnWidths(initialWidths)
  }, [])

  // Update cell when activeCellValue changes and Enter is pressed
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && selectedCell) {
        updateCell(selectedCell.rowIndex, selectedCell.colKey, activeCellValue)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedCell, activeCellValue, updateCell])

  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const handleCellClick = (rowIndex, colKey) => {
    const newSelectedCell = { rowIndex, colKey }
    setSelectedCell(newSelectedCell)
    setSelectedRange(null)

    // Get the cell value to display in the formula bar
    const cellValue = data[rowIndex][colKey] || ""
    onCellSelect(newSelectedCell, cellValue)
  }

  const handleCellChange = (e, rowIndex, colKey) => {
    const value = e.target.value
    updateCell(rowIndex, colKey, value)
  }

  const handleCellBlur = () => {
    // Don't clear selected cell on blur to keep the cell reference in the formula bar
  }

  const handleCellKeyDown = (e, rowIndex, colKey) => {
    if (e.key === "Enter") {
      e.preventDefault()
      updateCell(rowIndex, colKey, e.target.value)
      // Move to the cell below
      if (rowIndex < data.length - 1) {
        handleCellClick(rowIndex + 1, colKey)
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      updateCell(rowIndex, colKey, e.target.value)
      const currentColIndex = columns.findIndex((col) => col.key === colKey)
      const nextColIndex = (currentColIndex + 1) % columns.length
      handleCellClick(rowIndex, columns[nextColIndex].key)
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      updateCell(rowIndex, colKey, e.target.value)
      if (rowIndex < data.length - 1) {
        handleCellClick(rowIndex + 1, colKey)
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      updateCell(rowIndex, colKey, e.target.value)
      if (rowIndex > 0) {
        handleCellClick(rowIndex - 1, colKey)
      }
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      updateCell(rowIndex, colKey, e.target.value)
      const currentColIndex = columns.findIndex((col) => col.key === colKey)
      if (currentColIndex < columns.length - 1) {
        handleCellClick(rowIndex, columns[currentColIndex + 1].key)
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      updateCell(rowIndex, colKey, e.target.value)
      const currentColIndex = columns.findIndex((col) => col.key === colKey)
      if (currentColIndex > 0) {
        handleCellClick(rowIndex, columns[currentColIndex - 1].key)
      }
    }
  }

  const handleDragStart = (rowIndex, colKey) => {
    setDragStart({ rowIndex, colKey })
  }

  const handleDragOver = (e, rowIndex, colKey) => {
    e.preventDefault()
    if (dragStart) {
      setSelectedRange({
        startRow: Math.min(dragStart.rowIndex, rowIndex),
        endRow: Math.max(dragStart.rowIndex, rowIndex),
        startCol: columns.findIndex(
          (col) =>
            col.key ===
            (Math.min(
              columns.findIndex((col) => col.key === dragStart.colKey),
              columns.findIndex((col) => col.key === colKey),
            ) === columns.findIndex((col) => col.key === dragStart.colKey)
              ? dragStart.colKey
              : colKey),
        ),
        endCol: columns.findIndex(
          (col) =>
            col.key ===
            (Math.max(
              columns.findIndex((col) => col.key === dragStart.colKey),
              columns.findIndex((col) => col.key === colKey),
            ) === columns.findIndex((col) => col.key === dragStart.colKey)
              ? dragStart.colKey
              : colKey),
        ),
      })
    }
  }

  const handleDrop = (e, rowIndex, colKey) => {
    e.preventDefault()
    if (dragStart && (dragStart.rowIndex !== rowIndex || dragStart.colKey !== colKey)) {
      const sourceRow = data[dragStart.rowIndex]
      const value = sourceRow[dragStart.colKey]
      updateCell(rowIndex, colKey, value)
    }
    setDragStart(null)
    setSelectedRange(null)
  }

  const handleResizeStart = (e, key) => {
    e.preventDefault()
    setResizingColumn(key)
    setStartX(e.clientX)
    setStartWidth(columnWidths[key] || 120)

    const handleMouseMove = (moveEvent) => {
      if (resizingColumn) {
        const newWidth = Math.max(80, startWidth + (moveEvent.clientX - startX))
        setColumnWidths((prev) => ({
          ...prev,
          [resizingColumn]: newWidth,
        }))
      }
    }

    const handleMouseUp = () => {
      setResizingColumn(null)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const isCellInRange = (rowIndex, colIndex) => {
    if (!selectedRange) return false
    return (
      rowIndex >= selectedRange.startRow &&
      rowIndex <= selectedRange.endRow &&
      colIndex >= selectedRange.startCol &&
      colIndex <= selectedRange.endCol
    )
  }

  const calculateProductValueUsd = (rate, boxes, qty) => {
    const rateNum = Number.parseFloat(rate) || 0
    const boxesNum = Number.parseFloat(boxes) || 0
    const qtyNum = Number.parseFloat(qty) || 0

    return rateNum * boxesNum * qtyNum
  }

  const calculateProductValueInr = (valueUsd, exchangeRate) => {
    const valueUsdNum = Number.parseFloat(valueUsd) || 0
    const exchangeRateNum = Number.parseFloat(exchangeRate) || 0

    return valueUsdNum * exchangeRateNum
  }

  // Generate column headers (A, B, C, ...)
  const getColumnLetter = (index) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    return letters[index] || "?"
  }

  return (
    <div className="w-full h-full overflow-auto relative">
      {/* Row numbers column */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[40px] bg-gray-100 dark:bg-gray-900 border-r border-gray-300 dark:border-gray-700 z-10"
        style={{ height: `${data.length * 28 + 28}px` }}
      >
        <div className="h-[28px] border-b border-gray-300 dark:border-gray-700 flex items-center justify-center bg-gray-200 dark:bg-gray-800">
          {/* Corner cell */}
        </div>
        {data.map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="h-[28px] flex items-center justify-center text-xs text-gray-600 dark:text-gray-400 border-b border-gray-300 dark:border-gray-700"
          >
            {rowIndex + 1}
          </div>
        ))}
      </div>

      {/* Column letters row */}
      <div className="absolute left-[40px] top-0 right-0 h-[28px] bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 z-10 flex">
        {columns.map((_, colIndex) => (
          <div
            key={colIndex}
            className="h-[28px] flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300 border-r border-gray-300 dark:border-gray-700"
            style={{ width: `${columnWidths[columns[colIndex].key] || 120}px` }}
          >
            {getColumnLetter(colIndex)}
          </div>
        ))}
      </div>

      {/* Main spreadsheet */}
      <div className="absolute left-[40px] top-[28px] right-0 bottom-0 overflow-auto">
        <table
          ref={tableRef}
          className="w-full border-collapse"
          style={{
            tableLayout: "fixed",
            borderSpacing: 0,
          }}
        >
          <colgroup>
            {columns.map((column) => (
              <col key={column.key} style={{ width: `${columnWidths[column.key] || 120}px` }} />
            ))}
          </colgroup>
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
              {columns.map((column, colIndex) => (
                <th
                  key={column.key}
                  className="relative px-2 py-2 text-left font-semibold text-xs border border-gray-300 dark:border-gray-700 select-none"
                  style={{
                    backgroundColor: "#f0f0f0",
                    color: "#333",
                    position: "relative",
                    width: `${columnWidths[column.key] || 120}px`,
                  }}
                >
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort(column.key)}>
                    {column.label}
                    {sortConfig.key === column.key &&
                      (sortConfig.direction === "asc" ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      ))}
                  </div>
                  <div
                    className="absolute right-0 top-0 h-full w-1 cursor-col-resize group"
                    onMouseDown={(e) => handleResizeStart(e, column.key)}
                  >
                    <div className="absolute right-0 top-0 h-full w-1 bg-transparent group-hover:bg-primary opacity-50"></div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-muted-foreground border border-gray-200 dark:border-gray-700"
                >
                  No data available. Upload an Excel file or add rows manually.
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={rowIndex % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50 dark:bg-gray-900"}
                >
                  {columns.map((column, colIndex) => {
                    let cellValue = row[column.key] || ""

                    // Calculate values for calculated fields
                    if (column.key === "productValueUsd") {
                      const value = calculateProductValueUsd(row.rateInUsd, row.totalBoxes, row.totalQty)
                      cellValue = value ? value.toFixed(2) : ""
                    } else if (column.key === "productValueInr") {
                      const valueUsd = calculateProductValueUsd(row.rateInUsd, row.totalBoxes, row.totalQty)
                      cellValue = calculateProductValueInr(valueUsd, row.exchangeRate).toFixed(2)
                    } else if (column.key === "amount") {
                      const valueUsd = calculateProductValueUsd(row.rateInUsd, row.totalBoxes, row.totalQty)
                      cellValue = valueUsd ? valueUsd.toFixed(2) : ""
                    }

                    return (
                      <td
                        key={column.key}
                        className={`px-2 py-1 border border-gray-200 dark:border-gray-700 ${
                          column.calculated ? "bg-blue-50 dark:bg-blue-950" : ""
                        } ${
                          selectedCell && selectedCell.rowIndex === rowIndex && selectedCell.colKey === column.key
                            ? "bg-blue-100 dark:bg-blue-900"
                            : ""
                        } ${isCellInRange(rowIndex, colIndex) ? "bg-blue-50 dark:bg-blue-950" : ""}`}
                        onClick={() => column.editable && handleCellClick(rowIndex, column.key)}
                        draggable={column.editable}
                        onDragStart={() => handleDragStart(rowIndex, column.key)}
                        onDragOver={(e) => handleDragOver(e, rowIndex, column.key)}
                        onDrop={(e) => handleDrop(e, rowIndex, column.key)}
                        style={{
                          height: "28px",
                          padding: "0 4px",
                          position: "relative",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {selectedCell &&
                        selectedCell.rowIndex === rowIndex &&
                        selectedCell.colKey === column.key &&
                        column.editable ? (
                          <Input
                            ref={inputRef}
                            type={column.numeric ? "number" : "text"}
                            value={row[column.key] || ""}
                            onChange={(e) => handleCellChange(e, rowIndex, column.key)}
                            onBlur={handleCellBlur}
                            onKeyDown={(e) => handleCellKeyDown(e, rowIndex, column.key)}
                            className="w-full p-0 h-7 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            autoFocus
                          />
                        ) : (
                          <div className="min-h-[28px] flex items-center text-sm">{cellValue}</div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

