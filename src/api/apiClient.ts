const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL ?? ''

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${backendBaseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Message API request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}

export { request }