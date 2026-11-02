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

const KDF_INFO = 'portfolio-e2e-v1'
const SESSION_ERROR_MARKER = 'sesi enkripsi'

let cachedSession = null
let pendingSession = null

export function resetSession() {
  cachedSession = null
  pendingSession = null
}

async function createSession() {
  const subtle = window.crypto.subtle
  const pair = await subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, false, ['deriveBits'])
  const rawPub = new Uint8Array(await subtle.exportKey('raw', pair.publicKey))

  const res = await fetch(getApiUrl('/api/session'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicKey: uint8ToBase64(rawPub) }),
  })
  if (!res.ok) {
    throw new Error(`Gagal membuat sesi enkripsi (${res.status})`)
  }
  const { sessionId, publicKey, expiresIn } = await res.json()

  const serverPub = await subtle.importKey(
    'raw',
    base64ToUint8(publicKey),
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    [],
  )
  const shared = await subtle.deriveBits({ name: 'ECDH', public: serverPub }, pair.privateKey, 256)
  const hkdfKey = await subtle.importKey('raw', shared, 'HKDF', false, ['deriveKey'])
  const salt = base64ToUint8(sessionId.replace(/-/g, '+').replace(/_/g, '/'))
  const key = await subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt, info: new TextEncoder().encode(KDF_INFO) },
    hkdfKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )

  const ttlMs = Math.max(((Number(expiresIn) || 1800) - 60) * 1000, 30000)
  return { id: sessionId, key, expiresAt: Date.now() + ttlMs }
}

export async function getSession() {
  if (cachedSession && cachedSession.expiresAt > Date.now()) return cachedSession
  if (!pendingSession) {
    pendingSession = createSession()
      .then((session) => {
        cachedSession = session
        return session
      })
      .finally(() => {
        pendingSession = null
      })
  }
  return pendingSession
}

export async function getEncryptionKey() {
  return (await getSession()).key
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

export async function apiFetch(url, options = {}, retried = false) {
  const opts = { ...options }
  const headers = new Headers(opts.headers || {})
  const session = await getSession()
  headers.set('X-Session-Id', session.id)

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
    const text = await response.text()
    if (!response.ok) {
      if (!retried && response.status === 401 && text.toLowerCase().includes(SESSION_ERROR_MARKER)) {
        resetSession()
        return apiFetch(url, options, true)
      }
      throw new Error(text || `Server merespons status ${response.status}`)
    }
    return text
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
