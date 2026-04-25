import { useState, useMemo } from 'react'
import {
    useReactTable, getCoreRowModel, getSortedRowModel,
    getFilteredRowModel, flexRender,
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'

const columns = [
    { accessorKey: 'name', header: 'Nome', size: 120 },
    { accessorKey: 'plate', header: 'Targa', size: 80 },
    { accessorKey: 'brand', header: 'Marca', size: 80 },
    { accessorKey: 'model', header: 'Modello', size: 80 },
    { accessorKey: 'type', header: 'Tipo', size: 60 },
    { accessorKey: 'status_label', header: 'Stato', size: 60 },
]

export default function VehicleTable({ data, onRowClick }) {
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState([])
    const [viewMode, setViewMode] = useState(null)

    function getRowHighlight(row) {
        if (viewMode === 'pesanti') {
            if (row.weight > 3500) return 'bg-orange-900/40 hover:bg-orange-900/60'
        }
        return 'hover:bg-muted'
    }

    const filteredData = useMemo(() => {
        if (viewMode === 'ritirati') return data.filter(v => v.status_label === 'RITIRATO')
        if (viewMode === 'pesanti') return data.filter(v => v.weight > 3500)
        return data.filter(v => v.status_label !== 'RITIRATO')
    }, [data, viewMode])

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
                <Input
                    placeholder="Ricerca..."
                    value={globalFilter}
                    onChange={e => setGlobalFilter(e.target.value)}
                    className="max-w-sm"
                />
                <button
                    onClick={() => {
                        if (viewMode === 'pesanti') { setViewMode(null); setSorting([]) }
                        else { setViewMode('pesanti'); setSorting([{ id: 'weight', desc: true }]) }
                    }}
                    className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${viewMode === 'pesanti'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-border hover:bg-muted'
                        }`}
                >
                    Pesanti
                </button>
                <button
                    onClick={() => setViewMode(viewMode === 'ritirati' ? null : 'ritirati')}
                    className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${viewMode === 'ritirati'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-border hover:bg-muted'
                        }`}
                >
                    Ritirati
                </button>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(hg => (
                            <TableRow key={hg.id}>
                                {hg.headers.map(header => (
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
                                onClick={() => onRowClick(row.original)}
                                className={`cursor-pointer ${getRowHighlight(row.original)}`}
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
                {table.getFilteredRowModel().rows.length} di {filteredData.length} mezzi
            </p>
        </div>
    )
}