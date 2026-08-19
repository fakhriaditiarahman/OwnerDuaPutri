export interface Product {
  product_id: string
  barcode: string | null
  name: string
  category: string | null
  unit: string
  pieces_per_box: number | null
  last_purchase_price: number | null
  last_purchase_date: string | null
  last_supplier_id: string | null
  created_at: string
  updated_at: string
}

export interface Supplier {
  supplier_id: string
  name: string
  phone: string | null
  address: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface PurchaseItem {
  purchase_item_id: string
  purchase_id: string
  product_id: string
  quantity: number
  price_per_unit: number
  subtotal: number
}

export interface Purchase {
  purchase_id: string
  supplier_id: string
  purchase_date: string
  total_amount: number
  notes: string | null
  created_at: string
  items: PurchaseItem[]
}

export interface PriceHistory {
  history_id: string
  product_id: string
  purchase_id: string
  supplier_id: string
  purchase_date: string
  quantity: number
  price_per_unit: number
  created_at: string
}

export interface DashboardData {
  totalProducts: number
  purchasesThisMonth: number
  totalSuppliers: number
  recentPurchases: PurchaseWithRelations[]
}

export interface PurchaseReport {
  totalAmount: number
  totalPurchases: number
  totalSuppliers: number
  details: Array<
    Purchase & {
      supplier_name: string
      items: Array<
        PurchaseItem & {
          product_name: string
        }
      >
    }
  >
}

export interface ProductWithRelations extends Product {
  supplier_name: string | null
  price_history: PriceHistory[]
}

export interface PurchaseWithRelations extends Purchase {
  supplier_name: string
  items: Array<
    PurchaseItem & {
      product_name: string
    }
  >
}