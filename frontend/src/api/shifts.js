export async function fetchShifts() {
    const res = await fetch('/api/shifts')
    if (!res.ok) throw new Error('Failed to fetch shifts')
    return res.json()
}