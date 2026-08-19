import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PengaturanPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-sm text-muted-foreground">Pengaturan aplikasi (fase berikutnya).</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Aplikasi</CardTitle>
          <CardDescription>
            Backup, import/export data, dan preferensi aplikasi akan tersedia pada fase
            berikutnya.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="rounded-xl border border-dashed p-4">
            <span className="font-medium text-foreground">Roadmap:</span> Export laporan · Backup
            data · Import data · Notifikasi perubahan harga
          </div>
        </CardContent>
      </Card>
    </div>
  )
}