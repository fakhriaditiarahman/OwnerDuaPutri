import { Truck } from "lucide-react"

import { getSuppliers } from "@/data/service"
import { AddSupplierDialog, EditSupplierDialog } from "@/components/supplier-dialogs"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((s) => (
          <Card key={s.supplier_id}>
            <CardHeader>
              <CardTitle className="text-base">{s.name}</CardTitle>
              <CardDescription>{s.supplier_id}</CardDescription>
              <CardAction>
                <EditSupplierDialog supplier={s} />
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              {s.phone ? (
                <div>
                  <span className="text-muted-foreground">Telepon: </span>
                  {s.phone}
                </div>
              ) : null}
              {s.address ? (
                <div>
                  <span className="text-muted-foreground">Alamat: </span>
                  {s.address}
                </div>
              ) : null}
              {s.notes ? (
                <div className="text-muted-foreground">{s.notes}</div>
              ) : null}
            </CardContent>
          </Card>
        ))}
        {suppliers.length === 0 && (
          <Empty className="col-span-full">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Truck />
              </EmptyMedia>
              <EmptyTitle>Belum ada supplier</EmptyTitle>
              <EmptyDescription>
                Tambahkan supplier baru untuk mulai mencatat pembelian.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </div>
  )
}