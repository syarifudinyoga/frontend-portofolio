import { useEffect, useState } from 'react'
import {
  ArrowUpRight,
  Award,
  BriefcaseBusiness,
  ChevronDown,
  FolderKanban,
  GraduationCap,
  Layers3,
  Lightbulb,
  Type,
  UserRound,
} from 'lucide-react'
import { apiFetch, resolveMediaUrl } from './crypto.js'
import { defaultTexts, uiTextFields } from './uiTexts.js'

const emptyPortfolio = {
  profile: {
    name: '',
    role: '',
    headline: '',
    about: '',
    location: '',
    email: '',
    website: '',
    avatarUrl: '',
    resumeUrl: '',
    githubUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
  },
  experiences: [],
  education: [],
  certifications: [],
  texts: {},
  skills: [],
  techStack: [],
  projects: [],
}

const listSections = [
  {
    key: 'experiences',
    title: 'Pengalaman',
    addLabel: 'Tambah pengalaman',
    create: () => ({ company: '', role: '', location: '', startDate: '', endDate: '', description: '', highlights: [] }),
    fields: [
      { key: 'company', label: 'Perusahaan', required: true },
      { key: 'role', label: 'Posisi', required: true },
      { key: 'location', label: 'Lokasi' },
      { key: 'startDate', label: 'Tanggal mulai', type: 'date', required: true },
      { key: 'endDate', label: 'Tanggal selesai', type: 'date' },
      { key: 'description', label: 'Deskripsi', multiline: true },
      { key: 'highlights', label: 'Pencapaian (satu per baris)', lines: true, multiline: true },
    ],
  },
  {
    key: 'education',
    title: 'Pendidikan',
    addLabel: 'Tambah pendidikan',
    create: () => ({ institution: '', degree: '', field: '', startDate: '', endDate: '', description: '' }),
    fields: [
      { key: 'institution', label: 'Institusi', required: true },
      { key: 'degree', label: 'Gelar', required: true },
      { key: 'field', label: 'Bidang studi' },
      { key: 'startDate', label: 'Tanggal mulai', type: 'date', required: true },
      { key: 'endDate', label: 'Tanggal selesai', type: 'date' },
      { key: 'description', label: 'Deskripsi', multiline: true },
    ],
  },
  {
    key: 'certifications',
    title: 'Sertifikasi',
    addLabel: 'Tambah sertifikasi',
    create: () => ({ name: '', issuer: '', issuedDate: '', credentialUrl: '' }),
    fields: [
      { key: 'name', label: 'Nama sertifikasi', required: true },
      { key: 'issuer', label: 'Penerbit' },
      { key: 'issuedDate', label: 'Tanggal terbit', type: 'date' },
      { key: 'credentialUrl', label: 'URL sertifikat', type: 'url' },
    ],
  },
  {
    key: 'skills',
    title: 'Skill',
    addLabel: 'Tambah skill',
    create: () => ({ name: '', category: '', level: 3 }),
    fields: [
      { key: 'name', label: 'Nama skill', required: true },
      { key: 'category', label: 'Kategori', required: true },
      { key: 'level', label: 'Level (1–5)', type: 'number', min: 1, max: 5, required: true },
    ],
  },
  {
    key: 'techStack',
    title: 'Tech stack',
    addLabel: 'Tambah teknologi',
  },
  {
    key: 'projects',
    title: 'Karya & project',
    addLabel: 'Tambah project',
    create: () => ({ title: '', projectType: 'personal', category: '', description: '', year: new Date().getFullYear(), imageUrl: '', videoUrl: '', liveUrl: '', repoUrl: '', tech: [] }),
    fields: [
      {
        key: 'projectType',
        label: 'Tipe / Group Project',
        type: 'select',
        isWide: true,
        options: [
          { value: 'personal', label: 'Projek Pribadi' },
          { value: 'work', label: 'Projek Kantor' },
        ],
      },
      { key: 'title', label: 'Judul project', required: true },
      { key: 'category', label: 'Kategori' },
      { key: 'year', label: 'Tahun', type: 'number', min: 1900, max: 2200, required: true },
      { key: 'description', label: 'Deskripsi project', multiline: true },
      { key: 'imageUrl', label: 'Foto / Gambar preview (URL atau upload)', type: 'image' },
      { key: 'videoUrl', label: 'Video demo (URL atau upload MP4/WebM)', type: 'video' },
      { key: 'liveUrl', label: 'URL live demo (bisa dibuka langsung di iframe)', type: 'url' },
      { key: 'repoUrl', label: 'URL repository (GitHub dsb)', type: 'url' },
      { key: 'tech', label: 'Teknologi project' },
    ],
  },
]

const profileFields = [
  { key: 'name', label: 'Nama', required: true },
  { key: 'role', label: 'Peran / profesi', required: true },
  { key: 'headline', label: 'Headline / Judul besar Tentang (contoh: "Merangkai ide menjadi pengalaman digital yang bermakna.")', required: true },
  { key: 'location', label: 'Alamat / lokasi', required: true },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'website', label: 'Website', type: 'url' },
  { key: 'avatarUrl', label: 'Foto profil (URL atau upload ke MinIO)', type: 'image' },
  { key: 'resumeUrl', label: 'URL resume', type: 'url' },
  { key: 'githubUrl', label: 'URL GitHub', type: 'url' },
  { key: 'instagramUrl', label: 'URL Instagram', type: 'url' },
  { key: 'twitterUrl', label: 'URL Twitter', type: 'url' },
  { key: 'linkedinUrl', label: 'URL LinkedIn', type: 'url' },
  { key: 'about', label: 'Tentang saya', multiline: true, required: true },
]

