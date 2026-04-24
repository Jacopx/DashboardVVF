export async function fetchStaff() {
  const response = await fetch('/api/staff')

  if (!response.ok) throw new Error('Failed to fetch staff')

  return response.json()
}