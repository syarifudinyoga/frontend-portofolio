import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  getApiBaseUrl,
  getApiUrl,
  resolveMediaUrl,
  uint8ToBase64,
  base64ToUint8,
  getSession,
  getEncryptionKey,
  encryptData,
  decryptData,
  apiFetch,
  resetSession,
} from '../crypto.js'

const subtle = globalThis.crypto.subtle

// Fake backend that performs the same ECDH + HKDF handshake as the Go server.
function installFakeServer(onRequest) {
  const server = { sessions: new Map(), handshakes: 0 }
  server.encrypt = async (id, data) => {
    const iv = globalThis.crypto.getRandomValues(new Uint8Array(12))
    const cipher = await subtle.encrypt(
      { name: 'AES-GCM', iv },
      server.sessions.get(id),
      new TextEncoder().encode(JSON.stringify(data)),
    )
    return {
      encrypted: true,
      iv: uint8ToBase64(iv),
      data: uint8ToBase64(new Uint8Array(cipher)),
    }
  }
  server.decrypt = async (id, env) => {
    const plain = await subtle.decrypt(
      { name: 'AES-GCM', iv: base64ToUint8(env.iv) },
      server.sessions.get(id),
      base64ToUint8(env.data),
    )
    return JSON.parse(new TextDecoder().decode(plain))
  }

  globalThis.fetch = vi.fn(async (url, opts = {}) => {
    if (String(url).endsWith('/api/session')) {
      server.handshakes++
      const { publicKey } = JSON.parse(opts.body)
      const pair = await subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits'])
      const clientPub = await subtle.importKey(
        'raw',
        base64ToUint8(publicKey),
        { name: 'ECDH', namedCurve: 'P-256' },
        false,
        [],
      )
      const shared = await subtle.deriveBits({ name: 'ECDH', public: clientPub }, pair.privateKey, 256)
      const saltBytes = globalThis.crypto.getRandomValues(new Uint8Array(16))
      const hkdf = await subtle.importKey('raw', shared, 'HKDF', false, ['deriveKey'])
      const key = await subtle.deriveKey(
        {
          name: 'HKDF',
          hash: 'SHA-256',
          salt: saltBytes,
          info: new TextEncoder().encode('portfolio-e2e-v1'),
        },
        hkdf,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt'],
      )
      const id = uint8ToBase64(saltBytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
      server.sessions.set(id, key)
      const rawPub = new Uint8Array(await subtle.exportKey('raw', pair.publicKey))
      return {
        ok: true,
        status: 200,
        json: async () => ({ sessionId: id, publicKey: uint8ToBase64(rawPub), expiresIn: 1800 }),
      }
    }
    const sessionId = new Headers(opts.headers).get('X-Session-Id')
    return onRequest(url, opts, sessionId, server)
  })
  return server
}

describe('crypto.js utilities', () => {
  const originalEnv = window.__ENV__

  beforeEach(() => {
    window.__ENV__ = {}
    resetSession()
  })

  afterEach(() => {
    window.__ENV__ = originalEnv
    vi.restoreAllMocks()
  })

  describe('getApiBaseUrl', () => {
    it('returns empty string by default if no env is set', () => {
      window.__ENV__ = {}
      const url = getApiBaseUrl()
      expect(url).toBe('')
    })

    it('returns cleaned base url from window.__ENV__ without trailing slash', () => {
      window.__ENV__ = { VITE_API_BASE_URL: 'https://api.example.com///' }
      expect(getApiBaseUrl()).toBe('https://api.example.com')
    })
  })

  describe('getApiUrl', () => {
    it('returns empty string for empty input', () => {
      expect(getApiUrl('')).toBe('')
      expect(getApiUrl(null)).toBe('')
    })

    it('returns absolute URL as is', () => {
      expect(getApiUrl('https://external.com/api/test')).toBe('https://external.com/api/test')
      expect(getApiUrl('http://external.com/api/test')).toBe('http://external.com/api/test')
    })

    it('returns relative path as is when no base url is configured', () => {
      window.__ENV__ = { VITE_API_BASE_URL: '' }
      expect(getApiUrl('/api/portfolio')).toBe('/api/portfolio')
    })

    it('prepends base URL and ensures leading slash on path', () => {
      window.__ENV__ = { VITE_API_BASE_URL: 'https://api.example.com' }
      expect(getApiUrl('api/portfolio')).toBe('https://api.example.com/api/portfolio')
      expect(getApiUrl('/api/portfolio')).toBe('https://api.example.com/api/portfolio')
    })
  })

  describe('resolveMediaUrl', () => {
    it('returns empty string for empty input', () => {
      expect(resolveMediaUrl('')).toBe('')
      expect(resolveMediaUrl(null)).toBe('')
    })

    it('returns http, https, data:, and blob: URLs unchanged', () => {
      expect(resolveMediaUrl('https://example.com/photo.jpg')).toBe('https://example.com/photo.jpg')
      expect(resolveMediaUrl('http://example.com/photo.jpg')).toBe('http://example.com/photo.jpg')
      expect(resolveMediaUrl('data:image/png;base64,abc')).toBe('data:image/png;base64,abc')
      expect(resolveMediaUrl('blob:http://localhost/123')).toBe('blob:http://localhost/123')
    })

    it('resolves relative media path using getApiUrl', () => {
      window.__ENV__ = { VITE_API_BASE_URL: 'https://cdn.example.com' }
      expect(resolveMediaUrl('/uploads/image.png')).toBe('https://cdn.example.com/uploads/image.png')
    })
  })

  describe('Base64 and Uint8Array conversions', () => {
    it('correctly converts between Uint8Array and Base64', () => {
      const original = new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]) // "Hello World"
      const base64 = uint8ToBase64(original)
      expect(base64).toBe(btoa('Hello World'))

      const restored = base64ToUint8(base64)
      expect(Array.from(restored)).toEqual(Array.from(original))
    })

    it('handles large buffers exceeding 8192 chunk size', () => {
      const largeArray = new Uint8Array(10000)
      for (let i = 0; i < largeArray.length; i++) {
        largeArray[i] = i % 256
      }
      const base64 = uint8ToBase64(largeArray)
      const restored = base64ToUint8(base64)
      expect(restored.length).toBe(10000)
      expect(restored[500]).toBe(500 % 256)
      expect(restored[9999]).toBe(9999 % 256)
    })
  })

  describe('Session and encryption', () => {
    it('derives a non-extractable AES key via ECDH handshake', async () => {
      const server = installFakeServer(async () => ({}))
      const key = await getEncryptionKey()
      expect(key.type).toBe('secret')
      expect(key.extractable).toBe(false)
      expect(server.sessions.size).toBe(1)
    })

    it('reuses a single session across calls and concurrent requests', async () => {
      const server = installFakeServer(async () => ({}))
      const [a, b] = await Promise.all([getSession(), getSession()])
      expect(a).toBe(b)
      await getSession()
      expect(server.handshakes).toBe(1)
    })

    it('fails when the handshake is rejected', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 503 })
      await expect(getSession()).rejects.toThrow('Gagal membuat sesi enkripsi (503)')
    })

    it('encrypts and decrypts object data', async () => {
      installFakeServer(async () => ({}))
      const payload = { message: 'Secret data', count: 42, active: true }
      const encrypted = await encryptData(payload)

      expect(encrypted.encrypted).toBe(true)
      expect(typeof encrypted.iv).toBe('string')
      expect(typeof encrypted.data).toBe('string')
      expect(await decryptData(encrypted)).toEqual(payload)
    })

    it('encrypts and decrypts raw string data', async () => {
      installFakeServer(async () => ({}))
      const rawText = 'Plain simple text string'
      expect(await decryptData(await encryptData(rawText))).toBe(rawText)
    })

    it('returns input unchanged if decryptData receives invalid envelope', async () => {
      expect(await decryptData(null)).toBeNull()
      expect(await decryptData('non-object')).toBe('non-object')
      expect(await decryptData({ foo: 'bar' })).toEqual({ foo: 'bar' })
      expect(await decryptData({ encrypted: false })).toEqual({ encrypted: false })
    })
  })

  describe('apiFetch', () => {
    it('handles 204 No Content responses', async () => {
      installFakeServer(async () => ({ status: 204, headers: new Headers() }))
      expect(await apiFetch('/api/delete-item', { method: 'DELETE' })).toBeNull()
    })

    it('handles non-JSON successful response', async () => {
      installFakeServer(async () => ({
        status: 200,
        ok: true,
        headers: new Headers({ 'content-type': 'text/plain' }),
        text: () => Promise.resolve('plain text response'),
      }))
      expect(await apiFetch('/api/health')).toBe('plain text response')
    })

    it('throws error on non-JSON error response', async () => {
      installFakeServer(async () => ({
        status: 500,
        ok: false,
        headers: new Headers({ 'content-type': 'text/plain' }),
        text: () => Promise.resolve('Internal server fault'),
      }))
      await expect(apiFetch('/api/fail')).rejects.toThrow('Internal server fault')
    })

    it('sends session header, encrypts payload and decrypts response', async () => {
      let sentBody = null
      let sentSession = null
      installFakeServer(async (url, opts, sessionId, server) => {
        sentSession = sessionId
        sentBody = await server.decrypt(sessionId, JSON.parse(opts.body))
        return {
          status: 200,
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => server.encrypt(sessionId, { success: true, user: 'Admin' }),
        }
      })

      const result = await apiFetch('/api/login', {
        method: 'POST',
        body: { username: 'root', pass: 'secret' },
      })

      expect(sentSession).toBeTruthy()
      expect(sentBody).toEqual({ username: 'root', pass: 'secret' })
      expect(result).toEqual({ success: true, user: 'Admin' })
    })

    it('throws error when JSON response is not ok', async () => {
      installFakeServer(async (url, opts, sessionId, server) => ({
        status: 401,
        ok: false,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => server.encrypt(sessionId, { message: 'Invalid credentials' }),
      }))
      await expect(apiFetch('/api/auth', { method: 'POST' })).rejects.toThrow('Invalid credentials')
    })

    it('re-establishes the session once when the server reports it expired', async () => {
      let calls = 0
      const server = installFakeServer(async (url, opts, sessionId, srv) => {
        calls++
        if (calls === 1) {
          return {
            status: 401,
            ok: false,
            headers: new Headers({ 'content-type': 'text/plain' }),
            text: async () => 'sesi enkripsi tidak ditemukan atau kedaluwarsa',
          }
        }
        return {
          status: 200,
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => srv.encrypt(sessionId, { ok: true }),
        }
      })

      expect(await apiFetch('/api/portfolio')).toEqual({ ok: true })
      expect(server.handshakes).toBe(2)
    })
  })
})
