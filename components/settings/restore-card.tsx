"use client"

import * as React from "react"
import { toast } from "sonner"
import { Upload, Loader2, FileWarning } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { isValidBackup } from "@/lib/backup"
import { restoreBackupAction } from "@/app/settings-actions"
import type { BackupData } from "@/lib/types"

export function RestoreCard() {
  const [preview, setPreview] = React.useState<BackupData | null>(null)
  const [fileName, setFileName] = React.useState<string>("")
  const [parseError, setParseError] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState(false)
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    setParseError(null)
    setPreview(null)
    setFileName("")
    if (!file) return

    setFileName(file.name)
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      if (!isValidBackup(data)) {
        setParseError("File bukan backup yang valid (struktur tabel tidak lengkap).")
        return
      }
      setPreview(data)
    } catch {
      setParseError("Gagal membaca file. Pastikan berupa file JSON backup.")
    }
  }

  async function handleRestore() {
    if (!preview) return
    setPending(true)
    try {
      const result = await restoreBackupAction(preview)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success(`Berhasil memulihkan ${result.inserted} baris data.`)
      setPreview(null)
      setFileName("")
      if (inputRef.current) inputRef.current.value = ""
      setConfirmOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memulihkan data")
    } finally {
      setPending(false)
    }
  }

  const counts = preview
    ? [
        { label: "Supplier", value: preview.suppliers.length },
        { label: "Barang", value: preview.products.length },
        { label: "Pembelian", value: preview.purchases.length },
        { label: "Item", value: preview.purchase_items.length },
        { label: "Histori Harga", value: preview.price_history.length },
      ]
    : []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import / Restore Data</CardTitle>
        <CardDescription>
          Pilih file backup JSON untuk digabungkan ke data saat ini. Data yang
          sama (ID sama) diperbarui, sisanya ditambahkan.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleFile}
        />

        {parseError && (
          <Alert variant="destructive">
            <FileWarning data-icon="inline-start" />
            <AlertTitle>File tidak valid</AlertTitle>
            <AlertDescription>{parseError}</AlertDescription>
          </Alert>
        )}

        {preview && (
          <div className="rounded-xl border p-3 text-sm">
            <p className="mb-2 font-medium">{fileName}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
              {counts.map((c) => (
                <span key={c.label}>
                  {c.label}: <span className="text-foreground">{c.value}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <Button
            variant="outline"
            onClick={() => preview && setConfirmOpen(true)}
            disabled={!preview || pending}
            className="w-fit"
          >
            {pending ? (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            ) : (
              <Upload data-icon="inline-start" />
            )}
            {pending ? "Memulihkan..." : "Pulihkan Data"}
          </Button>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Restore</AlertDialogTitle>
              <AlertDialogDescription>
                Data dari backup akan digabungkan dengan data saat ini. Proses ini
                tidak menghapus data yang sudah ada, namun akan menimpa baris
                dengan ID yang sama. Lanjutkan?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={pending}>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleRestore} disabled={pending}>
                {pending && <Loader2 data-icon="inline-start" className="animate-spin" />}
                Ya, Pulihkan
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
