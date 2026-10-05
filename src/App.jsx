import { useEffect, useMemo, useState } from 'react'

const pages = [
  { id: 'about', label: 'Tentang', number: '01' },
  { id: 'journey', label: 'Perjalanan', number: '02' },
  { id: 'work', label: 'Karya pilihan', number: '03' },
  { id: 'skills', label: 'Keahlian', number: '04' },
  { id: 'education', label: 'Pendidikan', number: '05' },
]

function App() {
  const [portfolio, setPortfolio] = useState(null)
  const [error, setError] = useState('')
  const [active, setActive] = useState(0)
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/portfolio', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Server merespons ${response.status}`)
        return response.json()
      })
      .then(setPortfolio)
      .catch((cause) => {
        if (cause.name !== 'AbortError') setError(cause.message)
      })
    return () => controller.abort()
  }, [])

  const groupedSkills = useMemo(() => {
    if (!portfolio) return []
    return Object.entries(
      portfolio.skills.reduce((groups, item) => {
        groups[item.category] ??= []
        groups[item.category].push(item)
        return groups
      }, {}),
    )
  }, [portfolio])

  function turnPage(index) {
    setActive(Math.max(0, Math.min(pages.length - 1, index)))
    setOpened(true)
  }

  if (error) {
    return (
      <main className="state-screen">
        <div className="state-card">
          <span className="eyebrow">BUKU BELUM BISA DIBUKA</span>
          <h1>Ada yang perlu diperiksa.</h1>
          <p>Data portofolio gagal dimuat dari server. Coba muat ulang beberapa saat lagi.</p>
          <button className="button button-dark" onClick={() => window.location.reload()}>Muat ulang</button>
          <small className="error-detail">{error}</small>
        </div>
      </main>
    )
  }

  if (!portfolio) {
    return <main className="state-screen"><div className="loading-book"><span className="book-mark">✳</span><p>Menyiapkan halaman cerita...</p></div></main>
  }

  const { profile, experiences, education, projects, techStack } = portfolio
  const currentPage = pages[active]

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#home" onClick={() => { setOpened(false); setActive(0) }} aria-label="Kembali ke sampul">
          <span className="brand-mark">✳</span><span>CATATAN<br />PERJALANAN</span>
        </a>
        <div className="topbar-note"><span className="status-dot" /> PORTFOLIO DIGITAL <span className="topbar-divider">/</span> EDISI 2025</div>
        <a className="contact-link" href={`mailto:${profile.email}`}>Sapa saya <span aria-hidden="true">↗</span></a>
      </header>

      {!opened ? (
        <section id="home" className="cover-stage">
          <div className="cover-caption"><span>SEBUAH BUKU TENTANG</span><span>IDE, PROSES &amp; PERJALANAN</span></div>
          <button className="book-cover" onClick={() => setOpened(true)} aria-label="Buka buku portofolio">
            <span className="cover-spine" />
            <span className="cover-topline">PORTFOLIO / VOL. 01 <span>2025—NOW</span></span>
            <span className="cover-star">✳</span>
            <span className="cover-title">The<br /><i>making</i><br />of things.</span>
            <span className="cover-bottom">
              <span><b>{profile.name}</b><small>{profile.role}</small></span>
              <span className="cover-open">BUKA BUKU <b>↗</b></span>
            </span>
          </button>
          <div className="cover-aside"><span className="vertical-label">SCROLL SLOWLY, STAY AWHILE</span><span className="aside-line" /></div>
          <div className="cover-footer"><span>{profile.location}</span><span>01 — 05 <span className="footer-spark">✳</span></span></div>
        </section>
      ) : (
        <div className="reading-layout">
          <aside className="chapter-rail">
            <button className="back-cover" onClick={() => setOpened(false)} aria-label="Kembali ke sampul">← <span>SAMPUL</span></button>
            <span className="rail-label">DAFTAR ISI</span>
            <nav aria-label="Daftar isi buku">
              {pages.map((page, index) => (
                <button key={page.id} className={`chapter-link ${active === index ? 'is-active' : ''}`} onClick={() => turnPage(index)}>
                  <span>{page.number}</span>{page.label}
                </button>
              ))}
            </nav>
            <div className="rail-bottom"><span className="book-mark">✳</span><span>VOL. 01<br />2025—NOW</span></div>
          </aside>
          <section className="page-wrap" key={currentPage.id}>
            <div className="page-topline"><span>CATATAN PERJALANAN</span><span>{currentPage.number} <i>/</i> 05</span></div>
            <div className="page-content">
              {active === 0 && <AboutPage profile={profile} onNext={() => turnPage(1)} />}
              {active === 1 && <JourneyPage experiences={experiences} />}
              {active === 2 && <WorkPage projects={projects} />}
              {active === 3 && <SkillsPage groups={groupedSkills} techStack={techStack} />}
              {active === 4 && <EducationPage education={education} profile={profile} />}
            </div>
            <footer className="page-footer">
              <span>{profile.location}</span>
              <div className="page-controls">
                <button onClick={() => turnPage(active - 1)} disabled={active === 0} aria-label="Halaman sebelumnya">←</button>
                <span>{currentPage.number} <i>/</i> 05</span>
                <button onClick={() => turnPage(active + 1)} disabled={active === pages.length - 1} aria-label="Halaman berikutnya">→</button>
              </div>
            </footer>
          </section>
        </div>
      )}
    </main>
  )
}

