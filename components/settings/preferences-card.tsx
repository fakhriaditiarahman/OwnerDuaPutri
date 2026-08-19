"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Monitor, Moon, Sun } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function PreferencesCard() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setMounted(true), [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferensi Aplikasi</CardTitle>
        <CardDescription>Tampilan antarmuka aplikasi.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Tema</span>
          <Select
            value={mounted ? (theme ?? "system") : "system"}
            onValueChange={(v) => setTheme(v ?? "system")}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">
                <Sun data-icon="inline-start" /> Terang
              </SelectItem>
              <SelectItem value="dark">
                <Moon data-icon="inline-start" /> Gelap
              </SelectItem>
              <SelectItem value="system">
                <Monitor data-icon="inline-start" /> Sistem
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Bisa juga tekan <kbd className="rounded border px-1">D</kbd> untuk
            cepat ganti tema.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
