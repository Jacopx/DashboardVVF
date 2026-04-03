import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function YearMonthTable({ data }) {
    const { years, matrix, monthTotals, grandTotal, worstYear, worstMonth } = useMemo(() => {
        const counts = {}
        data.forEach(op => {
            if (!op.date) return
            const d = new Date(op.date)
            const year = d.getFullYear()
            const month = d.getMonth()
            if (!counts[year]) counts[year] = Array(12).fill(0)
            counts[year][month]++
        })

        const years = Object.keys(counts).map(Number).sort()
        const matrix = years.map(y => counts[y])
        const monthTotals = Array(12).fill(0).map((_, m) =>
            years.reduce((sum, y) => sum + counts[y][m], 0)
        )
        const grandTotal = monthTotals.reduce((a, b) => a + b, 0)
        const rowTotals = years.map((_, i) => matrix[i].reduce((a, b) => a + b, 0))
        const worstYear = years[rowTotals.indexOf(Math.max(...rowTotals))]
        const worstMonth = monthTotals.indexOf(Math.max(...monthTotals))

        return { years, matrix, monthTotals, grandTotal, worstYear, worstMonth }
    }, [data])

    const cellClass = "px-3 py-2 text-right text-sm tabular-nums"
    const headClass = "px-3 py-2 text-right text-xs font-medium text-muted-foreground"

    return (
        <Card>
            <CardHeader className="pb-0 pt-3 px-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Operazioni per anno e mese
                </CardTitle>
            </CardHeader>
            <CardContent className="p-3 overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                                Year
                            </th>
                            {MONTHS.map((m, i) => (
                                <th key={m} className={`${headClass} ${i === worstMonth ? 'text-red-400' : ''}`}>
                                    {m}
                                </th>
                            ))}
                            <th className={`${headClass} font-bold text-foreground`}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {years.map((year, i) => {
                            const row = matrix[i]
                            const total = row.reduce((a, b) => a + b, 0)
                            return (
                                <tr key={year}
                                    className={`border-b border-border hover:bg-muted/50 ${year === worstYear ? 'bg-red-950/40' : ''}`}>
                                    <td className="px-3 py-2 text-sm font-medium">
                                        {year === worstYear
                                            ? <span className="text-red-400 font-bold">{year}</span>
                                            : year}
                                    </td>
                                    {row.map((count, m) => (
                                        <td key={m}
                                            className={`${cellClass} ${m === worstMonth ? 'bg-red-950/40' : ''}`}>
                                            {count > 0
                                                ? count
                                                : <span className="text-muted-foreground">—</span>}
                                        </td>
                                    ))}
                                    <td className={`${cellClass} font-bold ${year === worstYear ? 'text-red-400' : ''}`}>
                                        {total}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2 border-border">
                            <td className="px-3 py-2 text-sm font-medium">Total</td>
                            {monthTotals.map((t, m) => (
                                <td key={m}
                                    className={`${cellClass} font-bold ${m === worstMonth ? 'text-red-400' : ''}`}>
                                    {t}
                                </td>
                            ))}
                            <td className={`${cellClass} font-bold text-red-500`}>{grandTotal}</td>
                        </tr>
                    </tfoot>
                </table>
            </CardContent>
        </Card>
    )
}