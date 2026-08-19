import Link from "next/link"
import { Plus } from "lucide-react"

import { getProducts } from "@/data/service"
import { ProductList } from "@/components/product-list"
import { Button } from "@/components/ui/button"

export default async function BarangPage() {
  const products = await getProducts()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Semua Barang</h1>
          <p className="text-sm text-muted-foreground">
            Daftar barang dan harga modal terakhir.
          </p>
        </div>
        <Button render={<Link href="/barang/tambah" />} nativeButton={false}>
          <Plus data-icon="inline-start" /> Tambah Barang
        </Button>
      </div>

      <ProductList products={products} />
    </div>
  )
}