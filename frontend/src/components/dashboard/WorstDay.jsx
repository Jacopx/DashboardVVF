import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

export default function WorstDay({ data }) {
    const worst = useMemo(() => {
        const counts = {}
        data.forEach(op => {
            if (!op.date) return
            const day = op.date.slice(0, 10)
            counts[day] = (counts[day] || 0) + 1
        })

        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
        if (!sorted.length) return null

        const [date, count] = sorted[0]
        const d = new Date(date)
        return {
            date,
            count,
            label: d.toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
            }),
        }
    }, [data])

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Giorno peggiore
                </CardTitle>
                <AlertTriangle className="text-red-500" size={18} />
            </CardHeader>
            <CardContent>
                {worst ? (
                    <>
                        <p className="text-8xl font-bold">{worst.count}</p>
                        <p className="text-sm text-muted-foreground mt-1">{worst.label}</p>
                    </>
                ) : (
                    <p className="text-muted-foreground">No data</p>
                )}
            </CardContent>
        </Card>
    )
}