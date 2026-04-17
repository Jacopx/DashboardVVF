import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactECharts from 'echarts-for-react'

export default function LocalityDistribution({ data }) {
    const chartData = useMemo(() => {
        const counts = {}
        data.forEach(op => {
            if (!op.loc) return
            counts[op.loc] = (counts[op.loc] || 0) + 1
        })
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .reverse()
    }, [data])

    const option = {
        tooltip: { trigger: 'axis' },
        grid: { left: 120, right: 16, top: 8, bottom: 24 },
        xAxis: {
            type: 'value',
            axisLabel: { color: '#888', fontSize: 11 },
            splitLine: { lineStyle: { color: '#222' } },
        },
        yAxis: {
            type: 'category',
            data: chartData.map(d => d[0]),
            axisLabel: {
                color: '#888',
                fontSize: 10,
                width: 110,
                overflow: 'truncate',
            },
            axisLine: { lineStyle: { color: '#333' } },
        },
        series: [{
            type: 'bar',
            data: chartData.map(d => d[1]),
            itemStyle: { color: '#ef4444', borderRadius: [0, 4, 4, 0] },
            label: {
                show: true,
                position: 'right',
                color: '#888',
                fontSize: 10,
            },
        }],
    }

    return (
        <Card className="h-full min-h-[250px] flex flex-col">
            <CardHeader className="pb-0 pt-3 px-3 shrink-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Top 8 località
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-2">
                <ReactECharts option={option} style={{ height: '100%' }} opts={{ renderer: 'svg' }} />
            </CardContent>
        </Card>
    )
}