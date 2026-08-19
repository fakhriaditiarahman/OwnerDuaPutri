"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { formatRupiah } from "@/lib/format"
import type { DashboardStats } from "@/data/service"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const rupiahFormatter = (value: number | string) =>
  formatRupiah(typeof value === "number" ? value : Number(value))

export function DashboardCharts({ stats }: { stats: DashboardStats }) {
  const { monthly, bySupplier, topProducts, totalSpendThisMonth } = stats

  const supplierConfig = React.useMemo(
    () =>
      Object.fromEntries(
        bySupplier.map((s) => [s.key, { label: s.supplier, color: s.fill }]),
      ),
    [bySupplier],
  )

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Tren Pengeluaran</CardTitle>
          <CardDescription>
            Total pembelian 6 bulan terakhir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{ total: { label: "Pengeluaran", color: "var(--chart-1)" } }}
          >
            <RechartsPrimitive.AreaChart
              data={monthly}
              margin={{ left: 12, right: 12, top: 8 }}
            >
              <RechartsPrimitive.CartesianGrid vertical={false} />
              <RechartsPrimitive.XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => rupiahFormatter(value as number)}
                  />
                }
              />
              <RechartsPrimitive.Area
                dataKey="total"
                type="natural"
                fill="var(--color-total)"
                fillOpacity={0.4}
                stroke="var(--color-total)"
              />
            </RechartsPrimitive.AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pengeluaran per Supplier</CardTitle>
          <CardDescription>Bulan ini</CardDescription>
        </CardHeader>
        <CardContent>
          {bySupplier.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
              Belum ada data.
            </div>
          ) : (
            <ChartContainer
              config={supplierConfig}
              className="mx-auto aspect-square max-h-[260px]"
            >
              <RechartsPrimitive.PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      nameKey="key"
                      formatter={(value) => rupiahFormatter(value as number)}
                    />
                  }
                />
                <RechartsPrimitive.Pie
                  data={bySupplier}
                  dataKey="total"
                  nameKey="key"
                  innerRadius={50}
                  strokeWidth={2}
                >
                  {bySupplier.map((s) => (
                    <RechartsPrimitive.Cell
                      key={s.key}
                      fill={`var(--color-${s.key})`}
                    />
                  ))}
                </RechartsPrimitive.Pie>
                <ChartLegend
                  content={<ChartLegendContent nameKey="key" />}
                  className="flex-wrap"
                />
              </RechartsPrimitive.PieChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Ringkasan Bulan Ini</CardTitle>
          <CardDescription>
            Total pengeluaran {formatRupiah(totalSpendThisMonth)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topProducts.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
              Belum ada pembelian.
            </div>
          ) : (
            <ChartContainer
              config={{ quantity: { label: "Qty", color: "var(--chart-3)" } }}
            >
              <RechartsPrimitive.BarChart
                data={topProducts}
                layout="vertical"
                margin={{ left: 8, right: 16 }}
              >
                <RechartsPrimitive.CartesianGrid horizontal={false} />
                <RechartsPrimitive.XAxis type="number" hide />
                <RechartsPrimitive.YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  width={140}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <RechartsPrimitive.Bar
                  dataKey="quantity"
                  fill="var(--color-quantity)"
                  radius={4}
                />
              </RechartsPrimitive.BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