function AboutPage({ profile, onNext }) {
  return (
    <article className="page page-about">
      <div className="section-kicker"><span>01 / TENTANG SAYA</span><span className="kicker-line" /></div>
      <div className="about-grid">
        <div className="about-copy">
          <p className="chapter-intro">Halo, saya <span>{profile.name.split(' ')[0]}.</span></p>
          <h1>{profile.headline}</h1>
          <p className="body-copy">{profile.about}</p>
          <button className="text-button" onClick={onNext}>Lihat perjalanan saya <span>↗</span></button>
        </div>
        <div className="portrait-card">
          {profile.avatarUrl ? <img src={profile.avatarUrl} alt={`Potret ${profile.name}`} /> : <div className="portrait-placeholder"><span>{profile.name.split(' ').map((word) => word[0]).slice(0, 2).join('')}</span><i>Ganti foto<br />profil Anda</i></div>}
          <span className="portrait-index">FIG. 01 — A WORK IN PROGRESS</span>
          <span className="portrait-stamp">OPEN<br />TO IDEAS</span>
        </div>
      </div>
      <div className="about-meta">
        <div><span>BERBASIS DI</span><b>{profile.location}</b></div>
        <div><span>FOKUS</span><b>{profile.role}</b></div>
        <div><span>EMAIL</span><a href={`mailto:${profile.email}`}>{profile.email} ↗</a></div>
        {profile.website && <div><span>WEBSITE</span><a href={profile.website} target="_blank" rel="noreferrer">Kunjungi ↗</a></div>}
        {profile.resumeUrl && <div><span>RESUME</span><a href={profile.resumeUrl} target="_blank" rel="noreferrer">Lihat resume ↗</a></div>}
      </div>
      <div className="margin-note">CATATAN<br />01 — 05</div>
    </article>
  )
}

