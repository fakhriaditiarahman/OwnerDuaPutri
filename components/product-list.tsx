"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { PaginationBar } from "@/components/ui/pagination"
import { usePagination } from "@/hooks/use-pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate, formatRupiah } from "@/lib/format"
import type { Product } from "@/lib/types"

export function ProductList({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.barcode?.toLowerCase().includes(q),
    )
  }, [products, query])

  const { page, setPage, pageCount, current } = usePagination(filtered, 10)

  return (
    <div className="flex flex-col gap-4">
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama barang, kategori, atau barcode..."
        />
      </InputGroup>

      <div className="text-sm text-muted-foreground">{filtered.length} barang</div>

      <div className="overflow-hidden rounded-2xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Barang</TableHead>
              <TableHead className="hidden sm:table-cell">Kategori</TableHead>
              <TableHead className="text-right">Modal Terakhir</TableHead>
              <TableHead className="hidden md:table-cell">Terakhir Dibeli</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {current.map((p) => (
              <TableRow key={p.product_id}>
                <TableCell>
                  <Link href={`/barang/${p.product_id}`} className="block hover:underline">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.product_id} · {p.unit}
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {p.category ? <Badge variant="secondary">{p.category}</Badge> : "-"}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {p.last_purchase_price != null ? formatRupiah(p.last_purchase_price) : "-"}
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {formatDate(p.last_purchase_date)}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Tidak ada barang ditemukan.
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