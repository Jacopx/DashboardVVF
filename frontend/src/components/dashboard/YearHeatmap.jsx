import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const CELL = 12
const GAP = 2
const OUTER_PAD = 16
const AXIS_WIDTH = 24
const AXIS_GAP = 6
const LABEL_ROW_HEIGHT = 16
const GRID_PAD = 6

const MONTH_LABELS = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu',
    'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic']
const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
const COLORS = ['#1a1a1a', '#450a0a', '#7f1d1d', '#ef4444']

function dayRowIndex(d) {
    return d.getDay() === 0 ? 6 : d.getDay() - 1
}

function localIsoDate(d) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
}

function daysBetween(a, b) {
    const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
    const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
    return Math.round((utcB - utcA) / 86400000)
}

function weekStartOnOrBefore(d) {
    const result = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    result.setDate(result.getDate() - dayRowIndex(result))
    return result
}

function weekEndOnOrAfter(d) {
    const result = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    result.setDate(result.getDate() + (6 - dayRowIndex(result)))
    return result
}

export default function YearHeatmap({ data, year }) {
    const [tooltip, setTooltip] = useState(null)

    const { monthLabels, dayLabels, cells, width, height } = useMemo(() => {
        const counts = {}
        data.forEach(op => {
            if (!op.dt_exit) return
            const d = new Date(op.dt_exit)
            const day = localIsoDate(d)
            counts[day] = (counts[day] || 0) + 1
        })

        const max = Math.max(...Object.values(counts), 1)

        function color(count) {
            if (count === 0) return COLORS[0]
            const ratio = count / max
            if (ratio < 0.33) return COLORS[1]
            if (ratio < 0.66) return COLORS[2]
            return COLORS[3]
        }

        const yearInt = parseInt(year)
        const jan1 = new Date(yearInt, 0, 1)
        const dec31 = new Date(yearInt, 11, 31)
        const start = weekStartOnOrBefore(jan1)
        const end = weekEndOnOrAfter(dec31)

        const totalDays = daysBetween(start, end) + 1
        const weeks = Math.ceil(totalDays / 7)

        const gridInnerW = weeks * CELL + (weeks - 1) * GAP
        const gridInnerH = 7 * CELL + 6 * GAP
        const gridW = GRID_PAD + gridInnerW + GRID_PAD
        const gridH = GRID_PAD + gridInnerH + GRID_PAD

        const svgW = OUTER_PAD * 2 + AXIS_WIDTH + AXIS_GAP + gridW
        const svgH = OUTER_PAD * 2 + LABEL_ROW_HEIGHT + gridH

        const gridOriginX = OUTER_PAD + AXIS_WIDTH + AXIS_GAP + GRID_PAD
        const gridOriginY = OUTER_PAD + LABEL_ROW_HEIGHT + GRID_PAD

        // Month label data
        const monthLabels = Array.from({ length: 12 }, (_, m) => {
            const firstDay = new Date(yearInt, m, 1)
            const weekIndex = Math.floor(daysBetween(start, firstDay) / 7)
            return {
                key: `m${m}`,
                label: MONTH_LABELS[m],
                x: gridOriginX + weekIndex * (CELL + GAP),
                y: OUTER_PAD + LABEL_ROW_HEIGHT - 2,
            }
        })

        // Day label data — odd rows only
        const dayLabels = DAY_LABELS
            .map((label, row) => ({
                key: `d${row}`,
                label,
                row,
                x: OUTER_PAD + AXIS_WIDTH - 2,
                y: gridOriginY + row * (CELL + GAP) + CELL / 2,
            }))
            .filter(({ row }) => row % 2 !== 0)

        // Cell data
        const cells = []
        for (let i = 0; i < totalDays; i++) {
            const current = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
            const inYear = current.getFullYear() === yearInt
            if (!inYear) continue

            const weekIndex = Math.floor(i / 7)
            const row = dayRowIndex(current)
            const dateStr = localIsoDate(current)
            const count = counts[dateStr] || 0

            cells.push({
                dateStr,
                x: gridOriginX + weekIndex * (CELL + GAP),
                y: gridOriginY + row * (CELL + GAP),
                fill: color(count),
                count,
            })
        }

        return { monthLabels, dayLabels, cells, width: svgW, height: svgH }
    }, [data, year])

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Heatmap interventi {year}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    <svg width="100%" viewBox={`0 0 ${width} ${height}`}>
                        {monthLabels.map(({ key, label, x, y }) => (
                            <text key={key} x={x} y={y} fontSize={9} fill="#888">
                                {label}
                            </text>
                        ))}
                        {dayLabels.map(({ key, label, x, y }) => (
                            <text key={key} x={x} y={y} fontSize={9} fill="#888"
                                textAnchor="end" dominantBaseline="middle">
                                {label}
                            </text>
                        ))}
                        {cells.map(({ dateStr, x, y, fill, count }) => (
                            <rect key={dateStr} x={x} y={y}
                                width={CELL} height={CELL}
                                rx={3} ry={3} fill={fill}
                                onMouseEnter={e => setTooltip({ dateStr, count, ex: e.clientX, ey: e.clientY })}
                                onMouseLeave={() => setTooltip(null)}
                            />
                        ))}
                    </svg>
                    {tooltip && (
                        <div
                            className="fixed z-50 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow pointer-events-none"
                            style={{ left: tooltip.ex + 10, top: tooltip.ey + 10 }}
                        >
                            {tooltip.count > 0
                                ? `${tooltip.dateStr}: ${tooltip.count} interventi`
                                : tooltip.dateStr}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}