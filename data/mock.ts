import type {
  Product,
  Supplier,
  Purchase,
  PurchaseItem,
  PriceHistory,
} from "@/lib/types"

export const todayISO = "2026-08-19"

interface HistorySeed {
  qty: number
  price: number
  date: string
  supplier: string
}

const SUPPLIER_SEED: Supplier[] = [
  {
    supplier_id: "SUP-0001",
    name: "PT ABC",
    phone: "081234567801",
    address: "Jl. Raya Padang No. 12",
    notes: "Supplier utama mie instan",
    created_at: "2026-06-01T08:00:00Z",
    updated_at: "2026-08-19T10:00:00Z",
  },
  {
    supplier_id: "SUP-0002",
    name: "PT XYZ",
    phone: "081234567802",
    address: "Jl. Sudirman No. 45, Bukittinggi",
    notes: null,
    created_at: "2026-06-01T08:00:00Z",
    updated_at: "2026-08-18T09:00:00Z",
  },
  {
    supplier_id: "SUP-0003",
    name: "CV Berkah Pangan",
    phone: "081234567803",
    address: "Jl. A. Yani No. 78, Padang",
    notes: "Sembako dan minyak",
    created_at: "2026-06-05T08:00:00Z",
    updated_at: "2026-08-16T09:00:00Z",
  },
  {
    supplier_id: "SUP-0004",
    name: "UD Surya Jaya",
    phone: "081234567804",
    address: "Jl. Imam Bonjol No. 3, Payakumbuh",
    notes: null,
    created_at: "2026-06-10T08:00:00Z",
    updated_at: "2026-08-13T09:00:00Z",
  },
  {
    supplier_id: "SUP-0005",
    name: "Toko Makmur Sentosa",
    phone: "081234567805",
    address: "Jl. Diponegoro No. 21, Padang",
    notes: "Barang perawatan dan makanan ringan",
    created_at: "2026-06-12T08:00:00Z",
    updated_at: "2026-08-10T09:00:00Z",
  },
]

