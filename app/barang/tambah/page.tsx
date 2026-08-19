import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { ProductForm } from "@/components/product-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TambahBarangPage() {
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

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Tambah Barang</h1>
        <p className="text-sm text-muted-foreground">
          Catat barang baru. Modal terakhir otomatis terisi setelah pembelian pertama.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Barang</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm />
        </CardContent>
      </Card>
    </div>
  )
}