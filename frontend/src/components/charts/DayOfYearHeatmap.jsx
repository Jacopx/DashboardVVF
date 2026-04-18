import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactECharts from 'echarts-for-react'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Month start days (1-indexed day of year, non-leap)
const MONTH_STARTS = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335]
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

function dayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0)
    return Math.floor((date - start) / 86400000)
}

// Convert 1-indexed day-of-year → { month (0-indexed), dayInMonth (1-indexed) }
function dayToMonthDay(doy) {
    let remaining = doy
    for (let m = 0; m < 12; m++) {
        if (remaining <= MONTH_DAYS[m]) return { month: m, day: remaining }
        remaining -= MONTH_DAYS[m]
    }
    return { month: 11, day: 31 }
}

export default function DayOfYearHeatmap({ data }) {
    // Aggregate: sum operations across all years for each day-of-year (1..365)
    const { dayCounts, maxCount } = useMemo(() => {
        const dayCounts = Array(366).fill(0) // index 0 unused, 1..365
        data.forEach(op => {
            if (!op.date) return
            const d = new Date(op.date)
            // Normalize leap-day (Feb 29 → Feb 28) so everything fits 1–365
            let doy = dayOfYear(d)
            if (doy === 60 && new Date(d.getFullYear(), 1, 29).getDate() === 29) {
                doy = 59 // treat Feb 29 as Feb 28
            } else if (doy > 59 && new Date(d.getFullYear(), 1, 29).getDate() === 29) {
                doy -= 1 // shift leap-year days back by 1
            }
            if (doy >= 1 && doy <= 365) dayCounts[doy]++
        })
        const maxCount = Math.max(...dayCounts.slice(1, 366))
        return { dayCounts, maxCount }
    }, [data])

    // Build ECharts heatmap data: [month (0-indexed), dayInMonth-1 (0-indexed), count]
    const heatmapData = useMemo(() => {
        const out = []
        for (let doy = 1; doy <= 365; doy++) {
            const { month, day } = dayToMonthDay(doy)
            out.push([month, day - 1, dayCounts[doy]])
        }
        return out
    }, [dayCounts])

    const option = {
        tooltip: {
            formatter: params => {
                const [monthIdx, dayIdx, count] = params.data
                const month = MONTHS[monthIdx]
                const day = dayIdx + 1
                return `<b>${day} ${month}</b><br/>Operations: <b>${count}</b>`
            },
        },
        grid: {
            left: 44,
            right: 16,
            top: 16,
            bottom: 56,
        },
        xAxis: {
            type: 'category',
            data: MONTHS,
            splitArea: { show: false },
            axisLabel: { color: '#888', fontSize: 11 },
            axisLine: { lineStyle: { color: '#333' } },
            axisTick: { show: false },
        },
        yAxis: {
            type: 'category',
            data: Array.from({ length: 31 }, (_, i) => i + 1),
            inverse: true,
            splitArea: { show: false },
            axisLabel: {
                color: '#666',
                fontSize: 10,
                formatter: v => (v % 5 === 0 || v === 1) ? String(v) : '',
            },
            axisLine: { show: false },
            axisTick: { show: false },
        },
        visualMap: {
            min: 0,
            max: maxCount || 1,
            calculable: false,
            orient: 'horizontal',
            left: 'center',
            bottom: 0,
            itemWidth: 14,
            itemHeight: 120,
            inRange: {
                color: ['#1a1a1a', '#3a2020', '#7a2020', '#c03030', '#ef4444'],
            },
            textStyle: { color: '#666', fontSize: 10 },
            text: ['High', 'Low'],
        },
        series: [{
            type: 'heatmap',
            data: heatmapData,
            itemStyle: {
                borderColor: '#111',
                borderWidth: 1,
                borderRadius: 2,
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 6,
                    shadowColor: 'rgba(239,68,68,0.6)',
                },
            },
        }],
    }

    return (
        <Card>
            <CardHeader className="pb-0 pt-3 px-3 shrink-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Heatmap degli interventi
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-2">
                <ReactECharts
                    option={option}
                    style={{ height: '480px' }}
                    opts={{ renderer: 'svg' }}
                />
            </CardContent>
        </Card>
    )
}