const PRODUCT_SEED: Array<{
  product_id: string
  barcode: string | null
  name: string
  category: string
  unit: string
  pieces_per_box: number | null
  history: HistorySeed[]
}> = [
  {
    product_id: "BRG-0001",
    barcode: "8991002101115",
    name: "Indomie Goreng",
    category: "Mie Instan",
    unit: "Dus",
    pieces_per_box: 40,
    history: [
      { qty: 10, price: 108000, date: "2026-07-28", supplier: "SUP-0002" },
      { qty: 5, price: 110000, date: "2026-08-05", supplier: "SUP-0002" },
      { qty: 10, price: 112000, date: "2026-08-12", supplier: "SUP-0001" },
      { qty: 10, price: 115000, date: "2026-08-19", supplier: "SUP-0001" },
    ],
  },
  {
    product_id: "BRG-0002",
    barcode: "8991002101122",
    name: "Indomie Ayam Bawang",
    category: "Mie Instan",
    unit: "Dus",
    pieces_per_box: 40,
    history: [
      { qty: 10, price: 109000, date: "2026-07-30", supplier: "SUP-0002" },
      { qty: 8, price: 112000, date: "2026-08-18", supplier: "SUP-0001" },
    ],
  },
  {
    product_id: "BRG-0003",
    barcode: "8991002101139",
    name: "Indomie Soto",
    category: "Mie Instan",
    unit: "Dus",
    pieces_per_box: 40,
    history: [
      { qty: 10, price: 107000, date: "2026-07-25", supplier: "SUP-0002" },
      { qty: 10, price: 110000, date: "2026-08-12", supplier: "SUP-0001" },
    ],
  },
  {
    product_id: "BRG-0004",
    barcode: "8992752011116",
    name: "Aqua 600ml",
    category: "Air Mineral",
    unit: "Dus",
    pieces_per_box: 24,
    history: [
      { qty: 20, price: 103000, date: "2026-08-10", supplier: "SUP-0002" },
      { qty: 20, price: 105000, date: "2026-08-18", supplier: "SUP-0002" },
    ],
  },
  {
    product_id: "BRG-0005",
    barcode: "8991009113210",
    name: "Teh Pucuk Harum",
    category: "Teh",
    unit: "Dus",
    pieces_per_box: 24,
    history: [
      { qty: 15, price: 70000, date: "2026-08-05", supplier: "SUP-0002" },
      { qty: 15, price: 72000, date: "2026-08-17", supplier: "SUP-0002" },
    ],
  },
  {
    product_id: "BRG-0006",
    barcode: "8991009113227",
    name: "Coca-Cola 390ml",
    category: "Minuman Ringan",
    unit: "Dus",
    pieces_per_box: 24,
    history: [
      { qty: 12, price: 106000, date: "2026-08-01", supplier: "SUP-0002" },
      { qty: 12, price: 108000, date: "2026-08-15", supplier: "SUP-0002" },
    ],
  },
  {
    product_id: "BRG-0007",
    barcode: null,
    name: "Minyak Goreng Bimoli 2L",
    category: "Minyak",
    unit: "Dus",
    pieces_per_box: 6,
    history: [
      { qty: 8, price: 172000, date: "2026-08-02", supplier: "SUP-0003" },
      { qty: 8, price: 175000, date: "2026-08-16", supplier: "SUP-0003" },
    ],
  },
  {
    product_id: "BRG-0008",
    barcode: null,
    name: "Beras Ramos 5kg",
    category: "Sembako",
    unit: "Karung",
    pieces_per_box: 10,
    history: [
      { qty: 10, price: 290000, date: "2026-08-03", supplier: "SUP-0003" },
      { qty: 10, price: 295000, date: "2026-08-14", supplier: "SUP-0003" },
    ],
  },
  {
    product_id: "BRG-0009",
    barcode: "8998100000111",
    name: "Gula Pasir 1kg",
    category: "Sembako",
    unit: "Dus",
    pieces_per_box: 20,
    history: [
      { qty: 20, price: 93000, date: "2026-08-06", supplier: "SUP-0004" },
      { qty: 20, price: 95000, date: "2026-08-13", supplier: "SUP-0004" },
    ],
  },
  {
    product_id: "BRG-0010",
    barcode: null,
    name: "Telur Ayam 1kg",
    category: "Sembako",
    unit: "Pikul",
    pieces_per_box: 1,
    history: [
      { qty: 50, price: 40000, date: "2026-08-04", supplier: "SUP-0004" },
      { qty: 50, price: 42000, date: "2026-08-11", supplier: "SUP-0004" },
    ],
  },
  {
    product_id: "BRG-0011",
    barcode: "8992702113310",
    name: "Kopi Kapal Api 12s",
    category: "Kopi",
    unit: "Dus",
    pieces_per_box: 12,
    history: [
      { qty: 10, price: 59000, date: "2026-08-05", supplier: "SUP-0005" },
      { qty: 10, price: 61000, date: "2026-08-10", supplier: "SUP-0005" },
    ],
  },
  {
    product_id: "BRG-0012",
    barcode: "8991009113327",
    name: "Teh Sariwangi 12s",
    category: "Teh",
    unit: "Dus",
    pieces_per_box: 12,
    history: [
      { qty: 10, price: 56000, date: "2026-08-06", supplier: "SUP-0005" },
      { qty: 10, price: 58000, date: "2026-08-10", supplier: "SUP-0005" },
    ],
  },
  {
    product_id: "BRG-0013",
    barcode: "8991009113135",
    name: "Biskuit Roma Kelapa 12s",
    category: "Makanan Ringan",
    unit: "Dus",
    pieces_per_box: 12,
    history: [{ qty: 12, price: 54000, date: "2026-08-09", supplier: "SUP-0005" }],
  },
  {
    product_id: "BRG-0014",
    barcode: "8999944000015",
    name: "Sabun Lifebuoy",
    category: "Perawatan",
    unit: "Dus",
    pieces_per_box: 12,
    history: [{ qty: 10, price: 66000, date: "2026-08-08", supplier: "SUP-0005" }],
  },
  {
    product_id: "BRG-0015",
    barcode: "8999944000022",
    name: "Shampo Clear 170ml",
    category: "Perawatan",
    unit: "Dus",
    pieces_per_box: 12,
    history: [{ qty: 10, price: 98000, date: "2026-08-07", supplier: "SUP-0002" }],
  },
]

