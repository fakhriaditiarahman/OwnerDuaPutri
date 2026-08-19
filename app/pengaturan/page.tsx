import { getSuppliers } from "@/data/service"
import { PreferencesCard } from "@/components/settings/preferences-card"
import { BackupCard } from "@/components/settings/backup-card"
import { RestoreCard } from "@/components/settings/restore-card"
import { ExportReportCard } from "@/components/settings/export-report-card"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function PengaturanPage() {
  const suppliers = await getSuppliers()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-sm text-muted-foreground">
          Preferensi, backup, import, dan export data aplikasi.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PreferencesCard />
        <ExportReportCard suppliers={suppliers} />
        <BackupCard />
        <RestoreCard />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roadmap Mendatang</CardTitle>
          <CardDescription>
            Fitur berikut sedang direncanakan untuk fase berikutnya.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Segera hadir:</span>{" "}
            Notifikasi perubahan harga · Import barang dari Excel · Backup otomatis
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
