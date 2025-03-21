"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function SpreadsheetTabs() {
  return (
    <div className="flex items-center border-t border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 h-8">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 rounded-none border-r border-gray-300 dark:border-gray-700 px-4 text-xs font-medium bg-white dark:bg-gray-800"
        >
          Sheet1
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 rounded-none border-r border-gray-300 dark:border-gray-700 px-4 text-xs font-medium"
        >
          Sheet2
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 rounded-none border-r border-gray-300 dark:border-gray-700 px-4 text-xs font-medium"
        >
          Sheet3
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

