import Link from "next/link"
import { Plus } from "lucide-react"

import { getPurchases, getSuppliers } from "@/data/service"
import { PurchaseList } from "@/components/purchase-list"
import { Button } from "@/components/ui/button"

export default async function RiwayatPembelianPage() {
  const [purchases, suppliers] = await Promise.all([getPurchases(), getSuppliers()])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Riwayat Pembelian</h1>
          <p className="text-sm text-muted-foreground">
            Seluruh catatan pembelian barang.
          </p>
        </div>
        <Button render={<Link href="/pembelian/baru" />} nativeButton={false}>
          <Plus data-icon="inline-start" /> Pembelian Baru
        </Button>
      </div>

      <PurchaseList purchases={purchases} suppliers={suppliers} />
    </div>
  )
}