function nextId(prefix: string, count: number, pad = 4): string {
  return `${prefix}-${String(count).padStart(pad, "0")}`
}

function buildSeed(): {
  products: Product[]
  suppliers: Supplier[]
  purchases: Purchase[]
  purchaseItems: PurchaseItem[]
  priceHistory: PriceHistory[]
} {
  const suppliers = SUPPLIER_SEED.map((s) => ({ ...s }))

  const products: Product[] = []
  const purchases: Purchase[] = []
  const purchaseItems: PurchaseItem[] = []
  const priceHistory: PriceHistory[] = []

  const purchaseEvents: Array<{
    date: string
    supplier_id: string
    product: (typeof PRODUCT_SEED)[number]
    qty: number
    price: number
  }> = []

  for (const p of PRODUCT_SEED) {
    for (const h of p.history) {
      purchaseEvents.push({
        date: h.date,
        supplier_id: h.supplier,
        product: p,
        qty: h.qty,
        price: h.price,
      })
    }
  }

  purchaseEvents.sort((a, b) => a.date.localeCompare(b.date))

  let purchaseCounter = 0
  for (const ev of purchaseEvents) {
    purchaseCounter += 1
    const purchaseId = nextId("PUR", purchaseCounter)
    const subtotal = ev.qty * ev.price

    purchases.push({
      purchase_id: purchaseId,
      supplier_id: ev.supplier_id,
      purchase_date: ev.date,
      total_amount: subtotal,
      notes: null,
      created_at: `${ev.date}T09:00:00Z`,
      items: [],
    })

    purchaseItems.push({
      purchase_item_id: nextId("PI", purchaseItems.length + 1),
      purchase_id: purchaseId,
      product_id: ev.product.product_id,
      quantity: ev.qty,
      price_per_unit: ev.price,
      subtotal,
    })

    priceHistory.push({
      history_id: nextId("PH", priceHistory.length + 1),
      product_id: ev.product.product_id,
      purchase_id: purchaseId,
      supplier_id: ev.supplier_id,
      purchase_date: ev.date,
      quantity: ev.qty,
      price_per_unit: ev.price,
      created_at: `${ev.date}T09:00:00Z`,
    })
  }

  for (const p of PRODUCT_SEED) {
    const last = p.history[p.history.length - 1]
    products.push({
      product_id: p.product_id,
      barcode: p.barcode,
      name: p.name,
      category: p.category,
      unit: p.unit,
      pieces_per_box: p.pieces_per_box,
      last_purchase_price: last.price,
      last_purchase_date: last.date,
      last_supplier_id: last.supplier,
      created_at: `${p.history[0].date}T08:00:00Z`,
      updated_at: `${last.date}T10:00:00Z`,
    })
  }

  const purchasesWithItems = purchases.map((pu) => ({
    ...pu,
    items: purchaseItems.filter((i) => i.purchase_id === pu.purchase_id),
  }))

  return {
    products,
    suppliers,
    purchases: purchasesWithItems,
    purchaseItems,
    priceHistory,
  }
}

