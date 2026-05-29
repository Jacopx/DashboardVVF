// LocalityYearTable.jsx
import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LocalityYearTable({ data }) {
    const { localities, years, matrix, rowMax } = useMemo(() => {
        const counts = {}
        const localityCounts = {}

        data.forEach(op => {
            if (!op.loc || !op.date) return
            const year = new Date(op.date).getFullYear()
            if (!counts[op.loc]) counts[op.loc] = {}
            counts[op.loc][year] = (counts[op.loc][year] || 0) + 1
            localityCounts[op.loc] = (localityCounts[op.loc] || 0) + 1
        })

        const localities = Object.entries(localityCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 25)
            .map(([l]) => l)

        const years = [...new Set(data.map(op => op.date && new Date(op.date).getFullYear()).filter(Boolean))].sort()

        const matrix = localities.map(loc =>
            years.map(y => counts[loc]?.[y] || 0)
        )

        // Per-row max for relative heatmap coloring
        const rowMax = matrix.map(row => Math.max(...row))

        return { localities, years, matrix, rowMax }
    }, [data])

    return (
        <Card>
            <CardHeader className="pb-0 pt-3 px-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Operazioni per località e anno
                </CardTitle>
            </CardHeader>
            <CardContent className="p-3 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Locality</th>
                            {years.map(y => (
                                <th key={y} className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">{y}</th>
                            ))}
                            <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {localities.map((loc, i) => {
                            const row = matrix[i]
                            const max = rowMax[i]
                            const total = row.reduce((a, b) => a + b, 0)
                            return (
                                <tr key={loc} className="border-b border-border hover:bg-muted/30">
                                    <td className="px-3 py-2 font-medium whitespace-nowrap">{loc}</td>
                                    {row.map((count, j) => {
                                        const intensity = max > 0 ? count / max : 0
                                        return (
                                            <td
                                                key={j}
                                                className="px-3 py-2 text-right tabular-nums"
                                                style={{ backgroundColor: `rgba(239, 68, 68, ${count > 0 ? 0.15 + intensity * 0.55 : 0})` }}
                                            >
                                                {count > 0 ? count : <span className="text-muted-foreground">—</span>}
                                            </td>
                                        )
                                    })}
                                    <td className="px-3 py-2 text-right tabular-nums font-bold">{total}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    )
}