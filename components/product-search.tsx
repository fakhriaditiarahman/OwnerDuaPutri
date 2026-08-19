"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { formatDate, formatRupiah } from "@/lib/format"
import type { Product } from "@/lib/types"

interface Props {
  products: Product[]
  autoFocus?: boolean
}

export function ProductSearch({ products, autoFocus }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [open])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.barcode?.toLowerCase().includes(q),
      )
      .slice(0, 8)
  }, [products, query])

  const showDropdown = open && query.trim().length > 0

  return (
    <div ref={containerRef} className="relative w-full">
      <InputGroup className="h-12">
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && results.length > 0) {
              router.push(`/barang/${results[0].product_id}`)
            }
            if (e.key === "Escape") setOpen(false)
          }}
          placeholder="Cari nama barang untuk melihat harga modal terakhir..."
          className="text-base"
        />
      </InputGroup>

      {showDropdown && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border bg-popover text-popover-foreground shadow-lg">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              Barang &quot;{query}&quot; tidak ditemukan
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((p) => (
                <li key={p.product_id}>
                  <Link
                    href={`/barang/${p.product_id}`}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-muted"
                    onClick={() => setOpen(false)}
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{p.name}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {p.category ?? "Tanpa kategori"} · Terakhir dibeli{" "}
                        {formatDate(p.last_purchase_date)}
                      </div>
                    </div>
                    <div className="shrink-0 text-right text-sm font-semibold">
                      {p.last_purchase_price != null ? formatRupiah(p.last_purchase_price) : "-"}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}