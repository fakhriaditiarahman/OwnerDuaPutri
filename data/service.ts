import "server-only"

import { supabase } from "@/lib/supabase/server"
import type {
  DashboardData,
  PriceHistory,
  Product,
  ProductWithRelations,
  Purchase,
  PurchaseItem,
  PurchaseReport,
  PurchaseWithRelations,
  Supplier,
} from "@/lib/types"

function throwIfError(error: { message: string } | null, fallback: string): void {
  if (error) throw new Error(error.message || fallback)
}

function mapProduct(row: Product): Product {
  return { ...row }
}

function mapPurchase(row: PurchaseRow): PurchaseWithRelations {
  return {
    purchase_id: row.purchase_id,
    supplier_id: row.supplier_id,
    purchase_date: row.purchase_date,
    total_amount: row.total_amount,
    notes: row.notes,
    created_at: row.created_at,
    supplier_name: row.supplier?.name ?? "-",
    items: (row.items ?? []).map((i) => ({
      purchase_item_id: i.purchase_item_id,
      purchase_id: i.purchase_id,
      product_id: i.product_id,
      quantity: i.quantity,
      price_per_unit: i.price_per_unit,
      subtotal: i.subtotal,
      product_name: i.product?.name ?? i.product_id,
    })),
  }
}

interface PurchaseRow {
  purchase_id: string
  supplier_id: string
  purchase_date: string
  total_amount: number
  notes: string | null
  created_at: string
  supplier: { name: string } | null
  items: Array<{
    purchase_item_id: string
    purchase_id: string
    product_id: string
    quantity: number
    price_per_unit: number
    subtotal: number
    product: { name: string } | null
  }>
}

const PURCHASE_SELECT = "*, supplier:suppliers(name), items:purchase_items(*, product:products(name))"

function monthRange(now = new Date()): { start: string; end: string } {
  const y = now.getFullYear()
  const m = now.getMonth()
  const start = `${y}-${String(m + 1).padStart(2, "0")}-01`
  const end = m === 11 ? `${y + 1}-01-01` : `${y}-${String(m + 2).padStart(2, "0")}-01`
  return { start, end }
}

export async function getDashboardData(): Promise<DashboardData> {
  const { start, end } = monthRange()

  const [productsRes, suppliersRes, monthRes, recentRes] = await Promise.all([
    supabase.from("products").select("product_id", { count: "exact", head: true }),
    supabase.from("suppliers").select("supplier_id", { count: "exact", head: true }),
    supabase
      .from("purchases")
      .select("purchase_id", { count: "exact", head: true })
      .gte("purchase_date", start)
      .lt("purchase_date", end),
    supabase
      .from("purchases")
      .select(PURCHASE_SELECT)
      .order("purchase_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(8),
  ])

  throwIfError(productsRes.error, "Gagal mengambil data barang")
  throwIfError(suppliersRes.error, "Gagal mengambil data supplier")
  throwIfError(monthRes.error, "Gagal mengambil data pembelian")
  throwIfError(recentRes.error, "Gagal mengambil pembelian terbaru")

  return {
    totalProducts: productsRes.count ?? 0,
    purchasesThisMonth: monthRes.count ?? 0,
    totalSuppliers: suppliersRes.count ?? 0,
    recentPurchases: (recentRes.data ?? []).map(mapPurchase),
  }
}

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
]

const CHART_PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

export interface MonthlySpend {
  month: string
  total: number
}

export interface SupplierSpend {
  key: string
  supplier: string
  total: number
  fill: string
}

export interface TopProduct {
  name: string
  quantity: number
}

export interface DashboardStats {
  monthly: MonthlySpend[]
  bySupplier: SupplierSpend[]
  topProducts: TopProduct[]
  totalSpendThisMonth: number
}

