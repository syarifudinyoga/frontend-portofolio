import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AdminPortal from '../AdminPortal.jsx'
import * as cryptoModule from '../crypto.js'

describe('AdminPortal Component', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it('renders login gate by default when unauthenticated', () => {
    render(<AdminPortal />)

    expect(screen.getByText(/ruang editor/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/UNIQUE KEY/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /MASUK KE PORTAL/i })).toBeInTheDocument()
  })

  it('allows logging in with correct unique key and shows editor dashboard', async () => {
    const mockPortfolio = {
      profile: {
        name: 'Yoga Admin',
        role: 'Lead Architect',
        headline: 'Managing projects',
        about: 'Bio data',
        location: 'Jakarta',
      },
      experiences: [],
      education: [],
      certifications: [],
      skills: [],
      techStack: [],
      projects: [],
      texts: {},
    }

    vi.spyOn(cryptoModule, 'apiFetch').mockResolvedValue(mockPortfolio)

    render(<AdminPortal />)

    const keyInput = screen.getByLabelText(/UNIQUE KEY/i)
    const submitBtn = screen.getByRole('button', { name: /MASUK KE PORTAL/i })

    fireEvent.change(keyInput, { target: { value: 'secret-key-123' } })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/RUANG PERSONAL \/ EDITOR/i)).toBeInTheDocument()
    })

    // Check presence of admin sections and buttons
    expect(screen.getByRole('button', { name: /KELUAR/i })).toBeInTheDocument()
    expect(screen.getByText(/Atur isi portfolio/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /SIMPAN SEMUA PERUBAHAN/i })).toBeInTheDocument()
  })

  it('shows error notice when login fails', async () => {
    vi.spyOn(cryptoModule, 'apiFetch').mockRejectedValue(new Error('Kunci akses salah'))

    render(<AdminPortal />)

    const keyInput = screen.getByLabelText(/UNIQUE KEY/i)
    const submitBtn = screen.getByRole('button', { name: /MASUK KE PORTAL/i })

    fireEvent.change(keyInput, { target: { value: 'wrong-key' } })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/Kunci akses salah/i)).toBeInTheDocument()
    })
  })
})
