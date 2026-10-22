import { describe, it, expect } from 'vitest'
import {
  uiTextFields,
  defaultTextsID,
  defaultTextsEN,
  lines,
  translateContent,
  resolveTexts,
  localizePortfolio,
} from '../uiTexts.js'

describe('uiTexts.js utilities', () => {
  describe('uiTextFields and default texts', () => {
    it('has valid structure with key, label, value, group', () => {
      expect(Array.isArray(uiTextFields)).toBe(true)
      expect(uiTextFields.length).toBeGreaterThan(0)
      for (const field of uiTextFields) {
        expect(field.key).toBeDefined()
        expect(field.label).toBeDefined()
        expect(field.value).toBeDefined()
        expect(field.group).toBeDefined()
      }
    })

    it('maps defaultTextsID properly', () => {
      expect(defaultTextsID.brand).toBeDefined()
      expect(defaultTextsID.coverOpen).toBe('BUKA BUKU')
    })

    it('defines corresponding defaultTextsEN', () => {
      expect(defaultTextsEN.brand).toBeDefined()
      expect(defaultTextsEN.coverOpen).toBe('OPEN BOOK')
    })
  })

  describe('lines()', () => {
    it('returns empty string for null or empty string', () => {
      expect(lines('')).toBe('')
      expect(lines(null)).toBe('')
      expect(lines(undefined)).toBe('')
    })

    it('returns single line as array with 1 item', () => {
      const res = lines('Hello World')
      expect(res).toEqual(['Hello World'])
    })

    it('splits text with newlines and inserts <br/> elements', () => {
      const res = lines('Line 1\nLine 2\nLine 3')
      expect(res.length).toBe(5)
      expect(res[0]).toBe('Line 1')
      expect(res[1].type).toBe('br')
      expect(res[2]).toBe('Line 2')
      expect(res[3].type).toBe('br')
      expect(res[4]).toBe('Line 3')
    })
  })

  describe('translateContent()', () => {
    it('returns original text if lang is "id"', () => {
      expect(translateContent('Tentang', 'id')).toBe('Tentang')
      expect(translateContent('Pendidikan', 'id')).toBe('Pendidikan')
    })

    it('translates known Indonesian terms to English', () => {
      expect(translateContent('Tentang', 'en')).toBe('About')
      expect(translateContent('Pendidikan', 'en')).toBe('Education')
      expect(translateContent('Keahlian', 'en')).toBe('Core Competencies')
      expect(translateContent('Karya pilihan', 'en')).toBe('Selected Works')
    })

    it('falls back to original text if translation not found', () => {
      expect(translateContent('Custom unmapped text', 'en')).toBe('Custom unmapped text')
    })

    it('handles non-string or falsy input gracefully', () => {
      expect(translateContent('', 'en')).toBe('')
      expect(translateContent(null, 'en')).toBeNull()
      expect(translateContent(undefined, 'en')).toBeUndefined()
    })
  })

  describe('resolveTexts()', () => {
    it('returns defaults when saved texts are empty', () => {
      const texts = resolveTexts({}, 'id')
      expect(texts.coverOpen).toBe('BUKA BUKU')
      expect(texts.brand).toBe('CATATAN\nPERJALANAN')
    })

    it('overrides defaults with saved custom texts in Indonesian', () => {
      const custom = { coverOpen: 'BUKA SEKARANG' }
      const texts = resolveTexts(custom, 'id')
      expect(texts.coverOpen).toBe('BUKA SEKARANG')
      expect(texts.brand).toBe('CATATAN\nPERJALANAN')
    })

    it('translates default texts when lang is "en"', () => {
      const texts = resolveTexts({}, 'en')
      expect(texts.coverOpen).toBe('OPEN BOOK')
      expect(texts.brand).toBe('JOURNEY\nMEMOIR')
    })

    it('translates saved custom texts if in dictionary when lang is "en"', () => {
      const custom = { pageAbout: 'Tentang' }
      const texts = resolveTexts(custom, 'en')
      expect(texts.pageAbout).toBe('About')
    })
  })

  describe('localizePortfolio()', () => {
    it('handles null/undefined gracefully', () => {
      expect(localizePortfolio(null)).toBeNull()
      expect(localizePortfolio(undefined)).toBeUndefined()
    })

    it('translates portfolio profile, experiences, skills, and projects for English', () => {
      const raw = {
        profile: {
          name: 'Yoga',
          role: 'Tentang',
          headline: 'Perjalanan karir',
          about: 'Pengalaman',
          location: 'Jakarta',
        },
        experiences: [
          {
            role: 'Software Engineer',
            company: 'Tech Corp',
            location: 'Jakarta',
            description: 'Deskripsi pekerjaan',
            highlights: ['Membuat sistem', 'Optimasi performa'],
          },
        ],
        education: [
          {
            institution: 'Universitas',
            degree: 'Sarjana',
            field: 'Teknik Informatika',
            description: 'Belajar programming',
          },
        ],
        certifications: [
          {
            name: 'Sertifikasi Keahlian',
            issuer: 'BNSP',
          },
        ],
        skills: [
          { name: 'Keahlian', category: 'Backend' },
        ],
        techStack: [
          { category: 'Frontend', items: ['React'] },
        ],
        projects: [
          {
            title: 'Karya pilihan',
            category: 'Web App',
            description: 'Deskripsi proyek',
          },
        ],
      }

      const idRes = localizePortfolio(raw, 'id')
      expect(idRes.profile.role).toBe('Tentang')
      expect(idRes.projects[0].title).toBe('Karya pilihan')

      const enRes = localizePortfolio(raw, 'en')
      expect(enRes.profile.role).toBe('About')
      expect(enRes.projects[0].title).toBe('Selected Works')
    })
  })
})
