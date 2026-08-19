"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import {
  createProduct,
  createPurchase,
  createSupplier,
  updateProduct,
  updateSupplier,
} from "@/data/service"

export type ActionState = { error?: string }

export async function createProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const name = formData.get("name")?.toString().trim()
  if (!name) return { error: "Nama barang wajib diisi" }

  const unit = formData.get("unit")?.toString().trim()
  if (!unit) return { error: "Satuan wajib diisi" }

  const barcode = formData.get("barcode")?.toString().trim() || null
  const category = formData.get("category")?.toString().trim() || null
  const piecesRaw = formData.get("pieces_per_box")?.toString().trim()
  const pieces = piecesRaw ? parseInt(piecesRaw, 10) : null

  await createProduct({
    name,
    unit,
    barcode,
    category,
    pieces_per_box: pieces && pieces > 0 ? pieces : null,
    last_purchase_price: null,
    last_purchase_date: null,
    last_supplier_id: null,
  })

  revalidatePath("/barang")
  revalidatePath("/")
  redirect("/barang")
}

export async function updateProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const productId = formData.get("product_id")?.toString()
  if (!productId) return { error: "ID produk tidak valid" }

  const name = formData.get("name")?.toString().trim()
  if (!name) return { error: "Nama barang wajib diisi" }
  const unit = formData.get("unit")?.toString().trim()
  if (!unit) return { error: "Satuan wajib diisi" }

  const barcode = formData.get("barcode")?.toString().trim() || null
  const category = formData.get("category")?.toString().trim() || null
  const piecesRaw = formData.get("pieces_per_box")?.toString().trim()
  const pieces = piecesRaw ? parseInt(piecesRaw, 10) : null

  await updateProduct(productId, {
    name,
    unit,
    barcode,
    category,
    pieces_per_box: pieces && pieces > 0 ? pieces : null,
  })

  revalidatePath(`/barang/${productId}`)
  revalidatePath("/barang")
  revalidatePath("/")
  redirect(`/barang/${productId}`)
}

export async function createSupplierAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const name = formData.get("name")?.toString().trim()
  if (!name) return { error: "Nama supplier wajib diisi" }

  const phone = formData.get("phone")?.toString().trim() || null
  const address = formData.get("address")?.toString().trim() || null
  const notes = formData.get("notes")?.toString().trim() || null

  await createSupplier({ name, phone, address, notes })

  revalidatePath("/supplier")
  redirect("/supplier")
}

export async function updateSupplierAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supplierId = formData.get("supplier_id")?.toString()
  if (!supplierId) return { error: "ID supplier tidak valid" }

  const name = formData.get("name")?.toString().trim()
  if (!name) return { error: "Nama supplier wajib diisi" }

  const phone = formData.get("phone")?.toString().trim() || null
  const address = formData.get("address")?.toString().trim() || null
  const notes = formData.get("notes")?.toString().trim() || null

  await updateSupplier(supplierId, { name, phone, address, notes })

  revalidatePath("/supplier")
  redirect("/supplier")
}

export async function createPurchaseAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supplierId = formData.get("supplier_id")?.toString()
  const purchaseDate = formData.get("purchase_date")?.toString()
  const notes = formData.get("notes")?.toString().trim() || null

  if (!supplierId) return { error: "Pilih supplier" }
  if (!purchaseDate) return { error: "Pilih tanggal pembelian" }

  const productIds = formData.getAll("product_id[]").map(String)
  const quantities = formData.getAll("quantity[]").map(String)
  const prices = formData.getAll("price_per_unit[]").map(String)

  const items = productIds
    .map((productId, i) => {
      const quantity = parseInt(quantities[i] ?? "0", 10)
      const pricePerUnit = parseInt(prices[i] ?? "0", 10)
      if (!productId || quantity <= 0 || pricePerUnit <= 0) return null
      return { product_id: productId, quantity, price_per_unit: pricePerUnit }
    })
    .filter(Boolean)

  if (items.length === 0) {
    return { error: "Tambahkan minimal 1 barang pembelian" }
  }

  const purchaseId = await createPurchase({
    supplier_id: supplierId,
    purchase_date: purchaseDate,
    notes,
    items: items as Array<{ product_id: string; quantity: number; price_per_unit: number }>,
  })

  revalidatePath("/pembelian")
  revalidatePath("/pembelian/baru")
  revalidatePath("/barang")
  revalidatePath("/laporan")
  revalidatePath("/")

  redirect(`/pembelian/${purchaseId}`)
}