async function responseError(response) {
  const message = await response.text()
  return message.trim() || `Server merespons ${response.status}`
}

function readableError(cause) {
  if (cause instanceof TypeError) {
    return `Backend tidak terhubung. Pastikan Go API aktif di localhost:3004. Detail: ${cause.message}`
  }
  return cause.message
}

function linesToText(lines = []) {
  return Array.isArray(lines) ? lines.join('\n') : ''
}

function textToLines(value) {
  return value.split('\n').map((line) => line.trim()).filter(Boolean)
}

function normalizePortfolio(value) {
  return {
    ...emptyPortfolio,
    ...value,
    profile: { ...emptyPortfolio.profile, ...value.profile },
    experiences: (value.experiences || []).map((item) => ({ ...item, endDate: item.endDate || '' })),
    education: (value.education || []).map((item) => ({ ...item, endDate: item.endDate || '' })),
    certifications: (value.certifications || []).map((item) => ({ ...item, issuedDate: item.issuedDate || '' })),
    texts: value.texts || {},
    skills: value.skills || [],
    techStack: value.techStack || [],
    projects: (value.projects || []).map((item) => ({
      ...item,
      projectType: item.projectType || 'work',
      videoUrl: item.videoUrl || '',
    })),
  }
}

export default function AdminPortal() {
  const [key, setKey] = useState(() => sessionStorage.getItem('portfolio-admin-key') || '')
  const [authenticated, setAuthenticated] = useState(false)
  const [activeAdminSection, setActiveAdminSection] = useState('admin-profile')
  const [collapsedItems, setCollapsedItems] = useState({})
  const [data, setData] = useState(emptyPortfolio)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [openGroups, setOpenGroups] = useState(() => {
    const all = {}
    uiTextFields.forEach((field) => { all[field.group] = true })
    return all
  })
  const [toast, setToast] = useState(null)
  const [justSaved, setJustSaved] = useState(false)
  const [parsingCV, setParsingCV] = useState(false)
  const [cvParseResult, setCvParseResult] = useState(null)
  const [showImportModal, setShowImportModal] = useState(false)

  const textGroups = [...new Set(uiTextFields.map((field) => field.group))]
  const adminNavItems = [
    { id: 'admin-profile', label: 'Profil', icon: UserRound },
    { id: 'admin-texts', label: 'Teks tampilan', icon: Type, count: textGroups.length },
    ...listSections.map((section) => ({
      id: `admin-${section.key}`,
      label: section.title,
      icon: {
        experiences: BriefcaseBusiness,
        education: GraduationCap,
        certifications: Award,
        skills: Lightbulb,
        techStack: Layers3,
        projects: FolderKanban,
      }[section.key],
      count: data[section.key].length,
    })),
  ]

  useEffect(() => {
    if (!authenticated) return undefined
    const sections = document.querySelectorAll('[data-admin-section]')
    const observer = new IntersectionObserver((entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visibleSections[0]) setActiveAdminSection(visibleSections[0].target.id)
    }, { rootMargin: '-18% 0px -68% 0px', threshold: 0 })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [authenticated])

  function toggleGroup(group) {
    setOpenGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }))
  }

  function expandAllGroups() {
    const all = {}
    textGroups.forEach((g) => { all[g] = true })
    setOpenGroups(all)
  }

  function collapseAllGroups() {
    setOpenGroups({})
  }

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => {
      setToast(null)
    }, 5000)
    return () => clearTimeout(timer)
  }, [toast])

  async function loadPortfolio(adminKey) {
    const json = await apiFetch('/api/portfolio', { cache: 'no-store' })
    setData(normalizePortfolio(json))
    setKey(adminKey)
    setAuthenticated(true)
  }

  useEffect(() => {
    const savedKey = sessionStorage.getItem('portfolio-admin-key')
    if (!savedKey) return
    apiFetch('/api/admin/auth', {
      method: 'POST',
      body: { key: savedKey },
    })
      .then(() => loadPortfolio(savedKey))
      .catch(() => {
        sessionStorage.removeItem('portfolio-admin-key')
        setKey('')
      })
  }, [])

  async function signIn(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await apiFetch('/api/admin/auth', {
        method: 'POST',
        body: { key },
      })
      sessionStorage.setItem('portfolio-admin-key', key)
      await loadPortfolio(key)
    } catch (cause) {
      setError(readableError(cause))
    } finally {
      setBusy(false)
    }
  }

  function updateProfile(field, value) {
    setData((current) => ({ ...current, profile: { ...current.profile, [field]: value } }))
  }

  function updateItem(section, index, field, value, isLines) {
    setData((current) => ({
      ...current,
      [section]: current[section].map((item, itemIndex) => itemIndex === index
        ? { ...item, [field]: isLines ? textToLines(value) : value }
        : item),
    }))
  }

  function addItem(section, create) {
    setData((current) => ({ ...current, [section]: [...current[section], create()] }))
  }

  function removeItem(section, index) {
    setData((current) => ({ ...current, [section]: current[section].filter((_, itemIndex) => itemIndex !== index) }))
    setCollapsedItems((current) => Object.fromEntries(
      Object.entries(current).filter(([itemKey]) => !itemKey.startsWith(`${section}:`)),
    ))
  }

  function toggleItem(section, index) {
    const itemKey = `${section}:${index}`
    setCollapsedItems((current) => ({ ...current, [itemKey]: !current[itemKey] }))
  }

  async function savePortfolio(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const payload = {
        ...data,
        experiences: data.experiences.map((item) => ({ ...item, endDate: item.endDate || null })),
        education: data.education.map((item) => ({ ...item, endDate: item.endDate || null })),
        certifications: data.certifications.map((item) => ({ ...item, issuedDate: item.issuedDate || null })),
      }
      await apiFetch('/api/admin/portfolio', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${key}`,
        },
        body: payload,
      })
      const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      setMessage('Semua perubahan berhasil disimpan.')
      setToast({
        type: 'success',
        title: 'Perubahan Berhasil Disimpan!',
        message: 'Semua data profil, teks tampilan, dan konten portofolio telah tersimpan ke database.',
        time: timeStr,
      })
      setJustSaved(true)
      setTimeout(() => setJustSaved(false), 3500)
      await loadPortfolio(key)
    } catch (cause) {
      const errText = readableError(cause)
      setError(errText)
      setToast({
        type: 'error',
        title: 'Gagal Menyimpan Perubahan',
        message: errText,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      })
    } finally {
      setBusy(false)
    }
  }

  function signOut() {
    sessionStorage.removeItem('portfolio-admin-key')
    setKey('')
    setAuthenticated(false)
    setData(emptyPortfolio)
    setMessage('')
    setError('')
  }

  async function handleCVUpload(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setParsingCV(true)
    setError('')
    try {
      const body = new FormData()
      body.append('file', file)
      const result = await apiFetch('/api/admin/parse-cv', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}` },
        body,
      })
      if (!result.success) throw new Error(result.message || 'Gagal mengekstrak CV')
      setCvParseResult({ ...result, filename: file.name })
      setShowImportModal(true)
    } catch (cause) {
      const errText = readableError(cause)
      setError(errText)
      setToast({
        type: 'error',
        title: 'Gagal Memproses File CV',
        message: errText,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      })
    } finally {
      setParsingCV(false)
    }
  }

  function applyCVData(options) {
    if (!cvParseResult?.found) return
    const { found } = cvParseResult
    setData((current) => {
      const next = { ...current }

      // 1. Profile: ONLY overwrite fields that are non-empty in CV!
      if (options.applyProfile && found.profile) {
        const nextProfile = { ...next.profile }
        for (const [k, v] of Object.entries(found.profile)) {
          if (typeof v === 'string' && v.trim() !== '') {
            nextProfile[k] = v.trim()
          }
        }
        next.profile = nextProfile
      }

      // 2. Experiences:
      if (options.applyExperiences && found.experiences?.length > 0) {
        if (options.mergeMode === 'append') {
          next.experiences = [...next.experiences, ...found.experiences]
        } else {
          next.experiences = found.experiences
        }
      }

      // 3. Education:
      if (options.applyEducation && found.education?.length > 0) {
        if (options.mergeMode === 'append') {
          next.education = [...next.education, ...found.education]
        } else {
          next.education = found.education
        }
      }

      // 4. Certifications:
      if (options.applyCertifications && found.certifications?.length > 0) {
        if (options.mergeMode === 'append') {
          next.certifications = [...next.certifications, ...found.certifications]
        } else {
          next.certifications = found.certifications
        }
      }

      // 5. Skills:
      if (options.applySkills && found.skills?.length > 0) {
        if (options.mergeMode === 'append') {
          next.skills = [...next.skills, ...found.skills]
        } else {
          next.skills = found.skills
        }
      }

      // 6. Tech Stack:
      if (options.applyTechStack && found.techStack?.length > 0) {
        if (options.mergeMode === 'append') {
          next.techStack = [...next.techStack, ...found.techStack]
        } else {
          next.techStack = found.techStack
        }
      }

      // 7. Projects:
      if (options.applyProjects && found.projects?.length > 0) {
        if (options.mergeMode === 'append') {
          next.projects = [...next.projects, ...found.projects]
        } else {
          next.projects = found.projects
        }
      }

      return normalizePortfolio(next)
    })

    setShowImportModal(false)
    setToast({
      type: 'success',
      title: '✓ Data CV Berhasil Diterapkan ke Formulir',
      message: 'Data yang terdeteksi dari CV telah dimasukkan ke form. Bagian yang tidak ada di CV tetap dipertahankan. Silakan periksa atau ubah, lalu klik tombol "SIMPAN SEMUA PERUBAHAN" di bawah untuk menyimpan ke database.',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    })
  }

  if (!authenticated) {
    return (
      <main className="admin-gate">
        <form className="admin-gate-card" onSubmit={signIn}>
          <a className="admin-back-link" href="/">← Kembali ke portfolio</a>
          <span className="admin-kicker">RUANG PERSONAL / 001</span>
          <h1>Masuk ke<br /><i>ruang editor.</i></h1>
          <p>Masukkan unique key untuk mengelola cerita dan informasi portfolio.</p>
          <label className="admin-field">
            <span>UNIQUE KEY</span>
            <input autoComplete="current-password" autoFocus type="password" value={key} onChange={(event) => setKey(event.target.value)} required />
          </label>
          {error && <p className="admin-error" role="alert">{error}</p>}
          <button className="admin-primary-button" type="submit" disabled={busy}>
            {busy ? 'MEMERIKSA…' : <>MASUK KE PORTAL <ArrowUpRight aria-hidden="true" size="1em" /></>}
          </button>
          <small>Key hanya disimpan sementara di tab browser ini.</small>
        </form>
      </main>
    )
  }

  return (
    <main className="admin-shell">
      {toast && (
        <aside className="admin-toast-portal">
          <div className={`admin-toast admin-toast-${toast.type}`} role="alert">
            <div className="admin-toast-icon">
              {toast.type === 'success' ? '✓' : '⚠'}
            </div>
            <div className="admin-toast-content">
              <div className="admin-toast-head">
                <strong>{toast.title}</strong>
                {toast.time && <small>{toast.time}</small>}
              </div>
              <p>{toast.message}</p>
            </div>
            <button
              type="button"
              className="admin-toast-close"
              onClick={() => setToast(null)}
              title="Tutup notifikasi"
            >
              ×
            </button>
          </div>
        </aside>
      )}

      <header className="admin-topbar">
        <a className="admin-back-link" href="/">← Lihat portfolio</a>
        <span className="admin-kicker">RUANG PERSONAL / EDITOR</span>
        <button className="admin-signout" type="button" onClick={signOut}>KELUAR</button>
      </header>
      <form className="admin-content" onSubmit={savePortfolio}>
        <div className="admin-editor-layout">
          <aside className="admin-sidebar">
            <div className="admin-sidebar-intro">
              <span className="admin-sidebar-eyebrow">RUANG EDITOR</span>
              <p>Atur isi portfolio</p>
            </div>
            <nav className="admin-sidebar-nav" aria-label="Navigasi editor portfolio">
              {adminNavItems.map(({ id, label, icon: Icon, count }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`admin-sidebar-link ${activeAdminSection === id ? 'is-active' : ''}`}
                  aria-current={activeAdminSection === id ? 'location' : undefined}
                  onClick={(event) => {
                    event.preventDefault()
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    setActiveAdminSection(id)
                  }}
                >
                  <Icon aria-hidden="true" size={16} strokeWidth={1.7} />
                  <span>{label}</span>
                  {count !== undefined && <small>{String(count).padStart(2, '0')}</small>}
                </a>
              ))}
            </nav>
            <div className="admin-sidebar-note">
              <span className="status-dot" />
              <span>Semua perubahan disimpan bersama</span>
            </div>
          </aside>

          <div className="admin-editor-main">
        <div className="admin-heading">
          <div><span className="admin-kicker">PORTFOLIO / CONTENT MANAGER</span><h1>Atur ceritamu.</h1><p>Semua bagian di bawah disimpan bersama dalam satu transaksi.</p></div>
          <button className={`admin-primary-button save-button ${justSaved ? 'is-saved' : ''}`} type="submit" disabled={busy}>
            {busy ? 'MENYIMPAN…' : justSaved ? '✓ BERHASIL DISIMPAN!' : <>SIMPAN PERUBAHAN <ArrowUpRight aria-hidden="true" size="1em" /></>}
          </button>
        </div>

        {/* Fitur impor CV disembunyikan sementara sampai alurnya siap.
        <div className="admin-auto-fill-card">
          <div className="auto-fill-info">
            <span className="auto-fill-spark">⚡</span>
            <div>
              <div className="auto-fill-title-row">
                <h3>Auto-Isi dari File CV / Resume</h3>
                <span className="auto-fill-badge">FITUR PINTAR</span>
              </div>
              <p>
                Unggah file CV Anda (PDF, DOCX, TXT, JSON). Sistem otomatis mengekstrak profil, pengalaman, pendidikan, dan keahlian Anda. <b>Sesuai permintaan Anda: data yang terdeteksi akan diisi, sedangkan bagian yang tidak ada di CV akan dibiarkan utuh tanpa menghapus data sebelumnya.</b>
              </p>
            </div>
          </div>
          <div className="auto-fill-actions">
            <label className={`admin-primary-button auto-fill-btn ${parsingCV ? 'is-busy' : ''}`}>
              {parsingCV ? '⏳ MEMPROSES CV…' : '📄 PILIH FILE CV / RESUME'}
              <input
                type="file"
                accept=".pdf,.docx,.txt,.json,.md"
                onChange={handleCVUpload}
                disabled={parsingCV || busy}
                hidden
              />
            </label>
          </div>
        </div>
        */}
        {message && <div className="admin-success" role="status">{message}</div>}
        {error && <div className="admin-error admin-notice" role="alert">{error}</div>}

        <section className="admin-section" id="admin-profile" data-admin-section>
          <div className="admin-section-heading"><span>01</span><div><h2>Profil</h2><p>Informasi utama yang tampil di sampul dan halaman tentang.</p></div></div>
          <div className="admin-form-grid">
            {profileFields.map((field) => (
              <EditorField adminKey={key} key={field.key} field={field} value={data.profile[field.key] || ''} onChange={(value) => updateProfile(field.key, value)} />
            ))}
          </div>
        </section>

        <section className="admin-section" id="admin-texts" data-admin-section>
          <div className="admin-section-heading">
            <span>02</span>
            <div className="admin-section-title-wrap">
              <div>
                <h2>Teks tampilan</h2>
                <p>Semua tulisan statis di header, sampul, daftar isi, halaman tentang, dan bagian lainnya. Kosongkan untuk kembali ke teks bawaan.</p>
              </div>
              <div className="admin-group-actions">
                <button type="button" className="admin-text-toggle-btn" onClick={expandAllGroups}>
                  Buka Semua ({textGroups.length})
                </button>
                <button type="button" className="admin-text-toggle-btn" onClick={collapseAllGroups}>
                  Tutup Semua
                </button>
              </div>
            </div>
          </div>

          {textGroups.map((group) => {
            const fieldsInGroup = uiTextFields.filter((field) => field.group === group)
            const isOpen = Boolean(openGroups[group])
            const customCount = fieldsInGroup.filter((f) => (data.texts[f.key] ?? '').trim().length > 0).length

            return (
              <div key={group} className={`admin-accordion-group ${isOpen ? 'is-open' : 'is-closed'}`}>
                <button
                  type="button"
                  className="admin-group-header-btn"
                  onClick={() => toggleGroup(group)}
                  aria-expanded={isOpen}
                >
                  <div className="admin-group-title-row">
                    <span className={`admin-group-chevron ${isOpen ? 'is-rotated' : ''}`}>▸</span>
                    <h3 className="admin-text-group">{group}</h3>
                    <span className="admin-group-pill">{fieldsInGroup.length} field</span>
                    {customCount > 0 && (
                      <span className="admin-group-custom-pill">
                        {customCount} diubah
                      </span>
                    )}
                  </div>
                  <span className="admin-group-hint">
                    {isOpen ? 'Tutup ▲' : 'Buka ▼'}
                  </span>
                </button>

                {isOpen && (
                  <div className="admin-group-body">
                    <div className="admin-form-grid">
                      {fieldsInGroup.map((field) => (
                        <EditorField
                          key={field.key}
                          field={{ key: field.key, label: field.label, multiline: field.value.includes('\n') }}
                          value={data.texts[field.key] ?? ''}
                          placeholder={defaultTexts[field.key]}
                          onChange={(value) => setData((current) => ({ ...current, texts: { ...current.texts, [field.key]: value } }))}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </section>

        {listSections.map((section, sectionIndex) => (
          <section className="admin-section" id={`admin-${section.key}`} data-admin-section key={section.key}>
            <div className="admin-section-heading"><span>{String(sectionIndex + 3).padStart(2, '0')}</span><div><h2>{section.title}</h2><p>Tambah, ubah, atau hapus entri yang ditampilkan di portfolio.</p></div></div>
            {section.key === 'techStack' ? (
              <TechStackEditor
                items={data.techStack}
                onChange={(techStack) => setData((current) => ({ ...current, techStack }))}
              />
            ) : (
              <>
                <div className="admin-item-list">
                  {data[section.key].map((item, index) => (
                    <article className={`admin-item-card ${collapsedItems[`${section.key}:${index}`] ? 'is-collapsed' : ''}`} key={`${section.key}-${index}`}>
                      <div className="admin-item-topline">
                        <button
                          className="admin-item-toggle"
                          type="button"
                          aria-expanded={!collapsedItems[`${section.key}:${index}`]}
                          aria-controls={`admin-item-${section.key}-${index}`}
                          onClick={() => toggleItem(section.key, index)}
                        >
                          <ChevronDown aria-hidden="true" size={16} />
                          <span>ENTRI {String(index + 1).padStart(2, '0')}</span>
                          <strong>{item.title || item.company || item.institution || item.name || item.category || section.title}</strong>
                          {section.key === 'projects' && (
                            <span className={`admin-type-badge ${item.projectType === 'personal' ? 'is-personal' : 'is-work'}`}>
                              {item.projectType === 'personal' ? 'PRIBADI' : 'KANTOR'}
                            </span>
                          )}
                        </button>
                        <button className="admin-remove-button" type="button" onClick={() => removeItem(section.key, index)}>HAPUS ×</button>
                      </div>
                      <div
                        className="admin-form-grid"
                        id={`admin-item-${section.key}-${index}`}
                        hidden={Boolean(collapsedItems[`${section.key}:${index}`])}
                      >
                        {section.fields.map((field) => (
                          section.key === 'projects' && field.key === 'tech' ? (
                            <ProjectTechEditor
                              key={field.key}
                              label={field.label}
                              items={item.tech || []}
                              onChange={(tech) => updateItem(section.key, index, 'tech', tech)}
                            />
                          ) : (
                            <EditorField adminKey={key} key={field.key} field={field} value={field.lines ? linesToText(item[field.key]) : (item[field.key] ?? '')} onChange={(value) => updateItem(section.key, index, field.key, value, field.lines)} />
                          )
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
                <button className="admin-add-button" type="button" onClick={() => addItem(section.key, section.create)}>＋ {section.addLabel}</button>
              </>
            )}
          </section>
        ))}

        <div className="admin-bottom-save">
          <span>PERUBAHAN BELUM TERSIMPAN AKAN HILANG SAAT HALAMAN DITUTUP.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {justSaved && <span className="admin-save-indicator">✓ Data telah tersimpan</span>}
            <button className={`admin-primary-button ${justSaved ? 'is-saved' : ''}`} type="submit" disabled={busy}>
              {busy ? 'MENYIMPAN…' : justSaved ? '✓ BERHASIL DISIMPAN!' : <>SIMPAN SEMUA PERUBAHAN <ArrowUpRight aria-hidden="true" size="1em" /></>}
            </button>
          </div>
        </div>
          </div>
        </div>
      </form>
      {showImportModal && cvParseResult && (
        <CVImportModal
          result={cvParseResult}
          onClose={() => setShowImportModal(false)}
          onApply={applyCVData}
        />
      )}
    </main>
  )
}

const suggestedTechCategories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Cloud', 'Tools', 'Lainnya']

function TechStackEditor({ items, onChange }) {
  const [newCategory, setNewCategory] = useState(suggestedTechCategories[0])
  const [collapsedCategories, setCollapsedCategories] = useState({})
  const categories = [...new Set([
    ...suggestedTechCategories,
    ...items.map((item) => item.category).filter(Boolean),
    newCategory,
  ])]
  const groups = items.reduce((result, item, index) => {
    const category = item.category || ''
    let group = result.find((entry) => entry.category === category)
    if (!group) {
      group = { category, entries: [] }
      result.push(group)
    }
    group.entries.push({ item, index })
    return result
  }, [])

  function addTechnology(category) {
    onChange([...items, { name: '', category }])
  }

  function updateTechnology(index, name) {
    onChange(items.map((item, itemIndex) => itemIndex === index ? { ...item, name } : item))
  }

  function removeTechnology(index) {
    onChange(items.filter((_, itemIndex) => itemIndex !== index))
  }

  function updateCategory(currentCategory, nextCategory) {
    onChange(items.map((item) => (item.category || '') === currentCategory
      ? { ...item, category: nextCategory }
      : item))
  }

  function removeCategory(category) {
    onChange(items.filter((item) => (item.category || '') !== category))
  }

  return (
    <div className="admin-tech-editor">
      <div className="admin-tech-toolbar">
        <p>Setiap teknologi tampil sebagai label. Pilih kategori, lalu tambah, ubah, atau hapus label satu per satu.</p>
        <div className="admin-tech-add-control">
          <label className="admin-tech-category-picker">
            <span>KATEGORI</span>
            <select className="admin-select" value={newCategory} onChange={(event) => setNewCategory(event.target.value)}>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>
          <button className="admin-add-button" type="button" onClick={() => addTechnology(newCategory)}>＋ Tambah label</button>
        </div>
      </div>

      {groups.length > 0 ? (
        <div className="admin-tech-groups">
          {groups.map((group, groupIndex) => (
            <section className="admin-tech-group-card" key={group.category || 'uncategorized'}>
              <header className="admin-tech-group-header">
                <label className="admin-tech-category-picker">
                  <span>KATEGORI / GRUP {String(groupIndex + 1).padStart(2, '0')}</span>
                  <select
                    className="admin-select"
                    value={group.category}
                    onChange={(event) => updateCategory(group.category, event.target.value)}
                    aria-label={`Kategori grup ${groupIndex + 1}`}
                    required
                  >
                    <option value="">Pilih kategori</option>
                    {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                </label>
                <div className="admin-tech-group-actions">
                  <span>{group.entries.length} label</span>
                  <button
                    type="button"
                    className="admin-tech-toggle"
                    aria-expanded={!collapsedCategories[group.category]}
                    aria-controls={`admin-tech-group-${groupIndex}`}
                    onClick={() => setCollapsedCategories((current) => ({
                      ...current,
                      [group.category]: !current[group.category],
                    }))}
                  >
                    <ChevronDown aria-hidden="true" size={15} />
                    {collapsedCategories[group.category] ? 'Buka' : 'Tutup'}
                  </button>
                  <button
                    type="button"
                    className="admin-tech-delete-group"
                    onClick={() => removeCategory(group.category)}
                    aria-label={`Hapus semua teknologi kategori ${group.category || 'tanpa kategori'}`}
                    title="Hapus semua label dalam kategori ini"
                  >
                    Hapus grup ×
                  </button>
                </div>
              </header>
              <div
                className="admin-tech-chip-list"
                id={`admin-tech-group-${groupIndex}`}
                hidden={Boolean(collapsedCategories[group.category])}
              >
                {group.entries.map(({ item, index }) => (
                  <div className="admin-tech-chip" key={`${group.category}-${index}`}>
                    <span aria-hidden="true">•</span>
                    <input
                      value={item.name}
                      onChange={(event) => updateTechnology(index, event.target.value)}
                      placeholder="Nama teknologi"
                      aria-label={`Nama teknologi ${index + 1}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeTechnology(index)}
                      aria-label={`Hapus teknologi ${item.name || index + 1}`}
                      title="Hapus teknologi"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {group.entries.length === 0 && <p className="admin-tech-empty-group">Belum ada label teknologi di grup ini.</p>}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="admin-tech-empty">
          <strong>Belum ada teknologi.</strong>
          <span>Pilih kategori di atas, lalu tekan “Tambah label” untuk mulai.</span>
        </div>
      )}
    </div>
  )
}

function ProjectTechEditor({ label, items = [], onChange }) {
  const [draft, setDraft] = useState('')

  function addTechnology() {
    const name = draft.trim()
    if (!name) return
    onChange([...items, name])
    setDraft('')
  }

  function updateTechnology(index, name) {
    onChange(items.map((item, itemIndex) => itemIndex === index ? name : item))
  }

  function removeTechnology(index) {
    onChange(items.filter((_, itemIndex) => itemIndex !== index))
  }

  return (
    <div className="admin-project-tech-field is-wide">
      <span className="admin-project-tech-label">{label}</span>
      <p>Tambahkan setiap teknologi sebagai label terpisah; klik × untuk menghapusnya.</p>
      <div className="admin-project-tech-list">
        {items.map((item, index) => (
          <div className="admin-project-tech-chip" key={`${item}-${index}`}>
            <span aria-hidden="true">{item.trim().slice(0, 2).toUpperCase() || '•'}</span>
            <input
              value={item}
              onChange={(event) => updateTechnology(index, event.target.value)}
              placeholder="Nama teknologi"
              aria-label={`Teknologi project ${index + 1}`}
            />
            <button
              type="button"
              onClick={() => removeTechnology(index)}
              aria-label={`Hapus teknologi ${item || index + 1}`}
              title="Hapus teknologi"
            >
              ×
            </button>
          </div>
        ))}
        {items.length === 0 && <span className="admin-project-tech-empty">Belum ada teknologi ditambahkan.</span>}
      </div>
      <div className="admin-project-tech-add">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              addTechnology()
            }
          }}
          placeholder="Contoh: React, Go, PostgreSQL"
          aria-label="Teknologi baru"
        />
        <button type="button" onClick={addTechnology} disabled={!draft.trim()}>＋ Tambah teknologi</button>
      </div>
    </div>
  )
}

function MediaField({ field, value, onChange, adminKey }) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const isVideo = field.type === 'video'
  const acceptTypes = isVideo
    ? 'video/mp4,video/webm,video/quicktime,video/ogg'
    : 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml'

  async function upload(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setUploading(true)
    setUploadError('')
    try {
      const body = new FormData()
      body.append('file', file)
      const result = await apiFetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminKey}` },
        body,
      })
      onChange(result.url)
    } catch (cause) {
      setUploadError(readableError(cause))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="admin-field is-wide">
      <span>{field.label}</span>
      <div className="admin-image-row">
        {value && (
          isVideo ? (
            <video className="admin-video-preview" src={resolveMediaUrl(value)} controls muted playsInline />
          ) : (
            <img className="admin-image-preview" src={resolveMediaUrl(value)} alt="" />
          )
        )}
        <input
          type="text"
          value={value}
          placeholder={isVideo ? 'https://… atau upload video (MP4, WebM)' : 'https://… atau upload gambar (JPG, PNG, WebP)'}
          onChange={(event) => onChange(event.target.value)}
        />
        <label className="admin-upload-button">
          {uploading ? 'MENGUNGGAH…' : isVideo ? 'UPLOAD VIDEO' : 'UPLOAD FOTO'}
          <input type="file" accept={acceptTypes} onChange={upload} disabled={uploading} hidden />
        </label>
      </div>
      {uploadError && <div className="admin-error admin-notice" role="alert">{uploadError}</div>}
    </div>
  )
}

function EditorField({ field, value, onChange, placeholder, adminKey }) {
  if (field.type === 'image' || field.type === 'video') {
    return <MediaField field={field} value={value} onChange={onChange} adminKey={adminKey} />
  }
  if (field.type === 'select') {
    return (
      <label className={`admin-field ${field.isWide ? 'is-wide' : ''}`}>
        <span>{field.label}{field.required ? ' *' : ''}</span>
        <select
          value={value || field.options?.[0]?.value || ''}
          onChange={(event) => onChange(event.target.value)}
          className="admin-select"
        >
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </label>
    )
  }
  return (
    <label className={`admin-field ${field.key === 'about' || field.multiline ? 'is-wide' : ''}`}>
      <span>{field.label}{field.required ? ' *' : ''}</span>
      {field.multiline ? (
        <textarea value={value} placeholder={placeholder} required={field.required} rows={field.key === 'about' || field.key === 'description' ? 4 : 3} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input
          type={field.type || 'text'}
          value={value}
          placeholder={placeholder}
          required={field.required}
          min={field.min}
          max={field.max}
          step={field.type === 'number' ? 1 : undefined}
          onChange={(event) => onChange(field.type === 'number' ? Number(event.target.value) : event.target.value)}
        />
      )}
    </label>
  )
}

function CVImportModal({ result, onClose, onApply }) {
  const { found, summary, filename } = result
  const [applyProfile, setApplyProfile] = useState(true)
  const [applyExperiences, setApplyExperiences] = useState(Boolean(summary.experiencesCount > 0))
  const [applyEducation, setApplyEducation] = useState(Boolean(summary.educationCount > 0))
  const [applyCertifications, setApplyCertifications] = useState(Boolean(summary.certificationsCount > 0))
  const [applySkills, setApplySkills] = useState(Boolean(summary.skillsCount > 0))
  const [applyTechStack, setApplyTechStack] = useState(Boolean(summary.techStackCount > 0))
  const [applyProjects, setApplyProjects] = useState(Boolean(summary.projectsCount > 0))
  const [mergeMode, setMergeMode] = useState('replace')

  const handleApply = (e) => {
    e.preventDefault()
    onApply({
      applyProfile,
      applyExperiences,
      applyEducation,
      applyCertifications,
      applySkills,
      applyTechStack,
      applyProjects,
      mergeMode,
    })
  }

  return (
    <div className="admin-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
        <header className="admin-modal-header">
          <div>
            <span className="admin-modal-kicker">AUTO-ISI DARI FILE CV / RESUME</span>
            <h2>Hasil Ekstraksi Dokumen</h2>
            <p className="admin-modal-sub">File: <b>{filename}</b></p>
          </div>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Tutup">
            ✕
          </button>
        </header>

        <div className="admin-modal-notice">
          <span className="admin-modal-notice-icon">💡</span>
          <p>
            <b>Prinsip Otomatisasi:</b> Hanya data yang berhasil ditemukan di file CV yang akan diisikan ke formulir. Bagian atau field yang <u>tidak ditemukan</u> di CV akan tetap dibiarkan seperti saat ini (tidak akan terhapus).
          </p>
        </div>

        <div className="admin-modal-stats">
          <div className="stat-pill">
            <span>Profil</span>
            <b>{summary.fieldsFound?.length || 0} field</b>
          </div>
          <div className="stat-pill">
            <span>Pengalaman</span>
            <b>{summary.experiencesCount} entri</b>
          </div>
          <div className="stat-pill">
            <span>Pendidikan</span>
            <b>{summary.educationCount} entri</b>
          </div>
          <div className="stat-pill">
            <span>Sertifikasi</span>
            <b>{summary.certificationsCount} entri</b>
          </div>
          <div className="stat-pill">
            <span>Keahlian & Stack</span>
            <b>{summary.skillsCount} item</b>
          </div>
          <div className="stat-pill">
            <span>Project</span>
            <b>{summary.projectsCount} entri {summary.projectsCount === 0 ? '(projek lama aman)' : ''}</b>
          </div>
        </div>

        <div className="admin-modal-body">
          <h3 className="options-title">Pilih Bagian yang Ingin Diterapkan:</h3>

          <div className="admin-section-options">
            <label className={`import-option-item ${summary.fieldsFound?.length > 0 ? '' : 'is-disabled'}`}>
              <input
                type="checkbox"
                checked={applyProfile}
                onChange={(e) => setApplyProfile(e.target.checked)}
                disabled={!summary.fieldsFound || summary.fieldsFound.length === 0}
              />
              <div className="option-desc">
                <strong>Profil Utama ({summary.fieldsFound?.length || 0} field terdeteksi)</strong>
                <p>
                  {found.profile.name && <span>Nama: <b>{found.profile.name}</b> · </span>}
                  {found.profile.role && <span>Peran: <b>{found.profile.role}</b> · </span>}
                  {found.profile.email && <span>Email: <b>{found.profile.email}</b> · </span>}
                  {found.profile.location && <span>Lokasi: <b>{found.profile.location}</b></span>}
                </p>
                <small className="option-safe-hint">
                  ✓ Field profil lain (seperti foto avatar atau link khusus) yang tidak ada di CV tidak akan ditimpa.
                </small>
              </div>
            </label>

            <label className={`import-option-item ${summary.experiencesCount > 0 ? '' : 'is-disabled'}`}>
              <input
                type="checkbox"
                checked={applyExperiences}
                onChange={(e) => setApplyExperiences(e.target.checked)}
                disabled={summary.experiencesCount === 0}
              />
              <div className="option-desc">
                <strong>Pengalaman Kerja ({summary.experiencesCount} entri)</strong>
                {summary.experiencesCount > 0 ? (
                  <p>{found.experiences.map((exp) => exp.company).join(', ')}</p>
                ) : (
                  <p className="not-found-text">Tidak ditemukan di file CV (pengalaman lama tidak akan diubah)</p>
                )}
              </div>
            </label>

            <label className={`import-option-item ${summary.educationCount > 0 ? '' : 'is-disabled'}`}>
              <input
                type="checkbox"
                checked={applyEducation}
                onChange={(e) => setApplyEducation(e.target.checked)}
                disabled={summary.educationCount === 0}
              />
              <div className="option-desc">
                <strong>Pendidikan ({summary.educationCount} entri)</strong>
                {summary.educationCount > 0 ? (
                  <p>{found.education.map((edu) => `${edu.institution} (${edu.degree})`).join(', ')}</p>
                ) : (
                  <p className="not-found-text">Tidak ditemukan di file CV (pendidikan lama tidak akan diubah)</p>
                )}
              </div>
            </label>

            <label className={`import-option-item ${summary.certificationsCount > 0 ? '' : 'is-disabled'}`}>
              <input
                type="checkbox"
                checked={applyCertifications}
                onChange={(e) => setApplyCertifications(e.target.checked)}
                disabled={summary.certificationsCount === 0}
              />
              <div className="option-desc">
                <strong>Sertifikasi ({summary.certificationsCount} entri)</strong>
                {summary.certificationsCount > 0 ? (
                  <p>{found.certifications.map((cert) => cert.name).join(', ')}</p>
                ) : (
                  <p className="not-found-text">Tidak ditemukan di file CV (sertifikasi lama tidak akan diubah)</p>
                )}
              </div>
            </label>

            <label className={`import-option-item ${summary.skillsCount > 0 ? '' : 'is-disabled'}`}>
              <input
                type="checkbox"
                checked={applySkills}
                onChange={(e) => {
                  setApplySkills(e.target.checked)
                  setApplyTechStack(e.target.checked)
                }}
                disabled={summary.skillsCount === 0}
              />
              <div className="option-desc">
                <strong>Keahlian & Tech Stack ({summary.skillsCount} item)</strong>
                {summary.skillsCount > 0 ? (
                  <p>
                    {found.skills.slice(0, 10).map((s) => s.name).join(', ')}
                    {found.skills.length > 10 ? ` ...dan ${found.skills.length - 10} lainnya` : ''}
                  </p>
                ) : (
                  <p className="not-found-text">Tidak ditemukan di file CV (keahlian lama tidak akan diubah)</p>
                )}
              </div>
            </label>

            <label className={`import-option-item ${summary.projectsCount > 0 ? '' : 'is-disabled'}`}>
              <input
                type="checkbox"
                checked={applyProjects}
                onChange={(e) => setApplyProjects(e.target.checked)}
                disabled={summary.projectsCount === 0}
              />
              <div className="option-desc">
                <strong>Karya & Project ({summary.projectsCount} entri)</strong>
                {summary.projectsCount > 0 ? (
                  <p>{found.projects.map((p) => p.title).join(', ')}</p>
                ) : (
                  <p className="not-found-text">
                    Tidak ditemukan di CV — Semua project kantor & pribadi Anda saat ini tetap aman dan utuh!
                  </p>
                )}
              </div>
            </label>
          </div>

          {(summary.experiencesCount > 0 || summary.educationCount > 0 || summary.skillsCount > 0) && (
            <div className="import-mode-section">
              <span>Metode Pengisian Daftar (List):</span>
              <div className="import-mode-radios">
                <label>
                  <input
                    type="radio"
                    name="mergeMode"
                    value="replace"
                    checked={mergeMode === 'replace'}
                    onChange={(e) => setMergeMode(e.target.value)}
                  />
                  <span>Gantikan data lama di seksi yang dipilih dengan daftar baru dari CV</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="mergeMode"
                    value="append"
                    checked={mergeMode === 'append'}
                    onChange={(e) => setMergeMode(e.target.value)}
                  />
                  <span>Tambahkan ke daftar yang sudah ada (gabungkan)</span>
                </label>
              </div>
            </div>
          )}
        </div>

        <footer className="admin-modal-footer">
          <button type="button" className="button button-outline" onClick={onClose}>
            Batal
          </button>
          <button type="button" className="admin-primary-button" onClick={handleApply}>
            ✓ TERAPKAN KE FORMULIR
          </button>
        </footer>
      </div>
    </div>
  )
}
