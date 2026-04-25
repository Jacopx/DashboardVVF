export async function fetchVehicles() {
  const response = await fetch('/api/vehicles')

  if (!response.ok) throw new Error('Failed to fetch vehicles')

  return response.json()
}