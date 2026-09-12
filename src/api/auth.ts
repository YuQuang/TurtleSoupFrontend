import { request } from './apiClient'

export type User = {
    user_id: string        // User ID
    name: string           // 名稱
    email: string          // email
    avatar: string         // 頭像
    exp: string | null     // 到期
}

export async function me(
): Promise<User> {
    const response = await request<User>(
      `/api/auth/me`,
      {
        credentials: "include",
        method: "POST",
      }
    )

    return response
}