interface StatsRow {
  purchase_date: string
  total_amount: number
  supplier: { name: string } | null
  items: Array<{ quantity: number; product: { name: string } | null }>
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - 5, 1)
  const startStr = start.toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from("purchases")
    .select(
      "purchase_date, total_amount, supplier:suppliers(name), items:purchase_items(quantity, product:products(name))",
    )
    .gte("purchase_date", startStr)
    .order("purchase_date", { ascending: true })

  throwIfError(error, "Gagal mengambil statistik pembelian")

  const rows = (data ?? []) as unknown as StatsRow[]

  const monthlyMap = new Map<string, number>()
  const supplierMap = new Map<string, number>()
  const productMap = new Map<string, number>()

  let totalSpendThisMonth = 0
  const monthNow = now.getMonth()
  const yearNow = now.getFullYear()

  for (const row of rows) {
    const d = new Date(row.purchase_date)
    const y = d.getFullYear()
    const m = d.getMonth()
    const key = `${y}-${String(m + 1).padStart(2, "0")}`
    monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + row.total_amount)

    if (y === yearNow && m === monthNow) {
      totalSpendThisMonth += row.total_amount
    }

    const supplierName = row.supplier?.name ?? "Tanpa Supplier"
    supplierMap.set(supplierName, (supplierMap.get(supplierName) ?? 0) + row.total_amount)

    for (const item of row.items ?? []) {
      const productName = item.product?.name ?? "Barang"
      productMap.set(productName, (productMap.get(productName) ?? 0) + item.quantity)
    }
  }

  const monthly: MonthlySpend[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    monthly.push({ month: MONTH_LABELS[d.getMonth()], total: monthlyMap.get(key) ?? 0 })
  }

  const supplierEntries = [...supplierMap.entries()].sort((a, b) => b[1] - a[1])
  const topSuppliers = supplierEntries.slice(0, 5)
  const restSuppliers = supplierEntries.slice(5)
  const bySupplier: SupplierSpend[] = topSuppliers.map(([supplier, total], i) => ({
    key: `supplier-${i}`,
    supplier,
    total,
    fill: CHART_PALETTE[i % CHART_PALETTE.length],
  }))
  if (restSuppliers.length > 0) {
    const lainnya = restSuppliers.reduce((sum, [, t]) => sum + t, 0)
    bySupplier.push({
      key: "supplier-other",
      supplier: "Lainnya",
      total: lainnya,
      fill: CHART_PALETTE[5 % CHART_PALETTE.length],
    })
  }

  const topProducts: TopProduct[] = [...productMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, quantity]) => ({ name, quantity }))

  return { monthly, bySupplier, topProducts, totalSpendThisMonth }
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").order("name")
  throwIfError(error, "Gagal mengambil data barang")
  return (data ?? []).map(mapProduct)
}

export async function searchProducts(keyword: string): Promise<Product[]> {
  const q = keyword.trim()
  if (!q) return getProducts()

  const escaped = q.replace(/[%_]/g, "\\$&")
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .or(`name.ilike.%${escaped}%,category.ilike.%${escaped}%,barcode.ilike.%${escaped}%`)
    .order("name")

  throwIfError(error, "Gagal mencari barang")
  return (data ?? []).map(mapProduct)
}

export async function getProduct(productId: string): Promise<ProductWithRelations | null> {
  const [productRes, historyRes] = await Promise.all([
    supabase.from("products").select("*, supplier:suppliers(name)").eq("product_id", productId).single(),
    supabase
      .from("price_history")
      .select("*")
      .eq("product_id", productId)
      .order("purchase_date", { ascending: false })
      .order("created_at", { ascending: false }),
  ])

  if (productRes.error) {
    if (productRes.error.code === "PGRST116") return null
    throw new Error(productRes.error.message)
  }
  throwIfError(historyRes.error, "Gagal mengambil histori harga")

  const product = productRes.data as Product & { supplier: { name: string } | null }

  return {
    ...mapProduct(product),
    supplier_name: product.supplier?.name ?? null,
    price_history: historyRes.data ?? [],
  }
}

export async function getPriceHistory(productId: string): Promise<PriceHistory[]> {
  const { data, error } = await supabase
    .from("price_history")
    .select("*")
    .eq("product_id", productId)
    .order("purchase_date", { ascending: false })
    .order("created_at", { ascending: false })

  throwIfError(error, "Gagal mengambil histori harga")
  return data ?? []
}

export async function getSuppliers(): Promise<Supplier[]> {
  const { data, error } = await supabase.from("suppliers").select("*").order("name")
  throwIfError(error, "Gagal mengambil data supplier")
  return data ?? []
}

export async function getSupplier(supplierId: string): Promise<Supplier | null> {
  const { data, error } = await supabase.from("suppliers").select("*").eq("supplier_id", supplierId).single()
  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(error.message)
  }
  return data
}

export interface PurchaseFilters {
  startDate?: string
  endDate?: string
  supplierId?: string
  keyword?: string
}

