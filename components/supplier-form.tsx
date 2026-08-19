"use client"

import { useActionState } from "react"

import {
  createSupplierAction,
  updateSupplierAction,
  type ActionState,
} from "@/app/actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import type { Supplier } from "@/lib/types"

interface Props {
  supplier?: Supplier
}

export function SupplierForm({ supplier }: Props) {
  const isEdit = Boolean(supplier)
  const action = isEdit ? updateSupplierAction : createSupplierAction
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {})

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {supplier && <input type="hidden" name="supplier_id" value={supplier.supplier_id} />}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Nama Supplier *</FieldLabel>
          <Input
            id="name"
            name="name"
            required
            defaultValue={supplier?.name}
            placeholder="Contoh: PT ABC"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="phone">Nomor Telepon</FieldLabel>
          <Input
            id="phone"
            name="phone"
            defaultValue={supplier?.phone ?? ""}
            placeholder="Contoh: 081234567890"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="address">Alamat</FieldLabel>
          <Input
            id="address"
            name="address"
            defaultValue={supplier?.address ?? ""}
            placeholder="Alamat supplier"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="notes">Catatan</FieldLabel>
          <Textarea
            id="notes"
            name="notes"
            defaultValue={supplier?.notes ?? ""}
            placeholder="Catatan (opsional)"
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

      <Button type="submit" disabled={pending}>
        {pending && <Spinner data-icon="inline-start" />}
        {pending ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Supplier"}
      </Button>
    </form>
  )
}
