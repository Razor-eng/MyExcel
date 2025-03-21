import { create } from "zustand"

interface SpreadsheetRow {
  srNo: string
  hsCode: string
  htsCode: string
  marksAndNos: string
  description: string
  rateInUsd: string
  totalBoxes: string
  totalQty: string
  productValueUsd?: string
  exchangeRate: string
  productValueInr?: string
  netWeight: string
  amount?: string
}

interface SpreadsheetState {
  data: SpreadsheetRow[]
  setData: (data: SpreadsheetRow[]) => void
  updateCell: (rowIndex: number, key: string, value: string) => void
  addRow: () => void
  clearData: () => void
}

export const useSpreadsheetStore = create<SpreadsheetState>((set) => ({
  data: Array(20)
    .fill(0)
    .map((_, index) => ({
      srNo: (index + 1).toString(),
      hsCode: "",
      htsCode: "",
      marksAndNos: "",
      description: "",
      rateInUsd: "",
      totalBoxes: "",
      totalQty: "",
      exchangeRate: "",
      netWeight: "",
    })),

  setData: (data) => set({ data }),

  updateCell: (rowIndex, key, value) =>
    set((state) => {
      const newData = [...state.data]

      if (!newData[rowIndex]) {
        newData[rowIndex] = {
          srNo: "",
          hsCode: "",
          htsCode: "",
          marksAndNos: "",
          description: "",
          rateInUsd: "",
          totalBoxes: "",
          totalQty: "",
          exchangeRate: "",
          netWeight: "",
        }
      }

      newData[rowIndex] = {
        ...newData[rowIndex],
        [key]: value,
      }

      // Calculate derived values
      if (key === "rateInUsd" || key === "totalBoxes" || key === "totalQty" || key === "exchangeRate") {
        const rate = Number.parseFloat(newData[rowIndex].rateInUsd) || 0
        const boxes = Number.parseFloat(newData[rowIndex].totalBoxes) || 0
        const qty = Number.parseFloat(newData[rowIndex].totalQty) || 0
        const exchangeRate = Number.parseFloat(newData[rowIndex].exchangeRate) || 0

        const productValueUsd = rate * boxes * qty
        newData[rowIndex].productValueUsd = productValueUsd.toString()
        newData[rowIndex].amount = productValueUsd.toString()

        const productValueInr = productValueUsd * exchangeRate
        newData[rowIndex].productValueInr = productValueInr.toString()
      }

      return { data: newData }
    }),

  addRow: () =>
    set((state) => {
      const lastRow = state.data[state.data.length - 1]
      const newSrNo = lastRow ? (Number.parseInt(lastRow.srNo) + 1).toString() : "1"

      return {
        data: [
          ...state.data,
          {
            srNo: newSrNo,
            hsCode: "",
            htsCode: "",
            marksAndNos: "",
            description: "",
            rateInUsd: "",
            totalBoxes: "",
            totalQty: "",
            productValueUsd: "",
            exchangeRate: "",
            productValueInr: "",
            netWeight: "",
            amount: "",
          },
        ],
      }
    }),

  clearData: () =>
    set({
      data: Array(20)
        .fill(0)
        .map((_, index) => ({
          srNo: (index + 1).toString(),
          hsCode: "",
          htsCode: "",
          marksAndNos: "",
          description: "",
          rateInUsd: "",
          totalBoxes: "",
          totalQty: "",
          exchangeRate: "",
          netWeight: "",
        })),
    }),
}))

