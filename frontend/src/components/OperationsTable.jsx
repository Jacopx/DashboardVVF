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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const columns = [
  { accessorKey: 'id', header: 'ID', size: 60 },
  { accessorKey: 'year', header: 'Anno', size: 80 },
  { accessorKey: 'opn', header: 'Num', size: 100 },
  { accessorKey: 'date', header: 'Data', size: 120 },
  { accessorKey: 'typology', header: 'Tipologia', size: 200 },
  {
    header: 'Durata',
    accessorFn: row => {
      // calculate here from row.dt_exit and row.dt_close
      if (!row.dt_exit || !row.dt_close) return 'N/A'

      const exit = new Date(row.dt_exit)
      const close = new Date(row.dt_close)
      const diffMs = close - exit
      const hours = Math.floor(diffMs / 3600000)
      const minutes = Math.round((diffMs % 3600000) / 60000)

      return `${hours}h ${minutes.toString().padStart(2, '0')}m`
    }, 
    size: 50
  },
  { accessorKey: 'loc', header: 'Luogo', size: 150 },
  { accessorKey: 'boss', header: 'Capo Partenza', size: 100 },
]

export default function OperationsTable({ data, onRowClick }) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([])

  const years = useMemo(() => {
    const unique = [...new Set(data.map(op => op.year))].sort().reverse()
    return ['All', ...unique]
  }, [data])

  const [selectedYear, setSelectedYear] = useState('All')

  const filteredData = useMemo(() => {
    if (selectedYear === 'All') return data
    return data.filter(op => op.year === selectedYear)
  }, [data, selectedYear])

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
          placeholder="Search anything..."
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map(year => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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
                className="cursor-pointer hover:bg-muted"
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
        {table.getFilteredRowModel().rows.length} of {data.length} operations
      </p>
    </div>
  )
}