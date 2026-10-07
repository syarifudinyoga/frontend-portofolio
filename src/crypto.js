const DEFAULT_SECRET = 'portfolio-vault-key-2026-secure-secret-token'

let cachedCryptoKey = null

export function getApiBaseUrl() {
  const envUrl =
    (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.VITE_API_BASE_URL) ||
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
    ''
  return String(envUrl).trim().replace(/\/+$/, '')
}

export function getApiUrl(path = '') {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  const base = getApiBaseUrl()
  if (!base) return path
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${cleanPath}`
}

export function resolveMediaUrl(url) {
  if (!url) return ''
  if (/^(?:https?:\/\/|data:|blob:)/i.test(url)) return url
  return getApiUrl(url)
}

function getSecret() {
  return (
    (typeof window !== 'undefined' &&
      window.__ENV__ &&
      window.__ENV__.VITE_API_ENCRYPTION_SECRET) ||
    (typeof import.meta !== 'undefined' &&
      import.meta.env &&
      import.meta.env.VITE_API_ENCRYPTION_SECRET) ||
    DEFAULT_SECRET
  )
}

export async function getEncryptionKey() {
  if (cachedCryptoKey) return cachedCryptoKey

  const secret = getSecret()
  const enc = new TextEncoder()
  const rawKey = enc.encode(secret)
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', rawKey)

  cachedCryptoKey = await window.crypto.subtle.importKey(
    'raw',
    hashBuffer,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt'],
  )

  return cachedCryptoKey
}

export function uint8ToBase64(bytes) {
  let binary = ''
  const len = bytes.byteLength
  const chunkSize = 8192
  for (let i = 0; i < len; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, len))
    binary += String.fromCharCode.apply(null, chunk)
  }
  return btoa(binary)
}

export function base64ToUint8(base64) {
  const binary = atob(base64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

export async function encryptData(data) {
  const key = await getEncryptionKey()
  const iv = window.crypto.getRandomValues(new Uint8Array(12))
  const jsonStr = typeof data === 'string' ? data : JSON.stringify(data)
  const plaintextBytes = new TextEncoder().encode(jsonStr)

  const cipherBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    plaintextBytes,
  )

  return {
    encrypted: true,
    iv: uint8ToBase64(iv),
    data: uint8ToBase64(new Uint8Array(cipherBuffer)),
  }
}

export async function decryptData(envelope) {
  if (
    !envelope ||
    typeof envelope !== 'object' ||
    !envelope.encrypted ||
    !envelope.iv ||
    !envelope.data
  ) {
    return envelope
  }

  const key = await getEncryptionKey()
  const iv = base64ToUint8(envelope.iv)
  const cipherBytes = base64ToUint8(envelope.data)

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    cipherBytes,
  )

  const decryptedText = new TextDecoder().decode(decryptedBuffer)
  try {
    return JSON.parse(decryptedText)
  } catch {
    return decryptedText
  }
}

export async function apiFetch(url, options = {}) {
  const opts = { ...options }
  const headers = new Headers(opts.headers || {})

  // Encrypt JSON body if provided as a plain object/array
  if (
    opts.body &&
    typeof opts.body === 'object' &&
    !(opts.body instanceof FormData) &&
    !(opts.body instanceof Blob) &&
    !(opts.body instanceof URLSearchParams)
  ) {
    const encryptedBody = await encryptData(opts.body)
    opts.body = JSON.stringify(encryptedBody)
    headers.set('Content-Type', 'application/json')
  }

  opts.headers = headers
  const targetUrl = getApiUrl(url)
  const response = await fetch(targetUrl, opts)

  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    if (!response.ok) {
      const errText = await response.text()
      throw new Error(errText || `Server merespons status ${response.status}`)
    }
    return response.text()
  }

  const rawJson = await response.json()
  const data = await decryptData(rawJson)

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && (data.message || data.error)) ||
      (typeof data === 'string' ? data : `Error ${response.status}`)
    throw new Error(message)
  }

  return data
}
