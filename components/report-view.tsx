"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { CalendarDays } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { PaginationBar } from "@/components/ui/pagination"
import { usePagination } from "@/hooks/use-pagination"
import { formatDate, formatNumber, formatRupiah } from "@/lib/format"
import type { PurchaseWithRelations } from "@/lib/types"

type Range = "today" | "week" | "month" | "custom"

function startOfWeek(d: Date): Date {
  const copy = new Date(d)
  const day = copy.getDay()
  const diff = copy.getDate() - day + (day === 0 ? -6 : 1)
  copy.setDate(diff)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function iso(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function ReportView({ purchases }: { purchases: PurchaseWithRelations[] }) {
  const [range, setRange] = useState<Range>("month")
  const [customStart, setCustomStart] = useState("")
  const [customEnd, setCustomEnd] = useState("")

  const { filtered, startLabel, endLabel } = useMemo(() => {
    const now = new Date()
    let start: Date | null = null
    let end: Date | null = null

    if (range === "today") {
      start = new Date(now)
      start.setHours(0, 0, 0, 0)
      end = new Date(now)
    } else if (range === "week") {
      start = startOfWeek(now)
      end = new Date(now)
    } else if (range === "month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1)
      end = new Date(now)
    } else {
      if (customStart) start = new Date(customStart)
      if (customEnd) end = new Date(customEnd)
    }

    const list = purchases.filter((p) => {
      const d = new Date(p.purchase_date)
      if (start && d < start) return false
      if (end && d > new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59))
        return false
      return true
    })

    return {
      filtered: list,
      startLabel: start ? formatDate(iso(start)) : "Semua",
      endLabel: end ? formatDate(iso(end)) : "Sekarang",
    }
  }, [purchases, range, customStart, customEnd])

  const totalAmount = filtered.reduce((s, p) => s + p.total_amount, 0)
  const supplierCount = new Set(filtered.map((p) => p.supplier_id)).size

  const detailRows = filtered.flatMap((p) =>
    p.items.map((item) => ({ ...item, purchase_id: p.purchase_id, purchase_date: p.purchase_date, supplier_name: p.supplier_name })),
  )

  const { page, setPage, pageCount, current } = usePagination(detailRows, 10)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={range} onValueChange={(v) => setRange(v as Range)}>
          <TabsList>
            <TabsTrigger value="today">Hari Ini</TabsTrigger>
            <TabsTrigger value="week">Minggu Ini</TabsTrigger>
            <TabsTrigger value="month">Bulan Ini</TabsTrigger>
            <TabsTrigger value="custom">Kustom</TabsTrigger>
          </TabsList>
        </Tabs>
        {range === "custom" && (
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="w-auto"
              aria-label="Dari tanggal"
            />
            <span className="text-sm text-muted-foreground">s/d</span>
            <Input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="w-auto"
              aria-label="Sampai tanggal"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarDays className="size-4" />
        Periode: {startLabel} — {endLabel}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pembelian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRupiah(totalAmount)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Jumlah Pembelian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(filtered.length)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Supplier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(supplierCount)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="overflow-hidden rounded-2xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Barang</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Harga</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {current.map((row) => (
              <TableRow key={`${row.purchase_id}-${row.purchase_item_id}`}>
                <TableCell className="text-muted-foreground">
                  {formatDate(row.purchase_date)}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/barang/${row.product_id}`}
                    className="font-medium hover:underline"
                  >
                    {row.product_name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{row.supplier_name}</TableCell>
                <TableCell className="text-right">
                  {formatNumber(row.quantity)} dus
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatRupiah(row.price_per_unit)}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Belum ada pembelian pada periode ini.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationBar page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  )
}