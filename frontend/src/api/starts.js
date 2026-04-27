export async function fetchAllStarts() {
    const response = await fetch('/api/starts/full?limit=50000')

    if (!response.ok) throw new Error('Failed to fetch all starts')

    return response.json()
}