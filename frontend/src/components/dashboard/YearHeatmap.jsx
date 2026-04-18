import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const CELL = 12
const GAP = 2
const OUTER_PAD = 16
const AXIS_WIDTH = 24
const AXIS_GAP = 6
const LABEL_ROW_HEIGHT = 16
const GRID_PAD = 6

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const COLORS = ['#1a1a1a', '#450a0a', '#7f1d1d', '#ef4444']

// Returns 0=Mon … 6=Sun for a LOCAL date
function dayRowIndex(d) {
    return d.getDay() === 0 ? 6 : d.getDay() - 1
}

// Format a local Date as YYYY-MM-DD without UTC shift
function localIsoDate(d) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
}

// Integer day-difference between two local dates (no DST drift)
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
    const { svgContent, width, height } = useMemo(() => {
        // Build counts map using LOCAL date strings to avoid UTC shift
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

        // Use integer day counts to avoid DST/rounding issues
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

        const rects = []

        // Month labels
        for (let m = 0; m < 12; m++) {
            const firstDay = new Date(yearInt, m, 1)
            const weekIndex = Math.floor(daysBetween(start, firstDay) / 7)
            const x = gridOriginX + weekIndex * (CELL + GAP)
            const y = OUTER_PAD + LABEL_ROW_HEIGHT - 2
            rects.push(
                <text key={`m${m}`} x={x} y={y} fontSize={9} fill="#888">
                    {MONTH_LABELS[m]}
                </text>
            )
        }

        // Day labels — show Tue(1), Thu(3), Sat(5), i.e. odd rows
        DAY_LABELS.forEach((label, row) => {
            if (row % 2 === 0) return  // skip Mon, Wed, Fri, Sun
            const x = OUTER_PAD + AXIS_WIDTH - 2
            const y = gridOriginY + row * (CELL + GAP) + CELL / 2
            rects.push(
                <text key={`d${row}`} x={x} y={y} fontSize={9} fill="#888"
                    textAnchor="end" dominantBaseline="middle">
                    {label}
                </text>
            )
        })

        // Cells — iterate by integer days to avoid DST drift
        for (let i = 0; i < totalDays; i++) {
            const current = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
            const weekIndex = Math.floor(i / 7)
            const row = dayRowIndex(current)
            const x = gridOriginX + weekIndex * (CELL + GAP)
            const y = gridOriginY + row * (CELL + GAP)
            const dateStr = localIsoDate(current)
            const inYear = current.getFullYear() === yearInt
            const count = inYear ? (counts[dateStr] || 0) : 0
            const fill = inYear ? color(count) : 'transparent'

            if (inYear) {
                rects.push(
                    <rect key={dateStr} x={x} y={y}
                        width={CELL} height={CELL}
                        rx={3} ry={3} fill={fill}
                        onMouseEnter={e => setTooltip({ dateStr, count, ex: e.clientX, ey: e.clientY })}
                        onMouseLeave={() => setTooltip(null)}
                    />
                )
            }
        }

        return { svgContent: rects, width: svgW, height: svgH }
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
                        {svgContent}
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