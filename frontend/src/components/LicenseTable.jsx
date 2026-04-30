import { useState, useMemo, act } from 'react'

import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
} from '@tanstack/react-table'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { Input } from '@/components/ui/input'

const columns = [
    { accessorKey: 'role', header: 'Ruolo', size: 4 },
    { accessorKey: 'surname', header: 'Cognome', size: 100 },
    { accessorKey: 'name', header: 'Nome', size: 100 },
    { accessorKey: 'license_exp', header: 'Scadenza patente', size: 2 },
    {
        header: 'Giorni rimanenti',
        accessorFn: row => {
            if (!row.license_exp) return 'N/A'
            
            const diff = new Date(row.license_exp) - new Date()

            return diff > 0 ? Math.ceil(diff / 86400000) : 'SCADUTA'
        },
        size: 3
    },
]

export default function StaffTable({ data }) {
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState([])

    const filteredData = useMemo(() => {
        return data.filter(s => s.status_label === 'ATTIVO')
    }, [data])

    function getExpiryHighlight(exp_date) {
        if (!exp_date) return ''
        const today = new Date()
        const exp = new Date(exp_date)
        const days = Math.ceil((exp - today) / 86400000)

        if (days < 0) return '!bg-red-600/70 hover:!bg-red-600/90'
        if (days <= 45) return '!bg-orange-500/70 hover:!bg-orange-500/90'
        if (days <= 90) return '!bg-yellow-500/70 hover:!bg-yellow-500/90'
        if (days <= 180) return '!bg-blue-500/70 hover:!bg-blue-500/90'
        return 'hover:bg-muted'
    }

    const table = useReactTable({
        data: filteredData,
        columns,
        state: { globalFilter, sorting },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    return (
        <div className="space-y-4">
            <div className="flex gap-4 items-center">
                {(<Input
                    placeholder="Ricerca..."
                    value={globalFilter}
                    onChange={e => setGlobalFilter(e.target.value)}
                    className="max-w-sm"
                />)}
            </div>
            <div className="flex gap-3 text-xs">
                <span className="px-2 py-0.5 rounded bg-blue-500/70">≤ 180 giorni</span>
                <span className="px-2 py-0.5 rounded bg-yellow-500/70">≤ 90 giorni</span>
                <span className="px-2 py-0.5 rounded bg-orange-500/70">≤ 45 giorni</span>
                <span className="px-2 py-0.5 rounded bg-red-600/70">Scaduta</span>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className="cursor-pointer select-none"
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {header.column.getIsSorted() === 'asc' ? ' ↑' : ''}
                                        {header.column.getIsSorted() === 'desc' ? ' ↓' : ''}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map(row => (
                            <TableRow
                                key={row.id}
                                className={`cursor-pointer ${getExpiryHighlight(row.original.license_exp)}`}
                                data-state=""
                            >
                                {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <p className="text-sm text-muted-foreground">
                {table.getFilteredRowModel().rows.length} di {data.length} persone
            </p>
        </div>
    )
}