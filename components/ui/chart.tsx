"use client"

import * as React from "react"
import { ResponsiveContainer, Tooltip, type TooltipProps } from "recharts"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"

import { cn } from "../../lib/utils"
import { Card } from "../../components/ui/card"

type ChartConfig = {
  [key: string]: {
    label: string
    color?: string
  }
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
}

function ChartContainer({ config, children, className, ...props }: ChartContainerProps) {
  const [tooltipData, setTooltipData] = React.useState<{
    [key: string]: string | number
  } | null>(null)

  const configWithColors = React.useMemo(() => {
    return Object.entries(config).reduce(
      (acc, [key, value]) => {
        acc[key] = value
        acc[`--color-${key}`] = value.color
        return acc
      },
      {} as Record<string, any>,
    )
  }, [config])

  return (
    <div className={cn("h-full w-full", className)} style={configWithColors} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        {React.cloneElement(children as React.ReactElement, {
          onMouseMove: (data: any) => {
            if (data && data.activePayload) {
              const payload = data.activePayload[0].payload
              setTooltipData(payload)
            }
          },
          onMouseLeave: () => {
            setTooltipData(null)
          },
        })}
      </ResponsiveContainer>
    </div>
  )
}

interface ChartTooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean
  payload?: any[]
  label?: string
  hideLabel?: boolean
}

function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel = false,
  className,
  ...props
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <Card className={cn("border-slate-200 bg-white text-slate-950", className)} {...props}>
      <div className="grid gap-2 p-2">
        {!hideLabel && label && <div className="text-xs text-slate-500">{label}</div>}
        <div className="grid gap-1">
          {payload.map((item: any, index: number) => {
            const color = item.color || item.stroke
            const label = item.name || item.dataKey

            return (
              <div key={index} className="flex items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-1">
                  {color && <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />}
                  <span className="text-slate-500">{label}</span>
                </div>
                <div className="font-medium">{item.value}</div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

// Fixed ChartTooltip component
function ChartTooltip<TValue extends ValueType, TName extends NameType>({
  children,
  ...props
}: TooltipProps<TValue, TName> & {
  children?: React.ReactNode
}) {
  return (
    <Tooltip
      {...props}
      content={({ active, payload, label }) => {
        if (React.isValidElement(children)) {
          return React.cloneElement(children, {
            // active,
            // payload,
            // label,
          })
        }
        return null
      }}
    />
  )
}

export { ChartContainer, ChartTooltip, ChartTooltipContent }

