import { useEffect, useState } from 'react'
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
    create: () => ({ name: '', category: '' }),
    fields: [
      { key: 'name', label: 'Nama teknologi', required: true },
      { key: 'category', label: 'Kategori', required: true },
    ],
  },
  {
    key: 'projects',
    title: 'Karya & project',
    addLabel: 'Tambah project',
    create: () => ({ title: '', category: '', description: '', year: new Date().getFullYear(), imageUrl: '', liveUrl: '', repoUrl: '', tech: [] }),
    fields: [
      { key: 'title', label: 'Judul project', required: true },
      { key: 'category', label: 'Kategori' },
      { key: 'year', label: 'Tahun', type: 'number', min: 1900, max: 2200, required: true },
      { key: 'description', label: 'Deskripsi', multiline: true },
      { key: 'imageUrl', label: 'Gambar preview (URL atau upload ke MinIO)', type: 'image' },
      { key: 'liveUrl', label: 'URL live', type: 'url' },
      { key: 'repoUrl', label: 'URL repository', type: 'url' },
      { key: 'tech', label: 'Teknologi (satu per baris)', lines: true, multiline: true },
    ],
  },
]

const profileFields = [
  { key: 'name', label: 'Nama', required: true },
  { key: 'role', label: 'Peran / profesi', required: true },
  { key: 'headline', label: 'Headline', required: true },
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
    projects: value.projects || [],
  }
}

export default function AdminPortal() {
  const [key, setKey] = useState(() => sessionStorage.getItem('portfolio-admin-key') || '')
  const [authenticated, setAuthenticated] = useState(false)
  const [data, setData] = useState(emptyPortfolio)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function loadPortfolio(adminKey) {
    const response = await fetch('/api/portfolio', { cache: 'no-store' })
    if (!response.ok) throw new Error(await responseError(response))
    setData(normalizePortfolio(await response.json()))
    setKey(adminKey)
    setAuthenticated(true)
  }

  useEffect(() => {
    const savedKey = sessionStorage.getItem('portfolio-admin-key')
    if (!savedKey) return
    fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: savedKey }),
    }).then((response) => {
      if (!response.ok) throw new Error('Key sudah tidak berlaku')
      return loadPortfolio(savedKey)
    }).catch(() => {
      sessionStorage.removeItem('portfolio-admin-key')
      setKey('')
    })
  }, [])

  async function signIn(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      })
      if (!response.ok) throw new Error(await responseError(response))
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
      const response = await fetch('/api/admin/portfolio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error(await responseError(response))
      setMessage('Semua perubahan berhasil disimpan.')
      await loadPortfolio(key)
    } catch (cause) {
      setError(readableError(cause))
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
          <button className="admin-primary-button" type="submit" disabled={busy}>{busy ? 'MEMERIKSA…' : 'MASUK KE PORTAL ↗'}</button>
          <small>Key hanya disimpan sementara di tab browser ini.</small>
        </form>
      </main>
    )
  }

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <a className="admin-back-link" href="/">← Lihat portfolio</a>
        <span className="admin-kicker">RUANG PERSONAL / EDITOR</span>
        <button className="admin-signout" type="button" onClick={signOut}>KELUAR</button>
      </header>
      <form className="admin-content" onSubmit={savePortfolio}>
        <div className="admin-heading">
          <div><span className="admin-kicker">PORTFOLIO / CONTENT MANAGER</span><h1>Atur ceritamu.</h1><p>Semua bagian di bawah disimpan bersama dalam satu transaksi.</p></div>
          <button className="admin-primary-button save-button" type="submit" disabled={busy}>{busy ? 'MENYIMPAN…' : 'SIMPAN PERUBAHAN ↗'}</button>
        </div>
        {message && <div className="admin-success" role="status">{message}</div>}
        {error && <div className="admin-error admin-notice" role="alert">{error}</div>}

        <section className="admin-section">
          <div className="admin-section-heading"><span>01</span><div><h2>Profil</h2><p>Informasi utama yang tampil di sampul dan halaman tentang.</p></div></div>
          <div className="admin-form-grid">
            {profileFields.map((field) => (
              <EditorField adminKey={key} key={field.key} field={field} value={data.profile[field.key] || ''} onChange={(value) => updateProfile(field.key, value)} />
            ))}
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-heading"><span>02</span><div><h2>Teks tampilan</h2><p>Semua tulisan statis di header, sampul, daftar isi, dan penutup. Kosongkan untuk kembali ke teks bawaan.</p></div></div>
          {[...new Set(uiTextFields.map((field) => field.group))].map((group) => (
            <div key={group}>
              <h3 className="admin-text-group">{group}</h3>
              <div className="admin-form-grid">
                {uiTextFields.filter((field) => field.group === group).map((field) => (
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
          ))}
        </section>

        {listSections.map((section, sectionIndex) => (
          <section className="admin-section" key={section.key}>
            <div className="admin-section-heading"><span>{String(sectionIndex + 3).padStart(2, '0')}</span><div><h2>{section.title}</h2><p>Tambah, ubah, atau hapus entri yang ditampilkan di portfolio.</p></div></div>
            <div className="admin-item-list">
              {data[section.key].map((item, index) => (
                <article className="admin-item-card" key={`${section.key}-${index}`}>
                  <div className="admin-item-topline"><span>ENTRI {String(index + 1).padStart(2, '0')}</span><button className="admin-remove-button" type="button" onClick={() => removeItem(section.key, index)}>HAPUS ×</button></div>
                  <div className="admin-form-grid">
                    {section.fields.map((field) => (
                      <EditorField adminKey={key} key={field.key} field={field} value={field.lines ? linesToText(item[field.key]) : (item[field.key] ?? '')} onChange={(value) => updateItem(section.key, index, field.key, value, field.lines)} />
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <button className="admin-add-button" type="button" onClick={() => addItem(section.key, section.create)}>＋ {section.addLabel}</button>
          </section>
        ))}

        <div className="admin-bottom-save"><span>PERUBAHAN BELUM TERSIMPAN AKAN HILANG SAAT HALAMAN DITUTUP.</span><button className="admin-primary-button" type="submit" disabled={busy}>{busy ? 'MENYIMPAN…' : 'SIMPAN SEMUA PERUBAHAN ↗'}</button></div>
      </form>
    </main>
  )
}

function ImageField({ field, value, onChange, adminKey }) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  async function upload(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setUploading(true)
    setUploadError('')
    try {
      const body = new FormData()
      body.append('file', file)
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminKey}` },
        body,
      })
      if (!response.ok) throw new Error(await responseError(response))
      onChange((await response.json()).url)
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
        {value && <img className="admin-image-preview" src={value} alt="" />}
        <input type="text" value={value} placeholder="https://… atau hasil upload" onChange={(event) => onChange(event.target.value)} />
        <label className="admin-upload-button">
          {uploading ? 'MENGUNGGAH…' : 'UPLOAD'}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={upload} disabled={uploading} hidden />
        </label>
      </div>
      {uploadError && <div className="admin-error admin-notice" role="alert">{uploadError}</div>}
    </div>
  )
}

function EditorField({ field, value, onChange, placeholder, adminKey }) {
  if (field.type === 'image') return <ImageField field={field} value={value} onChange={onChange} adminKey={adminKey} />
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
