import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Flame } from 'lucide-react'

export default function TotalOperations({ data }) {
    const total = useMemo(() => {
        if (!data.length) return 0
        return Math.max(...data.map(op => op.id)) + 1
    }, [data])

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Totale interventi
                </CardTitle>
                <Flame className="text-red-500" size={18} />
            </CardHeader>
            <CardContent>
                <p className="text-8xl font-bold">{total}</p>
                <p className="text-xs text-muted-foreground mt-1">anno corrente</p>
            </CardContent>
        </Card>
    )
}