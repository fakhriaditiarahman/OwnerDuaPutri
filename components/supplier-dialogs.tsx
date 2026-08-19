"use client"

import { useState } from "react"
import { Pencil, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SupplierForm } from "@/components/supplier-form"
import type { Supplier } from "@/lib/types"

export function AddSupplierDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus data-icon="inline-start" /> Tambah Supplier
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Tambah Supplier</DialogTitle>
          <DialogDescription>Catat supplier baru.</DialogDescription>
        </DialogHeader>
        <SupplierForm />
      </DialogContent>
    </Dialog>
  )
}

export function EditSupplierDialog({ supplier }: { supplier: Supplier }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`Edit ${supplier.name}`} />}>
        <Pencil />
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Supplier</DialogTitle>
          <DialogDescription>Perbarui data supplier.</DialogDescription>
        </DialogHeader>
        <SupplierForm key={supplier.supplier_id} supplier={supplier} />
      </DialogContent>
    </Dialog>
  )
}