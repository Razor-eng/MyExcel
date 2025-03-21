"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SpreadsheetControls({ filterText, setFilterText, sortConfig, setSortConfig }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="relative w-full sm:w-auto flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Filter data..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  )
}

