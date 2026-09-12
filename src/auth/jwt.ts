type JwtHeader = {
  alg?: string
  typ?: string
}

type JwtPayload = {
  exp?: number
  nbf?: number
}

const jwtStorageKeys = ['access_token', 'token', 'jwt'] as const

function decodeBase64Url(value: string): string {
  const normalizedValue = value.replaceAll('-', '+').replaceAll('_', '/')
  const padding = '='.repeat((4 - (normalizedValue.length % 4)) % 4)
  return window.atob(`${normalizedValue}${padding}`)
}

function parseJwt(token: string): { header: JwtHeader; payload: JwtPayload } | null {
  const parts = token.split('.')

  if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
    return null
  }

  try {
    const header = JSON.parse(decodeBase64Url(parts[0])) as JwtHeader
    const payload = JSON.parse(decodeBase64Url(parts[1])) as JwtPayload

    if (typeof header.alg !== 'string' || header.alg.toLowerCase() === 'none') {
      return null
    }

    if (typeof payload.exp !== 'number' || !Number.isFinite(payload.exp)) {
      return null
    }

    return { header, payload }
  } catch {
    return null
  }
}

function isValidJwt(token: string): boolean {
  const parsedJwt = parseJwt(token)

  if (!parsedJwt) {
    return false
  }

  const nowInSeconds = Date.now() / 1000
  const { exp, nbf } = parsedJwt.payload

  return typeof exp === 'number' && exp > nowInSeconds && (typeof nbf !== 'number' || nbf <= nowInSeconds)
}

export function hasValidJwt(): boolean {
  return jwtStorageKeys.some((key) => {
    const token = localStorage.getItem(key)
    return token !== null && isValidJwt(token)
  })
}
