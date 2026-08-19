import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, TrendingDown, TrendingUp, Minus } from "lucide-react"

import { getProduct, getSuppliers } from "@/data/service"
import { EditProductDialog } from "@/components/edit-product-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { formatDate, formatNumber, formatRupiah } from "@/lib/format"

interface PageProps {
  params: Promise<{ id: string }>
}

function priceChange(last: number, prev: number | undefined) {
  if (prev === undefined) return null
  const diff = last - prev
  const pct = prev !== 0 ? (diff / prev) * 100 : 0
  const up = diff > 0
  const down = diff < 0
  return {
    diff,
    pct,
    up,
    down,
    flat: diff === 0,
    label: up ? "Naik" : down ? "Turun" : "Tetap",
    Icon: up ? TrendingUp : down ? TrendingDown : Minus,
    tone: up
      ? "text-destructive"
      : down
        ? "text-primary"
        : "text-muted-foreground",
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params
  const [product, suppliers] = await Promise.all([getProduct(id), getSuppliers()])

  if (!product) notFound()

  const supplierMap = new Map(suppliers.map((s) => [s.supplier_id, s.name]))

  const history = product.price_history
  const last = history[0]
  const prev = history[1]
  const change = last && prev ? priceChange(last.price_per_unit, prev.price_per_unit) : null

  return (
    <div className="flex flex-col gap-6">
      <Button
        variant="ghost"
        size="sm"
        className="w-fit -ml-2"
        render={<Link href="/barang" />}
        nativeButton={false}
      >
        <ArrowLeft data-icon="inline-start" /> Kembali ke Barang
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight uppercase">{product.name}</h1>
            {product.category && <Badge variant="secondary">{product.category}</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">
            {product.product_id}
            {product.barcode ? ` · Barcode ${product.barcode}` : ""}
          </p>
        </div>
        <EditProductDialog product={product} />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Modal Terakhir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {product.last_purchase_price != null
                ? formatRupiah(product.last_purchase_price)
                : "-"}
            </div>
            <div className="text-xs text-muted-foreground">per {product.unit.toLowerCase()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Terakhir Dibeli
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatDate(product.last_purchase_date)}</div>
            <div className="text-xs text-muted-foreground">tanggal pembelian terakhir</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Supplier Terakhir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{product.supplier_name ?? "-"}</div>
            <div className="text-xs text-muted-foreground">supplier terakhir</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Isi per Dus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {product.pieces_per_box ? `${formatNumber(product.pieces_per_box)} pcs` : "-"}
            </div>
            <div className="text-xs text-muted-foreground">per {product.unit.toLowerCase()}</div>
          </CardContent>
        </Card>
      </div>

      {change && (
        <Card>
          <CardContent className="flex items-center justify-between gap-3 pt-6">
            <div className="flex flex-col gap-1">
              <div className="text-sm text-muted-foreground">Harga sebelumnya</div>
              <div className="font-semibold">{formatRupiah(prev.price_per_unit)}</div>
            </div>
            <div className="text-center">
              <change.Icon className={cn("mx-auto size-6", change.tone)} />
              <div className={cn("text-sm font-semibold", change.tone)}>
                {change.label} {change.diff > 0 ? "+" : ""}
                {formatRupiah(change.diff)}
              </div>
              <div className={cn("text-xs", change.tone)}>
                ({change.pct >= 0 ? "+" : ""}
                {change.pct.toFixed(2).replace(".", ",")}%)
              </div>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <div className="text-sm text-muted-foreground">Harga terakhir</div>
              <div className="text-lg font-bold">{formatRupiah(last.price_per_unit)}</div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Histori Harga</CardTitle>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Harga/Dus</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((h) => (
                <TableRow key={h.history_id}>
                  <TableCell>{formatDate(h.purchase_date)}</TableCell>
                  <TableCell>
                    <Link
                      href={`/pembelian/${h.purchase_id}`}
                      className="text-muted-foreground hover:text-foreground hover:underline"
                    >
                      {supplierMap.get(h.supplier_id) ?? h.supplier_id}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">{formatNumber(h.quantity)}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatRupiah(h.price_per_unit)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatRupiah(h.quantity * h.price_per_unit)}
                  </TableCell>
                </TableRow>
              ))}
              {history.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Belum ada histori pembelian.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}