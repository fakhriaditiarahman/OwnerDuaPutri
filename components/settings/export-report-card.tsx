"use client"

import * as React from "react"
import { toast } from "sonner"
import { FileSpreadsheet, Loader2 } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { downloadBlob } from "@/lib/download"
import { exportLaporanCsvAction } from "@/app/settings-actions"
import type { Supplier } from "@/lib/types"

export function ExportReportCard({ suppliers }: { suppliers: Supplier[] }) {
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [supplierId, setSupplierId] = React.useState<string>("all")
  const [pending, setPending] = React.useState(false)

  async function handleExport() {
    setPending(true)
    try {
      const formData = new FormData()
      if (startDate) formData.set("startDate", startDate)
      if (endDate) formData.set("endDate", endDate)
      if (supplierId && supplierId !== "all") formData.set("supplierId", supplierId)

      const result = await exportLaporanCsvAction(formData)
      if (result.error || !result.csv) {
        toast.error(result.error ?? "Gagal mengekspor laporan")
        return
      }
      downloadBlob(result.csv, result.filename ?? "laporan.csv", "text/csv;charset=utf-8")
      toast.success("Laporan CSV berhasil diunduh")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengekspor laporan")
    } finally {
      setPending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Laporan</CardTitle>
        <CardDescription>
          Unduh laporan pembelian dalam format CSV (bisa dibuka di Excel).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            aria-label="Dari tanggal"
            className="w-auto"
          />
          <span className="text-sm text-muted-foreground">s/d</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            aria-label="Sampai tanggal"
            className="w-auto"
          />
          <Select value={supplierId} onValueChange={(v) => setSupplierId(v ?? "all")}>
            <SelectTrigger className="w-auto" aria-label="Supplier">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Supplier</SelectItem>
              {suppliers.map((s) => (
                <SelectItem key={s.supplier_id} value={s.supplier_id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleExport} disabled={pending} className="w-fit">
          {pending ? (
            <Loader2 data-icon="inline-start" className="animate-spin" />
          ) : (
            <FileSpreadsheet data-icon="inline-start" />
          )}
          {pending ? "Mengekspor..." : "Unduh CSV"}
        </Button>
      </CardContent>
    </Card>
  )
}
