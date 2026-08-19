import Link from "next/link"
import { Package, ShoppingCart, Truck, ArrowRight } from "lucide-react"

import { getDashboardData, getDashboardStats, getProducts } from "@/data/service"
import { ProductSearch } from "@/components/product-search"
import { DashboardCharts } from "@/components/dashboard-charts"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate, formatRupiah } from "@/lib/format"

export default async function DashboardPage() {
  const [dashboard, products, stats] = await Promise.all([
    getDashboardData(),
    getProducts(),
    getDashboardStats(),
  ])

  const summaryCards = [
    {
      label: "Total Barang",
      value: dashboard.totalProducts,
      icon: Package,
    },
    {
      label: "Pembelian Bulan Ini",
      value: dashboard.purchasesThisMonth,
      icon: ShoppingCart,
    },
    {
      label: "Supplier",
      value: dashboard.totalSuppliers,
      icon: Truck,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Cari harga modal terakhir barang secara cepat.
        </p>
      </div>

      <ProductSearch products={products} autoFocus />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summaryCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <card.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DashboardCharts stats={stats} />

      <Card>
        <CardHeader>
          <CardTitle>Pembelian Terakhir</CardTitle>
          <CardDescription>Pembelian terbaru yang tercatat</CardDescription>
          <CardAction>
            <Button
              variant="link"
              size="sm"
              render={<Link href="/pembelian" />}
              nativeButton={false}
            >
              Lihat semua <ArrowRight data-icon="inline-end" />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Barang</TableHead>
                <TableHead className="text-right">Harga/Dus</TableHead>
                <TableHead>Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboard.recentPurchases.map((p) => {
                const item = p.items[0]
                if (!item) return null
                return (
                  <TableRow key={p.purchase_id}>
                    <TableCell>
                      <Link
                        href={`/barang/${item.product_id}`}
                        className="font-medium hover:underline"
                      >
                        {item.product_name}
                      </Link>
                      <div className="text-xs text-muted-foreground">{p.supplier_name}</div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatRupiah(item.price_per_unit)}
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        × {item.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(p.purchase_date)}
                    </TableCell>
                  </TableRow>
                )
              })}
              {dashboard.recentPurchases.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    Belum ada pembelian.
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