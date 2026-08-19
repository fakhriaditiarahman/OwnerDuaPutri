"use server"

import { getFullBackup, restoreBackup } from "@/data/service"
import { getPurchases } from "@/data/service"
import { isValidBackup } from "@/lib/backup"
import type { BackupData } from "@/lib/types"

export async function exportBackupAction(): Promise<BackupData> {
  const data = await getFullBackup()
  return {
    version: 1,
    exported_at: new Date().toISOString(),
    ...data,
  }
}

export interface RestoreResult {
  error?: string
  inserted?: number
}

export async function restoreBackupAction(data: BackupData): Promise<RestoreResult> {
  if (!isValidBackup(data)) {
    return { error: "Format backup tidak valid" }
  }
  try {
    const result = await restoreBackup(data)
    return { inserted: result.inserted }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Gagal memulihkan data" }
  }
}

function csvCell(value: unknown): string {
  const str = value == null ? "" : String(value)
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function buildLaporanCsv(
  rows: Array<{
    purchase_date: string
    purchase_id: string
    supplier_name: string
    items: Array<{ product_name: string; quantity: number; price_per_unit: number; subtotal: number }>
    notes: string | null
  }>,
): string {
  const header = [
    "Tanggal",
    "No Pembelian",
    "Supplier",
    "Barang",
    "Qty",
    "Harga/Dus",
    "Subtotal",
    "Catatan",
  ]
  const lines = [header.map(csvCell).join(",")]

  for (const p of rows) {
    for (const item of p.items) {
      lines.push(
        [
          p.purchase_date,
          p.purchase_id,
          p.supplier_name,
          item.product_name,
          String(item.quantity),
          String(item.price_per_unit),
          String(item.subtotal),
          p.notes ?? "",
        ]
          .map(csvCell)
          .join(","),
      )
    }
  }

  return "﻿" + lines.join("\r\n")
}

export interface ExportCsvResult {
  error?: string
  csv?: string
  filename?: string
}

export async function exportLaporanCsvAction(formData: FormData): Promise<ExportCsvResult> {
  const startDate = formData.get("startDate")?.toString().trim() || undefined
  const endDate = formData.get("endDate")?.toString().trim() || undefined
  const supplierId = formData.get("supplierId")?.toString().trim() || undefined

  try {
    const purchases = await getPurchases({ startDate, endDate, supplierId })
    const csv = buildLaporanCsv(purchases)
    const stamp = new Date().toISOString().slice(0, 10)
    return { csv, filename: `laporan-pembelian-${stamp}.csv` }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Gagal mengekspor laporan" }
  }
}
