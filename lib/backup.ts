import type { BackupData } from "@/lib/types"

const BACKUP_TABLES = [
  "suppliers",
  "products",
  "purchases",
  "purchase_items",
  "price_history",
] as const

export function isValidBackup(data: unknown): data is BackupData {
  if (!data || typeof data !== "object") return false
  const obj = data as Record<string, unknown>
  return BACKUP_TABLES.every((t) => Array.isArray(obj[t]))
}
