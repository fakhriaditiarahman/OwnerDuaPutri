import { getSuppliers } from "@/data/service"
import { AddSupplierDialog } from "@/components/supplier-dialogs"
import { SupplierList } from "@/components/supplier-list"

export default async function SupplierPage() {
  const suppliers = await getSuppliers()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Supplier</h1>
          <p className="text-sm text-muted-foreground">
            Daftar supplier/grosir tempat pembelian barang.
          </p>
        </div>
        <AddSupplierDialog />
      </div>

      <SupplierList suppliers={suppliers} />
    </div>
  )
}
