"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSpreadsheetStore } from "@/lib/store"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Download,
  Plus,
  Trash2,
  FileSpreadsheet,
  Upload,
  Search,
  ChevronDown,
  Undo,
  Redo,
  Percent,
  DollarSign,
  Printer,
} from "lucide-react"
import { utils, writeFile, read } from "xlsx"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function SpreadsheetHeader({ filterText, setFilterText }) {
  const { data, addRow, clearData, setData } = useSpreadsheetStore()
  const [isUploading, setIsUploading] = useState(false)

  const handleExport = () => {
    const worksheet = utils.json_to_sheet(data)
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, worksheet, "Spreadsheet")
    writeFile(workbook, "spreadsheet-export.xlsx")
  }

  const processExcelFile = async (file) => {
    try {
      setIsUploading(true)

      const arrayBuffer = await file.arrayBuffer()
      const workbook = read(arrayBuffer)

      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]

      // Convert to JSON
      const jsonData = utils.sheet_to_json(worksheet, { header: "A" })

      // Process the data
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
    <div className="border-b border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
      <div className="flex items-center p-1 border-b border-gray-300 dark:border-gray-700">
        <div className="flex items-center gap-1 mr-4">
          <FileSpreadsheet className="h-5 w-5 text-green-600 dark:text-green-500" />
          <span className="font-medium text-sm">Excel</span>
        </div>

        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                File
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={addRow}>New</DropdownMenuItem>
              <DropdownMenuItem>
                <label className="flex items-center w-full cursor-pointer">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  Open
                </label>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport}>Save As</DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport}>Export</DropdownMenuItem>
              <DropdownMenuItem>Print</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                Edit
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Undo</DropdownMenuItem>
              <DropdownMenuItem>Redo</DropdownMenuItem>
              <DropdownMenuItem>Cut</DropdownMenuItem>
              <DropdownMenuItem>Copy</DropdownMenuItem>
              <DropdownMenuItem>Paste</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                View
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Zoom In</DropdownMenuItem>
              <DropdownMenuItem>Zoom Out</DropdownMenuItem>
              <DropdownMenuItem>100%</DropdownMenuItem>
              <DropdownMenuItem>Freeze Panes</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                Insert
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={addRow}>Row</DropdownMenuItem>
              <DropdownMenuItem>Column</DropdownMenuItem>
              <DropdownMenuItem>Chart</DropdownMenuItem>
              <DropdownMenuItem>Function</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <div className="relative">
            <Search className="absolute left-2 top-1.5 h-3 w-3 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="h-7 w-40 pl-7 text-xs"
            />
          </div>

          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={addRow}>
            <Plus className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={clearData}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center p-1">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Redo className="h-4 w-4" />
          </Button>

          <div className="h-5 w-px bg-gray-300 dark:bg-gray-700 mx-1" />

          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Underline className="h-4 w-4" />
          </Button>

          <div className="h-5 w-px bg-gray-300 dark:bg-gray-700 mx-1" />

          <Button variant="ghost" size="icon" className="h-7 w-7">
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <AlignRight className="h-4 w-4" />
          </Button>

          <div className="h-5 w-px bg-gray-300 dark:bg-gray-700 mx-1" />

          <Button variant="ghost" size="icon" className="h-7 w-7">
            <DollarSign className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Percent className="h-4 w-4" />
          </Button>

          <div className="h-5 w-px bg-gray-300 dark:bg-gray-700 mx-1" />

          <Input id="file-upload" type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" />
          <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-1" />
              {isUploading ? "Uploading..." : "Import"}
            </label>
          </Button>

          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>

          <Button variant="ghost" size="sm" className="h-7 text-xs">
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
        </div>
      </div>
    </div>
  )
}

