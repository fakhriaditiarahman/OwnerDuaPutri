import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { getPurchase } from "@/data/service"
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
import { formatDate, formatNumber, formatRupiah } from "@/lib/format"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function DetailPembelianPage({ params }: PageProps) {
  const { id } = await params
  const purchase = await getPurchase(id)

  if (!purchase) notFound()

  return (
    <div className="flex flex-col gap-6">
      <Button
        variant="ghost"
        size="sm"
        className="w-fit -ml-2"
        render={<Link href="/pembelian" />}
        nativeButton={false}
      >
        <ArrowLeft data-icon="inline-start" /> Kembali ke Riwayat Pembelian
      </Button>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{purchase.purchase_id}</h1>
          <Badge variant="secondary">{formatDate(purchase.purchase_date)}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">Detail pembelian barang</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Pembelian</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Tanggal</dt>
              <dd className="mt-1 font-medium">{formatDate(purchase.purchase_date)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Supplier</dt>
              <dd className="mt-1 font-medium">
                <Link href="/supplier" className="hover:underline">
                  {purchase.supplier_name}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Total Pembelian</dt>
              <dd className="mt-1 text-xl font-bold">{formatRupiah(purchase.total_amount)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Catatan</dt>
              <dd className="mt-1 text-muted-foreground">{purchase.notes ?? "-"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Barang</CardTitle>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Barang</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead className="text-right">Harga/Dus</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchase.items.map((item) => (
                <TableRow key={item.purchase_item_id}>
                  <TableCell>
                    <Link
                      href={`/barang/${item.product_id}`}
                      className="font-medium hover:underline"
                    >
                      {item.product_name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(item.quantity)} dus
                  </TableCell>
                  <TableCell className="text-right">{formatRupiah(item.price_per_unit)}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatRupiah(item.subtotal)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">
                  Total
                </TableCell>
                <TableCell className="text-right text-lg font-bold">
                  {formatRupiah(purchase.total_amount)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}