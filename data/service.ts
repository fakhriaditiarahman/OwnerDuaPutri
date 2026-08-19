import "server-only"

import store from "@/data/mock"
import type {
  DashboardData,
  PriceHistory,
  Product,
  ProductWithRelations,
  Purchase,
  PurchaseReport,
  PurchaseWithRelations,
  Supplier,
} from "@/lib/types"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

function getSupplierName(supplierId: string | null): string | null {
  if (!supplierId) return null
  return store.getSuppliers().find((s) => s.supplier_id === supplierId)?.name ?? null
}

function getProductName(productId: string): string {
  return store.getProducts().find((p) => p.product_id === productId)?.name ?? productId
}

function enrichPurchase(p: Purchase): PurchaseWithRelations {
  return {
    ...p,
    supplier_name: getSupplierName(p.supplier_id) ?? "-",
    items: p.items.map((i) => ({
      ...i,
      product_name: getProductName(i.product_id),
    })),
  }
}

export async function getDashboardData(): Promise<DashboardData> {
  await delay(200)
  const products = store.getProducts()
  const suppliers = store.getSuppliers()
  const purchases = store.getPurchases()

  const currentMonth = todayISO().slice(0, 7)

  return {
    totalProducts: products.length,
    purchasesThisMonth: purchases.filter((p) => p.purchase_date.startsWith(currentMonth)).length,
    totalSuppliers: suppliers.length,
    recentPurchases: purchases
      .slice()
      .sort((a, b) => {
      const byDate = b.purchase_date.localeCompare(a.purchase_date)
      if (byDate !== 0) return byDate
      return (b.created_at ?? "").localeCompare(a.created_at ?? "")
    })
      .slice(0, 8)
      .map(enrichPurchase),
  }
}

export async function getProducts(): Promise<Product[]> {
  await delay(150)
  return store.getProducts()
}

export async function searchProducts(keyword: string): Promise<Product[]> {
  await delay(100)
  const q = keyword.trim().toLowerCase()
  if (!q) return store.getProducts()
  return store
    .getProducts()
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.barcode?.toLowerCase().includes(q),
    )
}

export async function getProduct(productId: string): Promise<ProductWithRelations | null> {
  await delay(100)
  const product = store.getProducts().find((p) => p.product_id === productId)
  if (!product) return null

  const history = store
    .getPriceHistory()
    .filter((h) => h.product_id === productId)
    .sort((a, b) => {
      const byDate = b.purchase_date.localeCompare(a.purchase_date)
      if (byDate !== 0) return byDate
      return (b.created_at ?? "").localeCompare(a.created_at ?? "")
    })

  return {
    ...product,
    supplier_name: getSupplierName(product.last_supplier_id),
    price_history: history,
  }
}

export async function getPriceHistory(productId: string): Promise<PriceHistory[]> {
  await delay(100)
  return store
    .getPriceHistory()
    .filter((h) => h.product_id === productId)
    .sort((a, b) => {
      const byDate = b.purchase_date.localeCompare(a.purchase_date)
      if (byDate !== 0) return byDate
      return (b.created_at ?? "").localeCompare(a.created_at ?? "")
    })
}

export async function getSuppliers(): Promise<Supplier[]> {
  await delay(100)
  return store.getSuppliers()
}

export async function getSupplier(supplierId: string): Promise<Supplier | null> {
  await delay(50)
  return store.getSuppliers().find((s) => s.supplier_id === supplierId) ?? null
}

export interface PurchaseFilters {
  startDate?: string
  endDate?: string
  supplierId?: string
  keyword?: string
}

export async function getPurchases(filters: PurchaseFilters = {}): Promise<PurchaseWithRelations[]> {
  await delay(150)
  let list = store.getPurchases()

  if (filters.supplierId) {
    list = list.filter((p) => p.supplier_id === filters.supplierId)
  }
  if (filters.startDate) {
    list = list.filter((p) => p.purchase_date >= filters.startDate!)
  }
  if (filters.endDate) {
    list = list.filter((p) => p.purchase_date <= filters.endDate!)
  }
  if (filters.keyword) {
    const q = filters.keyword.toLowerCase()
    list = list.filter(
      (p) =>
        p.purchase_id.toLowerCase().includes(q) ||
        getSupplierName(p.supplier_id)?.toLowerCase().includes(q) ||
        p.items.some((i) => getProductName(i.product_id).toLowerCase().includes(q)),
    )
  }

  return list
    .slice()
    .sort((a, b) => {
      const byDate = b.purchase_date.localeCompare(a.purchase_date)
      if (byDate !== 0) return byDate
      return (b.created_at ?? "").localeCompare(a.created_at ?? "")
    })
    .map(enrichPurchase)
}

export async function getPurchase(purchaseId: string): Promise<PurchaseWithRelations | null> {
  await delay(100)
  const purchase = store.getPurchases().find((p) => p.purchase_id === purchaseId)
  if (!purchase) return null
  return enrichPurchase(purchase)
}

export interface ReportFilters {
  startDate?: string
  endDate?: string
  supplierId?: string
}

export async function getPurchaseReport(filters: ReportFilters = {}): Promise<PurchaseReport> {
  await delay(150)
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
  return store.createPurchase(input)
}

export async function createProduct(
  data: Omit<Product, "product_id" | "created_at" | "updated_at">,
): Promise<Product> {
  return store.createProduct(data)
}

export async function updateProduct(
  productId: string,
  data: Partial<Omit<Product, "product_id" | "created_at">>,
): Promise<Product> {
  return store.updateProduct(productId, data)
}

export async function createSupplier(
  data: Omit<Supplier, "supplier_id" | "created_at" | "updated_at">,
): Promise<Supplier> {
  return store.createSupplier(data)
}

export async function updateSupplier(
  supplierId: string,
  data: Partial<Omit<Supplier, "supplier_id" | "created_at">>,
): Promise<Supplier> {
  return store.updateSupplier(supplierId, data)
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}