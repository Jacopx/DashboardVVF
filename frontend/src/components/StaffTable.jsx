import { useState, useMemo } from 'react'

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
  { accessorKey: 'radio', header: 'Radio', size: 2 },
  { accessorKey: 'license', header: 'Patente', size: 2 },
  { accessorKey: 'status', header: 'Stato', size: 2 },
]

export default function StaffTable({ data, onRowClick }) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([])
  const [viewMode, setViewMode] = useState(null)

  function getRowHighlight(row) {
    if (viewMode === 'patenti') {
      if (row.license >= 3) return 'bg-red-700/60 hover:bg-red-700/80'
      if (row.license === 2) return 'bg-orange-900/40 hover:bg-orange-900/60'
    }
    if (viewMode === 'ruoli') {
      if (row.role === 'CSV') return 'bg-red-700/60 hover:bg-red-700/80'
    }
    if (viewMode === 'radio') {
      const decade = Math.floor(row.radio / 10)
      const colors = [
        'bg-blue-900/40 hover:bg-blue-900/60',
        'bg-purple-900/40 hover:bg-purple-900/60',
        'bg-teal-900/40 hover:bg-teal-900/60',
        'bg-yellow-900/40 hover:bg-yellow-900/60',
      ]
      return colors[decade % colors.length]
    }
    return 'hover:bg-muted'
  }

  const filteredData = useMemo(() => {
    if (viewMode === 'ritirati') return data.filter(s => s.status === 'RITIRATO')
    return data.filter(s => s.status !== 'RITIRATO')
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
        {(<Input
          placeholder="Ricerca..."
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />)}
        <button
          onClick={() => {
            if (viewMode === 'patenti') {
              setViewMode(null)
              setSorting([])
            } else {
              setViewMode('patenti')
              setSorting([{ id: 'license', desc: true }])
            }
          }}
          className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${viewMode === 'patenti'
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-background text-muted-foreground border-border hover:bg-muted'
            }`}
        >
          Patenti
        </button>
        <button
          onClick={() => setViewMode(viewMode === 'ruoli' ? null : 'ruoli')}
          className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${viewMode === 'ruoli'
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-background text-muted-foreground border-border hover:bg-muted'
            }`}
        >
          Ruoli
        </button>
        <button
          onClick={() => {
            if (viewMode === 'radio') {
              setViewMode(null)
              setSorting([])
            } else {
              setViewMode('radio')
              setSorting([{ id: 'radio', desc: false }])
            }
          }}
          className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${viewMode === 'radio'
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-background text-muted-foreground border-border hover:bg-muted'
            }`}
        >
          Radio
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
        {table.getFilteredRowModel().rows.length} di {filteredData.length} persone
      </p>
    </div>
  )
}