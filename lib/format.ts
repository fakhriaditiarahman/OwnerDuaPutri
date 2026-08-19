export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatRupiahCompact(value: number): string {
  return formatRupiah(value).replace(/,\d+/, "")
}

export function formatDate(date: string | null): string {
  if (!date) return "-"
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

export function formatDateTime(date: string | null): string {
  if (!date) return "-"
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value)
}

export function toIDR(input: string): number {
  const digits = input.replace(/[^\d]/g, "")
  return digits ? parseInt(digits, 10) : 0
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}