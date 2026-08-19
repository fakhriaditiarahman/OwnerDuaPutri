import { getProducts, getSuppliers } from "@/data/service"
import { PurchaseForm } from "@/components/purchase-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function PembelianBaruPage() {
  const [products, suppliers] = await Promise.all([getProducts(), getSuppliers()])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Pembelian Baru</h1>
        <p className="text-sm text-muted-foreground">
          Catat harga modal barang. Modal terakhir dan histori harga otomatis diperbarui.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Pembelian</CardTitle>
        </CardHeader>
        <CardContent>
          <PurchaseForm products={products} suppliers={suppliers} />
        </CardContent>
      </Card>
    </div>
  )
}