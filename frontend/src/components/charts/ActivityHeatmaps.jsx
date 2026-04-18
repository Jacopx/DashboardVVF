import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactECharts from 'echarts-for-react'

const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
const HOUR_LABELS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)
const MONTH_LABELS = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu',
    'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic']

// Single colour ramp: transparent → brand red
function makeVisualMap(max) {
    return {
        min: 0,
        max,
        show: false,
        inRange: {
            color: ['#1a1a1a', '#450a0a', '#7f1d1d', '#ef4444'],
        },
    }
}

function HeatmapCard({ title, xLabels, years, matrix }) {
    // matrix[yi][xi] = count
    const flat = matrix.flat()
    const maxVal = Math.max(...flat, 1)

    // ECharts heatmap: data = [xIndex, yIndex, value]
    const seriesData = []
    years.forEach((_, yi) => {
        xLabels.forEach((_, xi) => {
            seriesData.push([xi, yi, matrix[yi][xi] || 0])
        })
    })

    const cellSize = 14
    const labelFontSize = 10

    const option = {
        tooltip: {
            formatter: p => {
                const [xi, yi, v] = p.data
                return `${years[yi]} — ${xLabels[xi]}: <b>${v}</b>`
            },
        },
        grid: {
            left: 48,
            right: 16,
            top: 8,
            bottom: xLabels.length > 12 ? 60 : 40,
        },
        xAxis: {
            type: 'category',
            data: xLabels,
            splitArea: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
                color: '#888',
                fontSize: labelFontSize,
                rotate: xLabels.length > 12 ? 45 : 0,
                interval: xLabels.length > 12 ? 1 : 0,
            },
        },
        yAxis: {
            type: 'category',
            data: years.map(String),
            splitArea: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: '#888', fontSize: labelFontSize },
        },
        visualMap: makeVisualMap(maxVal),
        series: [{
            type: 'heatmap',
            data: seriesData,
            itemStyle: { borderRadius: 3, borderWidth: 2, borderColor: 'transparent' },
            emphasis: { itemStyle: { borderColor: '#fff', borderWidth: 1 } },
        }],
    }

    // Dynamic height: enough rows for years + axis labels
    const chartHeight = Math.max(years.length * (cellSize + 6) + 60, 100)

    return (
        <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground mb-2 px-1">{title}</p>
            <ReactECharts
                option={option}
                style={{ height: `${chartHeight}px` }}
                opts={{ renderer: 'svg' }}
            />
        </div>
    )
}

export default function ActivityHeatmaps({ data }) {
    const { years, byDow, byHour, byMonth } = useMemo(() => {
        const dowCounts = {}   // { year: [7]  }
        const hourCounts = {}   // { year: [24] }
        const monthCounts = {}   // { year: [12] }

        data.forEach(op => {
            // date for dow and month
            if (!op.date) return
            const d = new Date(op.date)
            const year = d.getFullYear()
            const dow = d.getDay() === 0 ? 6 : d.getDay() - 1
            const month = d.getMonth()

            if (!dowCounts[year]) dowCounts[year] = Array(7).fill(0)
            if (!monthCounts[year]) monthCounts[year] = Array(12).fill(0)

            dowCounts[year][dow]++
            monthCounts[year][month]++

            // hour uses dt_exit instead
            if (!op.dt_exit) return
            const h = new Date(op.dt_exit)
            const hour = h.getHours()

            if (!hourCounts[year]) hourCounts[year] = Array(24).fill(0)
            hourCounts[year][hour]++
        })

        const years = Object.keys(dowCounts).map(Number).sort()

        return {
            years,
            byDow: years.map(y => dowCounts[y]),
            byHour: years.map(y => hourCounts[y]),
            byMonth: years.map(y => monthCounts[y]),
        }
    }, [data])

    return (
        <Card>
            <CardHeader className="pb-0 pt-3 px-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Attività per giorno, ora e mese
                </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
                <div className="flex gap-6">
                    <HeatmapCard
                        title="Giorno della settimana"
                        xLabels={DAY_LABELS}
                        years={years}
                        matrix={byDow}
                    />
                    <HeatmapCard
                        title="Ora del giorno"
                        xLabels={HOUR_LABELS}
                        years={years}
                        matrix={byHour}
                    />
                    <HeatmapCard
                        title="Mese"
                        xLabels={MONTH_LABELS}
                        years={years}
                        matrix={byMonth}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
