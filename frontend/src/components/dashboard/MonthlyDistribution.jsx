import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactECharts from 'echarts-for-react'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function MonthlyDistribution({ data }) {
    const counts = useMemo(() => {
        const result = Array(12).fill(0)
        data.forEach(op => {
            if (!op.date) return
            const month = new Date(op.date).getMonth()
            result[month]++
        })
        return result
    }, [data])

    const option = {
        tooltip: { trigger: 'axis' },
        grid: { left: 40, right: 16, top: 16, bottom: 24 },
        xAxis: {
            type: 'category',
            data: MONTHS,
            axisLabel: { color: '#888', fontSize: 11 },
            axisLine: { lineStyle: { color: '#333' } },
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: '#888', fontSize: 11 },
            splitLine: { lineStyle: { color: '#222' } },
        },
        series: [{
            type: 'bar',
            data: counts,
            itemStyle: { color: '#ef4444', borderRadius: [4, 4, 0, 0] },
        }],
    }

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Interventi per mese
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ReactECharts option={option} style={{ height: '180px' }} />
            </CardContent>
        </Card>
    )
}