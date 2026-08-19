import { getPurchases } from "@/data/service"
import { ReportView } from "@/components/report-view"

export default async function LaporanPage() {
  const purchases = await getPurchases()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Laporan Pembelian</h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan pembelian barang berdasarkan periode.
        </p>
      </div>

      <ReportView purchases={purchases} />
    </div>
  )
}