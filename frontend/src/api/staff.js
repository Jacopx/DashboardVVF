export async function fetchStaff() {
  const response = await fetch('/api/staff')

  if (!response.ok) throw new Error('Failed to fetch staff')

  return response.json()
}

export async function updateStaff(staff_id, payload) {
  const formatDate = (d) => (d instanceof Date ? d : new Date(d)).toISOString().split('T')[0]

  const response = await fetch(`/api/staff/${staff_id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      medical: formatDate(payload.medical),
      license_exp: formatDate(payload.license_exp),
    })
  })

  if (!response.ok) {
    const error = await response.json()
    const detail = Array.isArray(error.detail)
      ? error.detail[0].msg
      : error.detail
    throw new Error(detail || 'Failed to update staff')
  }

  return response.json()
}