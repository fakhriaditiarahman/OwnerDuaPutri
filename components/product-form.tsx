"use client"

import { useActionState } from "react"

import { createProductAction, updateProductAction, type ActionState } from "@/app/actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import type { Product } from "@/lib/types"

interface Props {
  product?: Product
}

export function ProductForm({ product }: Props) {
  const isEdit = Boolean(product)
  const action = isEdit ? updateProductAction : createProductAction
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {})

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {product && <input type="hidden" name="product_id" value={product.product_id} />}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Nama Barang *</FieldLabel>
          <Input
            id="name"
            name="name"
            required
            defaultValue={product?.name}
            placeholder="Contoh: Indomie Goreng"
          />
        </Field>

        <FieldGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="category">Kategori</FieldLabel>
            <Input
              id="category"
              name="category"
              defaultValue={product?.category ?? ""}
              placeholder="Contoh: Mie Instan"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="unit">Satuan *</FieldLabel>
            <Input
              id="unit"
              name="unit"
              required
              defaultValue={product?.unit ?? ""}
              placeholder="Contoh: Dus"
            />
          </Field>
        </FieldGroup>

        <FieldGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="pieces_per_box">Isi per Dus</FieldLabel>
            <Input
              id="pieces_per_box"
              name="pieces_per_box"
              type="number"
              min={0}
              defaultValue={product?.pieces_per_box ?? ""}
              placeholder="Contoh: 40"
            />
            <FieldDescription>Jumlah pcs dalam 1 dus.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="barcode">Barcode</FieldLabel>
            <Input
              id="barcode"
              name="barcode"
              defaultValue={product?.barcode ?? ""}
              placeholder="Kode barcode (opsional)"
            />
          </Field>
        </FieldGroup>
      </FieldGroup>

      {state?.error && (
        <Alert variant="destructive">
          <AlertTitle>Gagal menyimpan</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending && <Spinner data-icon="inline-start" />}
          {pending ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Barang"}
        </Button>
      </div>
    </form>
  )
}
