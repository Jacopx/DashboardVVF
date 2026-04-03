export async function fetchOperations(filters = {}) {
  const params = new URLSearchParams()

  if (filters.year) params.append('year', filters.year)
  if (filters.typology) params.append('typology', filters.typology)
  if (filters.boss) params.append('boss', filters.boss)
  if (filters.date_from) params.append('date_from', filters.date_from)
  if (filters.date_to) params.append('date_to', filters.date_to)

  params.append('limit', '10000')

  const response = await fetch(`/api/operations?${params}`)

  if (!response.ok) throw new Error('Failed to fetch operations')

  return response.json()
}

export async function fetchOperationDetail(year, id) {
  const response = await fetch(`/api/operations/${year}/${id}`)

  if (!response.ok) throw new Error('Failed to fetch operation detail')

  return response.json()
}

export async function fetchStarts(year) {
  const response = await fetch(`/api/operations/${year}/full`)

  if (!response.ok) throw new Error('Failed to fetch starts')

  const operations = await response.json()
  
  return operations.flatMap(op => op.starts)
}

export async function fetchAllOperations() {
  const response = await fetch('/api/operations?limit=50000')
  if (!response.ok) throw new Error('Failed to fetch all operations')
  return response.json()
}