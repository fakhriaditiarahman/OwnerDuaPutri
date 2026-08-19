"use client"

import * as React from "react"
import { toast } from "sonner"
import { Download, Loader2 } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { downloadBlob } from "@/lib/download"
import { exportBackupAction } from "@/app/settings-actions"
import type { BackupData } from "@/lib/types"

const STORAGE_KEY = "odp:lastBackupAt"

export function BackupCard() {
  const [pending, setPending] = React.useState(false)
  const [lastBackup, setLastBackup] = React.useState<string | null>(null)

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLastBackup(localStorage.getItem(STORAGE_KEY))
  }, [])

  async function handleBackup() {
    setPending(true)
    try {
      const data: BackupData = await exportBackupAction()
      const stamp = new Date().toISOString().slice(0, 10)
      downloadBlob(
        JSON.stringify(data, null, 2),
        `backup-owner-dua-putri-${stamp}.json`,
        "application/json",
      )
      const now = new Date().toISOString()
      localStorage.setItem(STORAGE_KEY, now)
      setLastBackup(now)
      toast.success("Backup berhasil diunduh")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal membuat backup")
    } finally {
      setPending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup Data</CardTitle>
        <CardDescription>
          Unduh salinan seluruh data (barang, supplier, pembelian, histori harga)
          ke file JSON.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Button onClick={handleBackup} disabled={pending}>
          {pending ? (
            <Loader2 data-icon="inline-start" className="animate-spin" />
          ) : (
            <Download data-icon="inline-start" />
          )}
          {pending ? "Menyiapkan..." : "Unduh Backup"}
        </Button>
        {lastBackup && (
          <p className="text-xs text-muted-foreground">
            Backup terakhir: {new Date(lastBackup).toLocaleString("id-ID")}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
