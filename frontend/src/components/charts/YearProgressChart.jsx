import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactECharts from 'echarts-for-react'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const COLORS = [
  '#ef4444', '#3b82f6', '#22c55e', '#f59e0b',
  '#a855f7', '#06b6d4', '#f97316', '#ec4899',
  '#14b8a6', '#84cc16', '#e879f9', '#fb923c',
  '#38bdf8', '#4ade80', '#facc15', '#c084fc',
]

function dayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0)
    const diff = date - start
    return Math.floor(diff / 86400000)
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export default function YearProgressChart({ data }) {
    const { years, series } = useMemo(() => {
        // Group operations by year and day of year
        const counts = {}
        data.forEach(op => {
            if (!op.date) return
            const d = new Date(op.date)
            const year = d.getFullYear()
            const day = dayOfYear(d)
            if (!counts[year]) counts[year] = {}
            counts[year][day] = (counts[year][day] || 0) + 1
        })

        const years = Object.keys(counts).map(Number).sort()

        const series = years.map((year, i) => {
            const days = isLeapYear(year) ? 366 : 365
            let cumulative = 0
            const data = []

            for (let d = 1; d <= days; d++) {
                cumulative += counts[year][d] || 0
                data.push([d, cumulative])
            }

            return {
                name: String(year),
                type: 'line',
                data,
                smooth: false,
                symbol: 'none',
                lineStyle: { color: COLORS[i % COLORS.length], width: 2 },
                itemStyle: { color: COLORS[i % COLORS.length] },
            }
        })

        return { years, series }
    }, [data])

    // Build x axis month label positions
    const xAxisLabels = useMemo(() => {
        const labels = []
        const monthStarts = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335]
        monthStarts.forEach((day, i) => {
            labels.push({ value: day, label: MONTHS[i] })
        })
        return labels
    }, [])

    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: params => {
                const day = params[0].data[0]
                const date = new Date(2024, 0, day)
                const label = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                const lines = params.map(p =>
                    `<span style="color:${p.color}">●</span> ${p.seriesName}: <b>${p.data[1]}</b>`
                )
                return `Day ${day} (${label})<br/>${lines.join('<br/>')}`
            },
        },
        legend: {
            data: years.map(String),
            bottom: 0,
            textStyle: { color: '#888', fontSize: 11 },
        },
        grid: { left: 40, right: 16, top: 16, bottom: 40 },
        xAxis: {
            type: 'value',
            min: 1,
            max: 365,
            axisLabel: {
                color: '#888',
                fontSize: 11,
                formatter: value => {
                    const found = xAxisLabels.find(l => l.value === value)
                    return found ? found.label : ''
                },
            },
            axisTick: {
                show: true,
            },
            splitLine: { show: false },
            axisLine: { lineStyle: { color: '#333' } },
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: '#888', fontSize: 11 },
            splitLine: { lineStyle: { color: '#222' } },
        },
        series,
    }

    return (
        <Card>
            <CardHeader className="pb-0 pt-3 px-3 shrink-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Operazioni cumulative per giorno
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-2">
                <ReactECharts option={option} style={{ height: '570px' }} opts={{ renderer: 'svg' }} />
            </CardContent>
        </Card>
    )
}