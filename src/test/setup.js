import '@testing-library/jest-dom/vitest'
import { webcrypto } from 'node:crypto'

// Provide Web Crypto API in jsdom environment if missing
if (!window.crypto || !window.crypto.subtle) {
  Object.defineProperty(window, 'crypto', {
    value: webcrypto,
    writable: true,
    configurable: true,
  })
}

// Mock window.scrollTo
if (typeof window.scrollTo !== 'function') {
  window.scrollTo = () => {}
}

// Mock window.matchMedia
if (typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}

// Mock IntersectionObserver
if (typeof window.IntersectionObserver !== 'function') {
  class MockIntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  })
}
