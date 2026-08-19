"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PaginationBar } from "@/components/ui/pagination"
import { usePagination } from "@/hooks/use-pagination"
import { formatDate, formatRupiah } from "@/lib/format"
import type { PurchaseWithRelations, Supplier } from "@/lib/types"

interface Props {
  purchases: PurchaseWithRelations[]
  suppliers: Supplier[]
}

export function PurchaseList({ purchases, suppliers }: Props) {
  const [query, setQuery] = useState("")
  const [supplierId, setSupplierId] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return purchases.filter((p) => {
      if (supplierId !== "all" && p.supplier_id !== supplierId) return false
      if (startDate && p.purchase_date < startDate) return false
      if (endDate && p.purchase_date > endDate) return false
      if (
        q &&
        !p.purchase_id.toLowerCase().includes(q) &&
        !p.supplier_name.toLowerCase().includes(q) &&
        !p.items.some((i) => i.product_name.toLowerCase().includes(q))
      ) {
        return false
      }
      return true
    })
  }, [purchases, query, supplierId, startDate, endDate])

  const { page, setPage, pageCount, current } = usePagination(filtered, 10)

  const hasFilter = query || supplierId !== "all" || startDate || endDate

  const supplierItems = Object.fromEntries(
    suppliers.map((s) => [s.supplier_id, s.name]),
  )

  return (
    <div className="flex flex-col gap-4">
      <FieldGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field>
          <FieldLabel className="text-xs text-muted-foreground">Cari</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari pembelian..."
            />
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel className="text-xs text-muted-foreground">Supplier</FieldLabel>
          <Select
            value={supplierId}
            onValueChange={(v) => setSupplierId(v ?? "all")}
            items={{ all: "Semua Supplier", ...supplierItems }}
          >
            <SelectTrigger className="w-full">
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
        </Field>
        <Field>
          <FieldLabel className="text-xs text-muted-foreground">Dari Tanggal</FieldLabel>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel className="text-xs text-muted-foreground">Sampai Tanggal</FieldLabel>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </Field>
      </FieldGroup>

      <div className="text-sm text-muted-foreground">
        {filtered.length} pembelian{hasFilter ? " (dengan filter)" : ""}
      </div>

      <div className="overflow-hidden rounded-2xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead className="hidden sm:table-cell">Barang</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {current.map((p) => (
              <TableRow key={p.purchase_id}>
                <TableCell>
                  <Link
                    href={`/pembelian/${p.purchase_id}`}
                    className="font-medium hover:underline"
                  >
                    {p.purchase_id}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(p.purchase_date)}
                </TableCell>
                <TableCell>{p.supplier_name}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="max-w-64 truncate text-muted-foreground">
                    {p.items.map((i) => i.product_name).join(", ")}
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatRupiah(p.total_amount)}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Tidak ada pembelian ditemukan.
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