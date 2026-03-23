import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock } from 'lucide-react'

export default function AverageDuration({ data }) {
    const average = useMemo(() => {
        const valid = data.filter(op => op.dt_exit && op.dt_close)

        const totalMinutes = valid.reduce((sum, op) => {
            const diff = new Date(op.dt_close) - new Date(op.dt_exit)
            return sum + diff / 60000
        }, 0)

        const avg = totalMinutes / valid.length
        const hours = Math.floor(avg / 60)
        const minutes = Math.round(avg % 60)
        return { hours, minutes, count: valid.length }
    }, [data])

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Durata media
                </CardTitle>
                <Clock className="text-muted-foreground" size={18} />
            </CardHeader>
            <CardContent>
                {average ? (
                    <>
                        <p className="text-8xl font-bold">
                            {average.hours}h {average.minutes}m
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            su {average.count} interventi
                        </p>
                    </>
                ) : (
                    <p className="text-muted-foreground">No data</p>
                )}
            </CardContent>
        </Card>
    )
}