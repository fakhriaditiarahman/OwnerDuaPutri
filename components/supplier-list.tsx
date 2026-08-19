"use client"

import { Truck } from "lucide-react"

import { EditSupplierDialog } from "@/components/supplier-dialogs"
import { PaginationBar } from "@/components/ui/pagination"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { usePagination } from "@/hooks/use-pagination"
import type { Supplier } from "@/lib/types"

export function SupplierList({ suppliers }: { suppliers: Supplier[] }) {
  const { page, setPage, pageCount, current } = usePagination(suppliers, 12)

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {current.map((s) => (
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

      <PaginationBar page={page} pageCount={pageCount} onPageChange={setPage} />
    </>
  )
}