function JourneyPage({ experiences }) {
  return (
    <article className="page">
      <div className="section-kicker"><span>02 / JEJAK LANGKAH</span><span className="kicker-line" /></div>
      <div className="heading-row"><div><p className="chapter-intro">Setiap langkah,</p><h1>membentuk cerita.</h1></div><span className="chapter-count">{String(experiences.length).padStart(2, '0')}<small> BAB</small></span></div>
      <div className="timeline">
        {experiences.map((item, index) => (
          <div className="timeline-item" key={item.id}>
            <div className="timeline-date">{formatDate(item.startDate)}<br /><span>{item.endDate ? formatDate(item.endDate) : 'SEKARANG'}</span></div>
            <div className="timeline-marker"><span>{String(index + 1).padStart(2, '0')}</span></div>
            <div className="timeline-copy"><span className="item-location">{item.location}</span><h2>{item.role}</h2><h3>{item.company}</h3><p>{item.description}</p>
              {item.highlights?.length > 0 && <ul>{item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>}
            </div>
          </div>
        ))}
        {experiences.length === 0 && <p className="empty-note">Perjalanan berikutnya segera ditulis.</p>}
      </div>
    </article>
  )
}

function WorkPage({ projects }) {
  return (
    <article className="page">
      <div className="section-kicker"><span>03 / PILIHAN KARYA</span><span className="kicker-line" /></div>
      <div className="heading-row"><div><p className="chapter-intro">Sedikit dari</p><h1>yang sudah dibuat.</h1></div><span className="page-doodle">↘</span></div>
      <div className="project-grid">
        {projects.map((project, index) => (
          <article className={`project-card project-${index % 2}`} key={project.id}>
            <div className="project-art">
              {project.imageUrl ? <img src={project.imageUrl} alt={`Pratinjau ${project.title}`} loading="lazy" /> : <div className="project-art-placeholder"><span>{String(index + 1).padStart(2, '0')}</span><b>{project.title}</b><i>STUDY IN<br />MAKING</i></div>}
              <span className="project-year">{project.year}</span>
            </div>
            <div className="project-info"><div><span>{project.category}</span><h2>{project.title}</h2></div>
              {(project.liveUrl || project.repoUrl) && <div className="project-links">{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">LIVE ↗</a>}{project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noreferrer">REPO ↗</a>}</div>}
            </div>
            <p className="project-description">{project.description}</p>
            <div className="tag-list">{project.tech.map((item) => <span key={item}>{item}</span>)}</div>
          </article>
        ))}
        {projects.length === 0 && <p className="empty-note">Karya pilihan akan segera ditambahkan.</p>}
      </div>
    </article>
  )
}

function SkillsPage({ groups, techStack }) {
  const technologies = techStack.reduce((result, item) => {
    result[item.category] ??= []
    result[item.category].push(item.name)
    return result
  }, {})
  return (
    <article className="page">
      <div className="section-kicker"><span>04 / BEKAL DI PERJALANAN</span><span className="kicker-line" /></div>
      <p className="chapter-intro">Alat dan cara berpikir</p><h1 className="skills-heading">untuk terus bertumbuh.</h1>
      <div className="skills-layout">
        <div className="skill-groups">{groups.map(([category, skills]) => <section className="skill-group" key={category}><span className="group-label">{category}</span>
          {skills.map((item) => <div className="skill-row" key={item.id}><span>{item.name}</span><div className="skill-level" aria-label={`Level ${item.level} dari 5`}>{[1, 2, 3, 4, 5].map((level) => <i className={level <= item.level ? 'filled' : ''} key={level} />)}</div></div>)}
        </section>)}</div>
        <aside className="tech-card"><span className="group-label">TOOLKIT / 001</span><h2>Teknologi yang<br /><i>akrab di tangan.</i></h2>
          {Object.entries(technologies).map(([category, items]) => <div className="tech-group" key={category}><span>{category}</span><div className="tag-list">{items.map((item) => <b key={item}>{item}</b>)}</div></div>)}
          <span className="tech-spark">✳</span>
        </aside>
      </div>
    </article>
  )
}

function EducationPage({ education, profile }) {
  return (
    <article className="page page-last">
      <div className="section-kicker"><span>05 / AKAR &amp; ARAH</span><span className="kicker-line" /></div>
      <p className="chapter-intro">Terus belajar,</p><h1>selalu ada bab baru.</h1>
      <div className="education-list">{education.map((item) => (
        <article className="education-card" key={item.id}>
          <span className="education-year">{formatDate(item.startDate)} — {item.endDate ? formatDate(item.endDate) : 'SEKARANG'}</span>
          <div><h2>{item.institution}</h2><p>{item.degree}{item.field ? ` · ${item.field}` : ''}</p>{item.description && <small>{item.description}</small>}</div>
          <span className="education-mark">✳</span>
        </article>
      ))}</div>
      <div className="closing-card"><span>UJUNG HALAMAN?</span><h2>Belum. Mari mulai<br /><i>cerita yang baru.</i></h2><a href={`mailto:${profile.email}`}>KIRIM PESAN <span>↗</span></a></div>
      <div className="margin-note">SAMPAI JUMPA</div>
    </article>
  )
}

function formatDate(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat('id-ID', { month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`)).toUpperCase()
}

export default App
