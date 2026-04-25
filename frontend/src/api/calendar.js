export async function fetchCalendar(year) {
    const res = await fetch(`/api/calendar/${year}`)
    if (!res.ok) throw new Error('Failed to fetch calendar')
    return res.json()
}