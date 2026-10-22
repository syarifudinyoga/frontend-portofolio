import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  getApiBaseUrl,
  getApiUrl,
  resolveMediaUrl,
  uint8ToBase64,
  base64ToUint8,
  getEncryptionKey,
  encryptData,
  decryptData,
  apiFetch,
} from '../crypto.js'

describe('crypto.js utilities', () => {
  const originalEnv = window.__ENV__

  beforeEach(() => {
    window.__ENV__ = {}
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

  describe('Encryption and Decryption', () => {
    it('generates a valid CryptoKey', async () => {
      const key = await getEncryptionKey()
      expect(key).toBeDefined()
      expect(key.type).toBe('secret')
    })

    it('encrypts and decrypts object data', async () => {
      const payload = { message: 'Secret data', count: 42, active: true }
      const encrypted = await encryptData(payload)

      expect(encrypted.encrypted).toBe(true)
      expect(typeof encrypted.iv).toBe('string')
      expect(typeof encrypted.data).toBe('string')

      const decrypted = await decryptData(encrypted)
      expect(decrypted).toEqual(payload)
    })

    it('encrypts and decrypts raw string data', async () => {
      const rawText = 'Plain simple text string'
      const encrypted = await encryptData(rawText)
      const decrypted = await decryptData(encrypted)
      expect(decrypted).toBe(rawText)
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
      globalThis.fetch = vi.fn().mockResolvedValue({
        status: 204,
        headers: new Headers(),
      })

      const res = await apiFetch('/api/delete-item', { method: 'DELETE' })
      expect(res).toBeNull()
    })

    it('handles non-JSON successful response', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'content-type': 'text/plain' }),
        text: () => Promise.resolve('plain text response'),
      })

      const res = await apiFetch('/api/health')
      expect(res).toBe('plain text response')
    })

    it('throws error on non-JSON error response', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        status: 500,
        ok: false,
        headers: new Headers({ 'content-type': 'text/plain' }),
        text: () => Promise.resolve('Internal server fault'),
      })

      await expect(apiFetch('/api/fail')).rejects.toThrow('Internal server fault')
    })

    it('encrypts payload and decrypts encrypted JSON response', async () => {
      let sentBody = null

      globalThis.fetch = vi.fn().mockImplementation(async (url, opts) => {
        sentBody = JSON.parse(opts.body)
        const responseData = { success: true, user: 'Admin' }
        const encryptedResponse = await encryptData(responseData)

        return {
          status: 200,
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: () => Promise.resolve(encryptedResponse),
        }
      })

      const result = await apiFetch('/api/login', {
        method: 'POST',
        body: { username: 'root', pass: 'secret' },
      })

      expect(sentBody).toBeDefined()
      expect(sentBody.encrypted).toBe(true)
      expect(sentBody.iv).toBeDefined()
      expect(sentBody.data).toBeDefined()
      expect(result).toEqual({ success: true, user: 'Admin' })
    })

    it('throws error when JSON response is not ok', async () => {
      globalThis.fetch = vi.fn().mockImplementation(async () => {
        const errorData = await encryptData({ message: 'Invalid credentials' })
        return {
          status: 401,
          ok: false,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: () => Promise.resolve(errorData),
        }
      })

      await expect(apiFetch('/api/auth', { method: 'POST' })).rejects.toThrow('Invalid credentials')
    })
  })
})
