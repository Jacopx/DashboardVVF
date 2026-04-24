import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactECharts from 'echarts-for-react'

const DAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
const HOURS = Array.from({ length: 24 }, (_, i) => `${i}:00`)

export default function WeekdayHeatmap({ data }) {
    const seriesData = useMemo(() => {
        const counts = {}
        data.forEach(op => {
            if (!op.dt_exit || !op.dt_close) return
            const start = new Date(op.dt_exit)
            const end = new Date(op.dt_close)

            const current = new Date(start)
            while (current <= end) {
                const day = (current.getDay() + 6) % 7
                const hour = current.getHours()
                const key = `${day}-${hour}`
                counts[key] = (counts[key] || 0) + 1
                current.setHours(current.getHours() + 1)
            }
        })
        return Object.entries(counts).map(([key, count]) => {
            const [day, hour] = key.split('-').map(Number)
            return [hour, day, count]
        })
    }, [data])

    const max = Math.max(...seriesData.map(d => d[2]), 1)

    const option = {
        tooltip: {
            formatter: p => `${DAYS[p.value[1]]} ${p.value[0]}:00 — ${p.value[2]} operations`,
        },
        grid: { left: 40, right: 16, top: 8, bottom: 24 },
        xAxis: {
            type: 'category',
            data: HOURS,
            axisLabel: {
                color: '#888',
                fontSize: 9,
                interval: 1,
            },
            splitArea: { show: true },
        },
        yAxis: {
            type: 'category',
            data: DAYS,
            axisLabel: { color: '#888', fontSize: 11 },
            splitArea: { show: true },
        },
        visualMap: {
            min: 0,
            max,
            show: false,
            inRange: { color: ['#450a0a', '#7f1d1d', '#ef4444'] },
        },
        series: [{
            type: 'heatmap',
            data: seriesData,
            itemStyle: { borderRadius: 3 },
            emphasis: {
                itemStyle: { shadowBlur: 10, shadowColor: 'rgba(239,68,68,0.5)' },
            },
        }],
    }

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Attività per giorno e ora
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ReactECharts option={option} style={{ height: '220px' }} />
            </CardContent>
        </Card>
    )
}