import { request } from './apiClient'

export type Story = {
  id: string                     // 訊息 ID
  title: string                  // 訊息內容
  mystery: string                // 對話 ID
  solution: string               // 時間戳
  hint: string | null            // 使用者 ID
  is_published: boolean          // AI 回應內容
  created_at: string             // 錯誤信息
  updated_at: string             // 錯誤信息
}

export type CreateStoryPayload = {
  title: string             // 標題
  mystery: string           // 湯面
  solution: string          // 湯底
  hint: string              // 提示
  is_published: boolean     // 是否公開
}

export type UpdateStoryPayload = {
  id: string                // 故事 ID
  title: string             // 標題
  mystery: string           // 湯面
  solution: string          // 湯底
  hint: string              // 提示
  is_published: boolean     // 是否公開
}

export async function getStories(
): Promise<Record<string, Story[]>> {
  return await request<Record<string, Story[]>>(`/api/stories`)
}

export function createStory(
  payload: CreateStoryPayload
): Promise<Record<string, Story[]>> {
  return request<Record<string, Story[]>>('/api/stories', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateStory(
  payload: UpdateStoryPayload
): Promise<Record<string, Story[]>> {
  return request<Record<string, Story[]>>('/api/stories', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}
