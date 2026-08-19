"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function getGreeting(hour: number): string {
  if (hour >= 0 && hour < 11) return "Selamat pagi"
  if (hour >= 11 && hour < 15) return "Selamat siang"
  if (hour >= 15 && hour < 18) return "Selamat sore"
  return "Selamat malam"
}

export function WelcomeHeader() {
  const [now, setNow] = React.useState<Date | null>(null)

  React.useEffect(() => {
    const tick = () => setNow(new Date())
    void Promise.resolve().then(tick)
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const hour = now ? now.getHours() : 0
  const greeting = getGreeting(hour)

  const time = now
    ? new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
        .format(now)
        .replace(/:/g, ".")
    : "--.--.--"

  const date = now
    ? new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(now)
    : "—"

  return (
    <Card size="sm">
      <CardContent className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <CardTitle>{greeting}, selamat datang!</CardTitle>
          <CardDescription>
            Berikut ringkasan toko Owner Dua Putri hari ini.
          </CardDescription>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-xl font-bold tabular-nums tracking-tight">
            {time}
          </span>
          <Badge variant="secondary">{date}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