export async function getPurchases(filters: PurchaseFilters = {}): Promise<PurchaseWithRelations[]> {
  let query = supabase
    .from("purchases")
    .select(PURCHASE_SELECT)
    .order("purchase_date", { ascending: false })
    .order("created_at", { ascending: false })

  if (filters.supplierId) query = query.eq("supplier_id", filters.supplierId)
  if (filters.startDate) query = query.gte("purchase_date", filters.startDate)
  if (filters.endDate) query = query.lte("purchase_date", filters.endDate)

  const { data, error } = await query
  throwIfError(error, "Gagal mengambil riwayat pembelian")

  let rows = (data ?? []).map(mapPurchase)

  if (filters.keyword) {
    const q = filters.keyword.toLowerCase()
    rows = rows.filter(
      (p) =>
        p.purchase_id.toLowerCase().includes(q) ||
        p.supplier_name.toLowerCase().includes(q) ||
        p.items.some((i) => i.product_name.toLowerCase().includes(q)),
    )
  }

  return rows
}

export async function getPurchase(purchaseId: string): Promise<PurchaseWithRelations | null> {
  const { data, error } = await supabase
    .from("purchases")
    .select(PURCHASE_SELECT)
    .eq("purchase_id", purchaseId)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(error.message)
  }
  return mapPurchase(data as PurchaseRow)
}

export interface ReportFilters {
  startDate?: string
  endDate?: string
  supplierId?: string
}

export async function getPurchaseReport(filters: ReportFilters = {}): Promise<PurchaseReport> {
  const purchases = await getPurchases({
    startDate: filters.startDate,
    endDate: filters.endDate,
    supplierId: filters.supplierId,
  })

  return {
    totalAmount: purchases.reduce((sum, p) => sum + p.total_amount, 0),
    totalPurchases: purchases.length,
    totalSuppliers: new Set(purchases.map((p) => p.supplier_id)).size,
    details: purchases,
  }
}

export interface CreatePurchaseInput {
  supplier_id: string
  purchase_date: string
  notes?: string | null
  items: Array<{ product_id: string; quantity: number; price_per_unit: number }>
}

export async function createPurchase(input: CreatePurchaseInput): Promise<string> {
  const { data, error } = await supabase.rpc("create_purchase", {
    p_supplier_id: input.supplier_id,
    p_purchase_date: input.purchase_date,
    p_notes: input.notes ?? null,
    p_items: input.items,
  })

  throwIfError(error, "Gagal menyimpan pembelian")
  if (!data) throw new Error("Gagal menyimpan pembelian")
  return data
}

async function nextCode(seq: string, prefix: string): Promise<string> {
  const { data, error } = await supabase.rpc("next_code", { p_seq: seq, p_prefix: prefix })
  throwIfError(error, "Gagal membuat ID baru")
  if (!data) throw new Error("Gagal membuat ID baru")
  return data
}

