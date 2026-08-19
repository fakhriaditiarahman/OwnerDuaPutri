"use client"

import { useActionState, useState } from "react"
import { Plus, Trash2 } from "lucide-react"

import { createPurchaseAction, type ActionState } from "@/app/actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { formatRupiah, todayISO } from "@/lib/format"
import type { Product, Supplier } from "@/lib/types"

interface Props {
  products: Product[]
  suppliers: Supplier[]
}

interface Row {
  key: number
  productId: string
  quantity: number
  price: number
}

export function PurchaseForm({ products, suppliers }: Props) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createPurchaseAction,
    {},
  )

  const [rows, setRows] = useState<Row[]>([
    { key: 1, productId: "", quantity: 0, price: 0 },
  ])
  const [date, setDate] = useState(todayISO())

  const addRow = () =>
    setRows((r) => [...r, { key: Date.now(), productId: "", quantity: 0, price: 0 }])

  const removeRow = (key: number) =>
    setRows((r) => (r.length > 1 ? r.filter((row) => row.key !== key) : r))

  const updateRow = (key: number, patch: Partial<Row>) =>
    setRows((r) => r.map((row) => (row.key === key ? { ...row, ...patch } : row)))

  const total = rows.reduce(
    (sum, row) => sum + (row.quantity || 0) * (row.price || 0),
    0,
  )

  const supplierItems = Object.fromEntries(suppliers.map((s) => [s.supplier_id, s.name]))
  const productItems = Object.fromEntries(products.map((p) => [p.product_id, p.name]))

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <FieldGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="supplier_id">Supplier *</FieldLabel>
          <Select name="supplier_id" required items={supplierItems}>
            <SelectTrigger className="w-full" id="supplier_id">
              <SelectValue placeholder="Pilih supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((s) => (
                <SelectItem key={s.supplier_id} value={s.supplier_id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="purchase_date">Tanggal Pembelian *</FieldLabel>
          <Input
            id="purchase_date"
            name="purchase_date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>
      </FieldGroup>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <FieldLabel>Barang</FieldLabel>
          <Button type="button" variant="outline" size="sm" onClick={addRow}>
            <Plus data-icon="inline-start" /> Tambah Barang
          </Button>
        </div>

        {rows.map((row, idx) => {
          const subtotal = (row.quantity || 0) * (row.price || 0)
          const product = products.find((p) => p.product_id === row.productId)
          return (
            <Card key={row.key} data-index={idx}>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-2">
                  <FieldGroup className="flex-1 gap-4">
                    <Field>
                      <FieldLabel className="text-xs text-muted-foreground">
                        Nama Barang
                      </FieldLabel>
                      <Select
                        name="product_id[]"
                        required
                        items={productItems}
                        value={row.productId}
                        onValueChange={(v) => updateRow(row.key, { productId: v ?? "" })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih barang" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((p) => (
                            <SelectItem key={p.product_id} value={p.product_id}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeRow(row.key)}
                    aria-label="Hapus barang"
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                </div>

                <FieldGroup className="grid grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel className="text-xs text-muted-foreground">Jumlah Dus</FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      inputMode="numeric"
                      placeholder="0"
                      name="quantity[]"
                      value={row.quantity || ""}
                      onChange={(e) =>
                        updateRow(row.key, { quantity: parseInt(e.target.value, 10) || 0 })
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel className="text-xs text-muted-foreground">
                      Harga per Dus (Rp)
                    </FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      inputMode="numeric"
                      placeholder="0"
                      name="price_per_unit[]"
                      value={row.price || ""}
                      onChange={(e) =>
                        updateRow(row.key, { price: parseInt(e.target.value, 10) || 0 })
                      }
                    />
                  </Field>
                </FieldGroup>

                <div className="text-right text-sm text-muted-foreground">
                  {product ? (
                    <>
                      Subtotal:{" "}
                      <span className="font-semibold text-foreground">
                        {formatRupiah(subtotal)}
                      </span>
                    </>
                  ) : (
                    <span className="italic">Pilih barang untuk menghitung subtotal</span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-muted px-4 py-3">
        <span className="text-sm font-medium">Total Pembelian</span>
        <span className="text-xl font-bold">{formatRupiah(total)}</span>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="notes">Catatan</FieldLabel>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Catatan pembelian (opsional)"
            rows={3}
          />
        </Field>
      </FieldGroup>

      {state?.error && (
        <Alert variant="destructive">
          <AlertTitle>Gagal menyimpan</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={pending}>
        {pending && <Spinner data-icon="inline-start" />}
        {pending ? "Menyimpan..." : "Simpan Pembelian"}
      </Button>
    </form>
  )
}