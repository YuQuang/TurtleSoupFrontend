import { request } from './apiClient'

export type Message = {
  id: string                // 訊息 ID
  content: string           // 訊息內容
  conversation_id: string   // 對話 ID
  created_at: string        // 時間戳
  user_id: string           // 使用者 ID
  user_name: string         // 使用者名稱
  user_email: string        // 使用者 Email
  response: string | null   // AI 回應內容
  error: string | null      // 錯誤信息
}

export type CreateMessagePayload = {
  user_id: string         // 使用者 ID
  content: string         // 訊息內容
  conversation_id: string // 對話 ID
}

export async function getMessages(
  conversation_id?: string
): Promise<Record<string, Message[]>> {
  const query = conversation_id ? `?conversation_id=${encodeURIComponent(conversation_id)}` : ''
  const response = await request<Record<string, Message[]>>(`/api/messages${query}`)

  return response
}

export function createMessage(
  payload: CreateMessagePayload
): Promise<Record<string, Message[]>> {
  return request<Record<string, Message[]>>('/api/messages', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