export async function createProduct(
  data: Omit<Product, "product_id" | "created_at" | "updated_at">,
): Promise<Product> {
  const productId = await nextCode("product_seq", "BRG")
  const now = new Date().toISOString()

  const { data: row, error } = await supabase
    .from("products")
    .insert({
      product_id: productId,
      barcode: data.barcode ?? null,
      name: data.name,
      category: data.category ?? null,
      unit: data.unit,
      pieces_per_box: data.pieces_per_box ?? null,
      last_purchase_price: null,
      last_purchase_date: null,
      last_supplier_id: null,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single()

  throwIfError(error, "Gagal menyimpan barang")
  return mapProduct(row)
}

export async function updateProduct(
  productId: string,
  data: Partial<Omit<Product, "product_id" | "created_at">>,
): Promise<Product> {
  const safe: Partial<Pick<Product, "name" | "barcode" | "category" | "unit" | "pieces_per_box">> = {}
  if (data.name !== undefined) safe.name = data.name
  if (data.barcode !== undefined) safe.barcode = data.barcode
  if (data.category !== undefined) safe.category = data.category
  if (data.unit !== undefined) safe.unit = data.unit
  if (data.pieces_per_box !== undefined) safe.pieces_per_box = data.pieces_per_box

  const { data: row, error } = await supabase
    .from("products")
    .update(safe)
    .eq("product_id", productId)
    .select()
    .single()

  if (error) {
    if (error.code === "PGRST116") throw new Error("Produk tidak ditemukan")
    throw new Error(error.message)
  }
  return mapProduct(row)
}

export async function createSupplier(
  data: Omit<Supplier, "supplier_id" | "created_at" | "updated_at">,
): Promise<Supplier> {
  const supplierId = await nextCode("supplier_seq", "SUP")
  const now = new Date().toISOString()

  const { data: row, error } = await supabase
    .from("suppliers")
    .insert({
      supplier_id: supplierId,
      name: data.name,
      phone: data.phone ?? null,
      address: data.address ?? null,
      notes: data.notes ?? null,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single()

  throwIfError(error, "Gagal menyimpan supplier")
  return row
}

export async function updateSupplier(
  supplierId: string,
  data: Partial<Omit<Supplier, "supplier_id" | "created_at">>,
): Promise<Supplier> {
  const { data: row, error } = await supabase
    .from("suppliers")
    .update(data)
    .eq("supplier_id", supplierId)
    .select()
    .single()

  if (error) {
    if (error.code === "PGRST116") throw new Error("Supplier tidak ditemukan")
    throw new Error(error.message)
  }
  return row
}

async function advanceSequences(): Promise<void> {
  const { error } = await supabase.rpc("advance_sequences")
  throwIfError(error, "Gagal menyelaraskan sequence ID")
}

export async function getFullBackup(): Promise<{
  products: Product[]
  suppliers: Supplier[]
  purchases: Purchase[]
  purchase_items: PurchaseItem[]
  price_history: PriceHistory[]
}> {
  const [products, suppliers, purchases, purchase_items, price_history] = await Promise.all([
    supabase.from("products").select("*").order("name"),
    supabase.from("suppliers").select("*").order("name"),
    supabase.from("purchases").select("*").order("purchase_date", { ascending: false }),
    supabase.from("purchase_items").select("*").order("purchase_item_id"),
    supabase.from("price_history").select("*").order("created_at", { ascending: false }),
  ])

  throwIfError(products.error, "Gagal menyiapkan backup barang")
  throwIfError(suppliers.error, "Gagal menyiapkan backup supplier")
  throwIfError(purchases.error, "Gagal menyiapkan backup pembelian")
  throwIfError(purchase_items.error, "Gagal menyiapkan backup item")
  throwIfError(price_history.error, "Gagal menyiapkan backup histori")

  return {
    products: products.data ?? [],
    suppliers: suppliers.data ?? [],
    purchases: purchases.data ?? [],
    purchase_items: purchase_items.data ?? [],
    price_history: price_history.data ?? [],
  }
}

export interface RestoreSummary {
  inserted: number
}

export async function restoreBackup(input: import("@/lib/types").BackupData): Promise<RestoreSummary> {
  if (!input || typeof input !== "object") {
    throw new Error("Format backup tidak valid")
  }

  const supplierIds = new Set(input.suppliers.map((s) => s.supplier_id))

  // Produk rujukan supplier yang tak ada di backup -> null-kan agar tak melanggar FK.
  const products = input.products.map((p) => ({
    ...p,
    last_supplier_id:
      p.last_supplier_id && supplierIds.has(p.last_supplier_id) ? p.last_supplier_id : null,
  }))

  // Hindari bentrok barcode ganda di dalam backup.
  const seenBarcodes = new Set<string>()
  const cleanProducts = products.map((p) => {
    if (!p.barcode) return p
    if (seenBarcodes.has(p.barcode)) return { ...p, barcode: null }
    seenBarcodes.add(p.barcode)
    return p
  })

  let inserted = 0

  async function upsert(table: string, rows: unknown[]) {
    if (rows.length === 0) return
    const { error } = await supabase.from(table).upsert(rows as never, {
      onConflict: `${table === "price_history" ? "history_id" : table === "purchase_items" ? "purchase_item_id" : table === "purchases" ? "purchase_id" : table === "products" ? "product_id" : "supplier_id"}`,
    })
    if (error) {
      // Fallback: jika bentrok barcode, ulangi tanpa barcode.
      if (table === "products" && error.code === "23505") {
        const { error: retry } = await supabase.from(table).upsert(
          (rows as Array<Record<string, unknown>>).map((r) => ({ ...r, barcode: null })) as never,
          { onConflict: "product_id" },
        )
        throwIfError(retry, "Gagal restore barang")
        inserted += rows.length
        return
      }
      throwIfError(error, `Gagal restore ${table}`)
    }
    inserted += rows.length
  }

  await upsert("suppliers", input.suppliers)
  await upsert("products", cleanProducts)
  await upsert("purchases", input.purchases)
  await upsert("purchase_items", input.purchase_items)
  await upsert("price_history", input.price_history)

  await advanceSequences()

  return { inserted }
}