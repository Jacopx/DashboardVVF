import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactECharts from 'echarts-for-react'

const COLORS = [
    '#ef4444', '#3b82f6', '#22c55e', '#f59e0b',
    '#a855f7', '#06b6d4', '#f97316', '#ec4899',
    '#14b8a6', '#84cc16', '#e879f9', '#fb923c',
    '#f43f5e', '#8b5cf6', '#0ea5e9', '#10b981',
]

export default function StackedTypologyChart({ data }) {
    const { years, typologies, series } = useMemo(() => {
        const counts = {}
        const typologyCounts = {}

        data.forEach(op => {
            if (!op.date || !op.typology) return
            const year = new Date(op.date).getFullYear()
            if (!counts[year]) counts[year] = {}
            counts[year][op.typology] = (counts[year][op.typology] || 0) + 1
            typologyCounts[op.typology] = (typologyCounts[op.typology] || 0) + 1
        })

        const years = Object.keys(counts).map(Number).sort()

        // Sorted descending: biggest first = bottom of stack
        const typologies = Object.entries(typologyCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([t]) => t)

        // True year totals
        const yearTotals = {}
        years.forEach(y => {
            yearTotals[y] = Object.values(counts[y] || {}).reduce((sum, v) => sum + v, 0)
        })

        const series = typologies.map((typology, i) => {
            const isLast = i === typologies.length - 1
            return {
                name: typology,
                type: 'bar',
                stack: 'total',
                data: years.map(y => counts[y]?.[typology] || 0),
                itemStyle: { color: COLORS[i % COLORS.length] },
                emphasis: { focus: 'series' },
                label: isLast ? {
                    show: true,
                    position: 'top',
                    color: '#aaa',
                    fontSize: 11,
                    formatter: params => {
                        const total = yearTotals[years[params.dataIndex]] || 0
                        return total > 0 ? String(total) : ''
                    },
                } : { show: false },
            }
        })

        return { years, typologies, series }
    }, [data])

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
        },
        legend: {
            data: typologies,
            bottom: 0,
            textStyle: { color: '#888', fontSize: 10 },
            type: 'scroll',
        },
        grid: { left: 40, right: 16, top: 40, bottom: 80 },
        xAxis: {
            type: 'category',
            data: years.map(String),
            axisLabel: { color: '#888', fontSize: 11 },
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
                    Operazioni per tipologia e anno
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-2">
                <ReactECharts option={option} style={{ height: '400px' }} opts={{ renderer: 'svg' }} />
            </CardContent>
        </Card>
    )
}