export function createMockStore() {
  const seed = buildSeed()

  const state: {
    products: Product[]
    suppliers: Supplier[]
    purchases: Purchase[]
    purchaseItems: PurchaseItem[]
    priceHistory: PriceHistory[]
  } = {
    products: seed.products,
    suppliers: seed.suppliers,
    purchases: seed.purchases,
    purchaseItems: seed.purchaseItems,
    priceHistory: seed.priceHistory,
  }

  let productCounter = seed.products.length
  let supplierCounter = seed.suppliers.length
  let purchaseCounter = seed.purchases.length
  let itemCounter = seed.purchaseItems.length
  let historyCounter = seed.priceHistory.length

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

  return {
    getProducts: () => state.products.map((p) => ({ ...p })),
    getSuppliers: () => state.suppliers.map((s) => ({ ...s })),
    getPurchases: () => state.purchases.map((p) => ({ ...p, items: p.items.map((i) => ({ ...i })) })),
    getPriceHistory: () => state.priceHistory.map((h) => ({ ...h })),

    async createProduct(data: Omit<Product, "product_id" | "created_at" | "updated_at">) {
      await sleep(150)
      productCounter += 1
      const product: Product = {
        product_id: nextId("BRG", productCounter),
        barcode: data.barcode ?? null,
        name: data.name,
        category: data.category ?? null,
        unit: data.unit,
        pieces_per_box: data.pieces_per_box ?? null,
        last_purchase_price: null,
        last_purchase_date: null,
        last_supplier_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      state.products.push(product)
      return { ...product }
    },

    async updateProduct(productId: string, data: Partial<Omit<Product, "product_id" | "created_at">>) {
      await sleep(150)
      const idx = state.products.findIndex((p) => p.product_id === productId)
      if (idx === -1) throw new Error("Produk tidak ditemukan")
      state.products[idx] = {
        ...state.products[idx],
        ...data,
        updated_at: new Date().toISOString(),
      }
      return { ...state.products[idx] }
    },

    async createSupplier(data: Omit<Supplier, "supplier_id" | "created_at" | "updated_at">) {
      await sleep(150)
      supplierCounter += 1
      const supplier: Supplier = {
        supplier_id: nextId("SUP", supplierCounter),
        name: data.name,
        phone: data.phone ?? null,
        address: data.address ?? null,
        notes: data.notes ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      state.suppliers.push(supplier)
      return { ...supplier }
    },

    async updateSupplier(supplierId: string, data: Partial<Omit<Supplier, "supplier_id" | "created_at">>) {
      await sleep(150)
      const idx = state.suppliers.findIndex((s) => s.supplier_id === supplierId)
      if (idx === -1) throw new Error("Supplier tidak ditemukan")
      state.suppliers[idx] = {
        ...state.suppliers[idx],
        ...data,
        updated_at: new Date().toISOString(),
      }
      return { ...state.suppliers[idx] }
    },

    async createPurchase(input: {
      supplier_id: string
      purchase_date: string
      notes?: string | null
      items: Array<{ product_id: string; quantity: number; price_per_unit: number }>
    }) {
      await sleep(200)
      purchaseCounter += 1
      const purchaseId = nextId("PUR", purchaseCounter)
      const created = new Date().toISOString()

      const items = input.items.map((it) => {
        itemCounter += 1
        return {
          purchase_item_id: nextId("PI", itemCounter),
          purchase_id: purchaseId,
          product_id: it.product_id,
          quantity: it.quantity,
          price_per_unit: it.price_per_unit,
          subtotal: it.quantity * it.price_per_unit,
        }
      })

      const totalAmount = items.reduce((sum, i) => sum + i.subtotal, 0)

      const purchase: Purchase = {
        purchase_id: purchaseId,
        supplier_id: input.supplier_id,
        purchase_date: input.purchase_date,
        total_amount: totalAmount,
        notes: input.notes ?? null,
        created_at: created,
        items,
      }

      state.purchases.push(purchase)
      state.purchaseItems.push(...items)

      for (const it of items) {
        historyCounter += 1
        state.priceHistory.push({
          history_id: nextId("PH", historyCounter),
          product_id: it.product_id,
          purchase_id: purchaseId,
          supplier_id: input.supplier_id,
          purchase_date: input.purchase_date,
          quantity: it.quantity,
          price_per_unit: it.price_per_unit,
          created_at: created,
        })

        const pIdx = state.products.findIndex((p) => p.product_id === it.product_id)
        if (pIdx !== -1) {
          state.products[pIdx] = {
            ...state.products[pIdx],
            last_purchase_price: it.price_per_unit,
            last_purchase_date: input.purchase_date,
            last_supplier_id: input.supplier_id,
            updated_at: created,
          }
        }
      }

      return purchaseId
    },
  }
}

const store = createMockStore()

export default store