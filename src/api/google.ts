import { request } from './apiClient'

export async function googleConnect(
): Promise<string> {
  const response = await request<string>(`/api/integrations/connect`)

  return response
}
