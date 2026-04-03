import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactECharts from 'echarts-for-react'

const COLORS = [
    '#ef4444', '#3b82f6', '#22c55e', '#f59e0b',
    '#a855f7', '#06b6d4', '#f97316', '#ec4899',
    '#14b8a6', '#84cc16', '#e879f9', '#fb923c',
]

export default function LocalityTypologyChart({ data }) {
    const { localities, typologies, series } = useMemo(() => {
        const counts = {}
        const typologyCounts = {}
        const localityCounts = {}

        data.forEach(op => {
            if (!op.loc || !op.typology) return
            if (!counts[op.loc]) counts[op.loc] = {}
            counts[op.loc][op.typology] = (counts[op.loc][op.typology] || 0) + 1
            typologyCounts[op.typology] = (typologyCounts[op.typology] || 0) + 1
            localityCounts[op.loc] = (localityCounts[op.loc] || 0) + 1
        })

        const localities = Object.entries(localityCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 12)
            .map(([l]) => l)

        const typologies = Object.entries(typologyCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 12)
            .map(([t]) => t)

        const series = typologies.map((typology, i) => ({
            name: typology,
            type: 'bar',
            stack: 'total',
            data: localities.map(loc => counts[loc]?.[typology] || 0),
            itemStyle: { color: COLORS[i % COLORS.length] },
            emphasis: { focus: 'series' },
            label: i === typologies.length - 1 ? {
                show: true,
                position: 'right',
                color: '#aaa',
                fontSize: 11,
                formatter: params => {
                    const total = typologies.reduce(
                        (sum, t) => sum + (counts[localities[params.dataIndex]]?.[t] || 0), 0
                    )
                    return total > 0 ? String(total) : ''
                },
            } : { show: false },
        }))

        return { localities, typologies, series }
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
        grid: { left: 120, right: 50, top: 16, bottom: 80 },
        xAxis: {
            type: 'value',
            axisLabel: { color: '#888', fontSize: 11 },
            splitLine: { lineStyle: { color: '#222' } },
        },
        yAxis: {
            type: 'category',
            data: localities,
            inverse: true,
            axisLabel: {
                color: '#888',
                fontSize: 10,
                width: 110,
                overflow: 'truncate',
            },
            axisLine: { lineStyle: { color: '#333' } },
        },
        series,
    }

    return (
        <Card>
            <CardHeader className="pb-0 pt-3 px-3 shrink-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Operazioni per località e tipologia
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-2">
                <ReactECharts option={option} style={{ height: '400px' }} opts={{ renderer: 'svg' }} />
            </CardContent>
        </Card>
    )
}