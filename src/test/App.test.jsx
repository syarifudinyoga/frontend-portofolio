import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App.jsx'
import * as cryptoModule from '../crypto.js'

describe('App Component', () => {
  const mockPortfolio = {
    profile: {
      name: 'Syarifudin Yoga',
      role: 'Fullstack & DevOps Engineer',
      headline: 'Membangun sistem yang tangguh',
      about: 'Pengembang perangkat lunak berfokus pada web modern dan infrastruktur.',
      location: 'Jakarta, Indonesia',
      email: 'test@example.com',
      website: 'https://example.com',
      avatarUrl: '',
      resumeUrl: '',
      githubUrl: 'https://github.com/syarifudinyoga',
      instagramUrl: '',
      twitterUrl: '',
      linkedinUrl: '',
    },
    experiences: [
      {
        company: 'Devlabhub',
        role: 'DevOps Engineer',
        location: 'Remote',
        startDate: '2023',
        endDate: 'Present',
        description: 'Managing cloud infrastructure & CI/CD',
        highlights: ['Kubernetes', 'Podman', 'Jenkins'],
      },
    ],
    education: [
      {
        institution: 'Universitas Indonesia',
        degree: 'S1',
        field: 'Computer Science',
        description: 'Computer systems',
      },
    ],
    certifications: [
      {
        name: 'Certified Kubernetes Administrator',
        issuer: 'CNCF',
        year: '2024',
      },
    ],
    skills: [
      { name: 'React', category: 'Frontend' },
      { name: 'Golang', category: 'Backend' },
    ],
    techStack: [
      { category: 'Frontend', items: ['React', 'Vite'] },
    ],
    projects: [
      {
        title: 'Cloud DevOps Portal',
        category: 'Infrastructure',
        description: 'Automated infrastructure deployment platform',
        tags: ['Go', 'React', 'Docker'],
        link: 'https://github.com',
      },
    ],
    texts: {},
  }

  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('portfolio-lang', 'id')
    vi.restoreAllMocks()
    vi.spyOn(cryptoModule, 'apiFetch').mockResolvedValue(mockPortfolio)
  })

  it('renders initial cover page with open button', async () => {
    render(<App />)

    const openBtn = await screen.findByText(/BUKA BUKU/i)
    expect(openBtn).toBeInTheDocument()
    expect(screen.getByText(/SEBUAH BUKU TENTANG/i)).toBeInTheDocument()
  })

  it('opens book and displays table of contents & content pages', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    render(<App />)

    const openBtn = await screen.findByText(/BUKA BUKU/i)
    fireEvent.click(openBtn)

    // Advance 1650ms timer
    vi.advanceTimersByTime(1700)

    // Verify tabs are available
    await waitFor(() => {
      expect(screen.getByText(/DAFTAR ISI/i)).toBeInTheDocument()
    })
    expect(screen.getByText('Tentang')).toBeInTheDocument()
    expect(screen.getByText('Pendidikan')).toBeInTheDocument()
    expect(screen.getByText('Keahlian')).toBeInTheDocument()

    vi.useRealTimers()
  })

  it('allows switching between languages (ID / EN)', async () => {
    render(<App />)

    await screen.findByText(/BUKA BUKU/i)
    const langToggleBtn = screen.getByRole('button', { name: /EN/i })
    expect(langToggleBtn).toBeInTheDocument()

    // Click to switch to English
    fireEvent.click(langToggleBtn)

    await waitFor(() => {
      // In English, open book button becomes OPEN BOOK
      expect(screen.getByText(/OPEN BOOK/i)).toBeInTheDocument()
    })
  })

  it('renders admin portal when location pathname is /myconfig', async () => {
    const originalLocation = window.location
    delete window.location
    window.location = {
      ...originalLocation,
      pathname: '/myconfig',
    }

    render(<App />)

    expect(await screen.findByText(/MASUK KE PORTAL/i)).toBeInTheDocument()
    expect(screen.getByText(/ruang editor/i)).toBeInTheDocument()

    window.location = originalLocation
  })
})
