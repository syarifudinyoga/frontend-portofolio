import { useEffect, useMemo, useRef, useState } from 'react'
import AdminPortal from './AdminPortal.jsx'
import { apiFetch } from './crypto.js'
import { lines, localizePortfolio, resolveTexts } from './uiTexts.js'

const pageDefs = [
  { id: 'about', labelKey: 'pageAbout', number: '01' },
  { id: 'education', labelKey: 'pageEducation', number: '02' },
  { id: 'skills', labelKey: 'pageSkills', number: '03' },
  { id: 'journey', labelKey: 'pageJourney', number: '04' },
  { id: 'work', labelKey: 'pageWork', number: '05' },
  { id: 'closing', labelKey: 'pageClosing', number: '06' },
]

function App() {
  const isAdminRoute = window.location.pathname.replace(/\/+$/, '') === '/myconfig'
  const [portfolio, setPortfolio] = useState(null)
  const [error, setError] = useState('')
  const [active, setActive] = useState(0)
  const [opened, setOpened] = useState(false)
  const [opening, setOpening] = useState(false)
  const [previewProject, setPreviewProject] = useState(null)
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio-lang')
      if (saved === 'id' || saved === 'en') return saved
      if (typeof navigator !== 'undefined' && navigator.language) {
        return navigator.language.toLowerCase().startsWith('id') ? 'id' : 'en'
      }
    } catch {}
    return 'id'
  })

  const touchStartY = useRef(null)
  const openTimer = useRef(null)

  useEffect(() => () => window.clearTimeout(openTimer.current), [])

  useEffect(() => {
    try {
      localStorage.setItem('portfolio-lang', lang)
      document.documentElement.lang = lang
    } catch {}
  }, [lang])

  function openBook() {
    if (opened || opening) return
    setOpening(true)
    openTimer.current = window.setTimeout(() => {
      setOpened(true)
      setOpening(false)
    }, 1650)
  }

  function handleCoverWheel(event) {
    if (event.deltaY <= 18) return
    event.preventDefault()
    openBook()
  }

  function handleCoverTouchStart(event) {
    touchStartY.current = event.touches[0]?.clientY ?? null
  }

  function handleCoverTouchEnd(event) {
    const endY = event.changedTouches[0]?.clientY
    if (touchStartY.current !== null && endY !== undefined && touchStartY.current - endY > 45) {
      openBook()
    }
    touchStartY.current = null
  }

  function connectionMessage(cause) {
    if (cause instanceof TypeError) {
      return lang === 'en'
        ? `Backend not connected. Make sure Go API is running at localhost:3004. Detail: ${cause.message}`
        : `Backend tidak terhubung. Pastikan Go API berjalan di localhost:3004. Detail: ${cause.message}`
    }
    return cause.message
  }

  useEffect(() => {
    if (isAdminRoute) return undefined
    const controller = new AbortController()
    apiFetch('/api/portfolio', { signal: controller.signal })
      .then(setPortfolio)
      .catch((cause) => {
        if (cause.name !== 'AbortError') setError(connectionMessage(cause))
      })
    return () => controller.abort()
  }, [isAdminRoute])

  const localizedPortfolio = useMemo(() => localizePortfolio(portfolio, lang), [portfolio, lang])

  const groupedSkills = useMemo(() => {
    if (!localizedPortfolio) return []
    return Object.entries(
      localizedPortfolio.skills.reduce((groups, item) => {
        groups[item.category] ??= []
        groups[item.category].push(item)
        return groups
      }, {}),
    )
  }, [localizedPortfolio])

  if (isAdminRoute) return <AdminPortal />

  if (error) {
    const tError = resolveTexts({}, lang)
    return (
      <main className="state-screen">
        <div className="state-card">
          <span className="eyebrow">{tError.errorEyebrow}</span>
          <h1>{tError.errorHeading}</h1>
          <p>{tError.errorDesc}</p>
          <button className="button button-dark" onClick={() => window.location.reload()}>{tError.errorReload}</button>
          <small className="error-detail">{error}</small>
        </div>
      </main>
    )
  }

  if (!portfolio || !localizedPortfolio) {
    const tLoading = resolveTexts({}, lang)
    return <main className="state-screen"><div className="loading-book"><span className="book-mark">✳</span><p>{tLoading.loadingText}</p></div></main>
  }

  const { profile, experiences, education, certifications = [], projects, techStack } = localizedPortfolio
  const t = resolveTexts(portfolio.texts, lang)
  const pages = pageDefs.map((page) => ({ ...page, label: t[page.labelKey] }))
  const currentPage = pages[active]

  function turnPage(index) {
    setActive(Math.max(0, Math.min(pages.length - 1, index)))
    setOpened(true)
  }

  const readingLayout = (
    <div className="reading-layout">
      <aside className="chapter-rail">
        <button className="back-cover" onClick={() => setOpened(false)} aria-label={t.backCoverAria}>← <span>{t.backLabel}</span></button>
        <span className="rail-label">{t.tocLabel}</span>
        <nav aria-label={t.tocAria}>
          {pages.map((page, index) => (
            <button key={page.id} className={`chapter-link ${active === index ? 'is-active' : ''}`} onClick={() => turnPage(index)}>
              <span>{page.number}</span>{page.label}
            </button>
          ))}
        </nav>
        <div className="rail-bottom"><span className="book-mark">✳</span><span>{t.railVol}<br />{t.railYear}</span></div>
      </aside>
      <section className="page-wrap" key={currentPage.id}>
        <div className="page-topline"><span>{t.pageTopline}</span><span>{currentPage.number} <i>/</i> 06</span></div>
        <div className="page-content">
          {active === 0 && <AboutPage profile={profile} onNext={() => turnPage(1)} t={t} />}
          {active === 1 && <EducationPage education={education} certifications={certifications} t={t} lang={lang} />}
          {active === 2 && <SkillsPage groups={groupedSkills} techStack={techStack} t={t} />}
          {active === 3 && <JourneyPage experiences={experiences} t={t} lang={lang} />}
          {active === 4 && <WorkPage projects={projects} t={t} onSelectProject={(proj, tab) => setPreviewProject({ ...proj, initialTab: tab || 'iframe' })} />}
          {active === 5 && <ClosingPage profile={profile} t={t} />}
        </div>
        <footer className="page-footer">
          <span>{profile.location}</span>
          <div className="page-controls">
            <button onClick={() => turnPage(active - 1)} disabled={active === 0} aria-label={t.prevPageAria}>←</button>
            <span>{currentPage.number} <i>/</i> 06</span>
            <button onClick={() => turnPage(active + 1)} disabled={active === pages.length - 1} aria-label={t.nextPageAria}>→</button>
          </div>
        </footer>
      </section>
    </div>
  )

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#home" onClick={() => { setOpened(false); setActive(0) }} aria-label={t.brandAria}>
          <span className="brand-mark">✳</span><span>{lines(t.brand)}</span>
        </a>
        <div className="topbar-note"><span className="status-dot" /> {t.topbarLeft} <span className="topbar-divider">/</span> {t.topbarRight}</div>
        <div className="topbar-actions">
          <div className="lang-switcher" role="group" aria-label={t.langAria}>
            <button
              type="button"
              className={`lang-btn ${lang === 'id' ? 'is-active' : ''}`}
              onClick={() => setLang('id')}
              aria-pressed={lang === 'id'}
              title="Bahasa Indonesia"
            >
              ID
            </button>
            <span className="lang-divider">/</span>
            <button
              type="button"
              className={`lang-btn ${lang === 'en' ? 'is-active' : ''}`}
              onClick={() => setLang('en')}
              aria-pressed={lang === 'en'}
              title="English"
            >
              EN
            </button>
          </div>
          <a className="contact-link" href={`mailto:${profile.email}`}>{t.contactLabel} <span aria-hidden="true">↗</span></a>
        </div>
      </header>

      {!opened ? (
        <section
          id="home"
          className={`cover-stage ${opening ? 'is-opening' : ''}`}
          onWheel={handleCoverWheel}
          onTouchStart={handleCoverTouchStart}
          onTouchEnd={handleCoverTouchEnd}
        >
          <div className="cover-caption"><span>{t.coverCaption1}</span><span>{t.coverCaption2}</span></div>
          <div className="book-3d">
            <div className="book-pages" aria-hidden="true"><span className="pages-mark">✳</span><span className="pages-note">{lines(t.coverInner)}</span><span className="pages-number">01</span></div>
            <div className="cover-flip">
              <button className="book-cover" onClick={openBook} aria-label={t.openBookAria}>
                <span className="cover-spine" />
                <span className="cover-topline">{t.coverTopline} <span>{t.coverYear}</span></span>
                <span className="cover-star">✳</span>
                <span className="cover-title">{t.coverTitle1}<br /><i>{t.coverTitle2}</i><br />{t.coverTitle3}</span>
                <span className="cover-bottom">
                  <span><b>{profile.name}</b><small>{profile.role}</small></span>
                  <span className="cover-open">{t.coverOpen} <b>↗</b></span>
                </span>
              </button>
              <div className="cover-back" aria-hidden="true"><span>{t.exLibris}<br />— {profile.name} —</span></div>
            </div>
          </div>
          {opening && <div className="peek-layout" aria-hidden="true" inert="">{readingLayout}</div>}
          <div className="cover-aside"><span className="vertical-label">{t.coverAside}</span><span className="aside-line" /></div>
          <div className="cover-footer"><span>{profile.location}</span><span className="scroll-hint">{t.coverScrollHint} <b>↓</b></span><span>01 — 06 <span className="footer-spark">✳</span></span></div>
        </section>
      ) : (
        readingLayout
      )}

      {previewProject && (
        <ProjectPreviewModal
          project={previewProject}
          initialTab={previewProject.initialTab}
          onClose={() => setPreviewProject(null)}
          t={t}
        />
      )}
    </main>
  )
}

function AboutPage({ profile, onNext, t }) {
  const greeting = t.aboutGreeting
    ? t.aboutGreeting.endsWith(' ')
      ? t.aboutGreeting
      : `${t.aboutGreeting} `
    : ''
  return (
    <article className="page page-about">
      <div className="section-kicker"><span>{t.aboutKicker}</span><span className="kicker-line" /></div>
      <div className="about-grid">
        <div className="about-copy">
          <p className="chapter-intro">{greeting}<span>{profile.name.split(' ')[0]}.</span></p>
          <h1>{t.aboutHeadline || profile.headline}</h1>
          <p className="body-copy">{profile.about}</p>
          <button className="text-button" onClick={onNext}>{t.aboutNextBtn} <span>↗</span></button>
        </div>
        <div className="portrait-card">
          {profile.avatarUrl ? <img src={profile.avatarUrl} alt={`Potret ${profile.name}`} /> : <div className="portrait-placeholder"><span>{profile.name.split(' ').map((word) => word[0]).slice(0, 2).join('')}</span><i>{lines(t.aboutChangePhoto)}</i></div>}
          <span className="portrait-index">{t.aboutFig}</span>
          <span className="portrait-stamp">{lines(t.aboutOpenToIdeas)}</span>
        </div>
      </div>
      <div className="about-meta">
        <div><span>{t.aboutBasedIn}</span><b>{profile.location}</b></div>
        <div><span>{t.aboutFocus}</span><b>{profile.role}</b></div>
        <div><span>{t.aboutEmail}</span><a href={`mailto:${profile.email}`}>{profile.email} ↗</a></div>
        {profile.website && <div><span>{t.aboutWebsite}</span><a href={profile.website} target="_blank" rel="noreferrer">{t.aboutVisit}</a></div>}
        {profile.resumeUrl && <div><span>{t.aboutResume}</span><a href={profile.resumeUrl} target="_blank" rel="noreferrer">{t.aboutViewResume}</a></div>}
      </div>
      <div className="margin-note">{lines(t.aboutNotes)}</div>
    </article>
  )
}

function JourneyPage({ experiences, t, lang }) {
  return (
    <article className="page">
      <div className="section-kicker"><span>{t.journeyKicker}</span><span className="kicker-line" /></div>
      <div className="heading-row"><div><p className="chapter-intro">{t.journeyIntro}</p><h1>{t.journeyHeading}</h1></div><span className="chapter-count">{String(experiences.length).padStart(2, '0')}<small>{t.journeyChapters}</small></span></div>
      <div className="timeline">
        {experiences.map((item, index) => (
          <div className="timeline-item" key={item.id}>
            <div className="timeline-date">{formatDate(item.startDate, lang)}<br /><span>{item.endDate ? formatDate(item.endDate, lang) : t.journeyPresent}</span></div>
            <div className="timeline-marker"><span>{String(index + 1).padStart(2, '0')}</span></div>
            <div className="timeline-copy"><span className="item-location">{item.location}</span><h2>{item.role}</h2><h3>{item.company}</h3><p>{item.description}</p>
              {item.highlights?.length > 0 && <ul>{item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>}
            </div>
          </div>
        ))}
        {experiences.length === 0 && <p className="empty-note">{t.journeyEmpty}</p>}
      </div>
    </article>
  )
}

function ProjectCard({ project, index, t, onSelectProject }) {
  const isPersonal = project.projectType === 'personal'
  return (
    <article className={`project-card project-${index % 2}`} key={project.id || `${project.title}-${index}`}>
      <div
        className="project-art"
        onClick={() => onSelectProject(project, project.liveUrl ? 'iframe' : 'media')}
        role="button"
        tabIndex={0}
        aria-label={`Buka preview ${project.title}`}
        onKeyDown={(e) => { if (e.key === 'Enter') onSelectProject(project, project.liveUrl ? 'iframe' : 'media') }}
      >
        {project.videoUrl ? (
          <div className="project-video-wrapper">
            <video
              src={project.videoUrl}
              poster={project.imageUrl || undefined}
              muted
              loop
              playsInline
              onMouseEnter={(e) => { e.currentTarget.play().catch(() => {}) }}
              onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0 }}
            />
            <span className="project-media-badge">▶ {t.workVideoBadge}</span>
          </div>
        ) : project.imageUrl ? (
          <img src={project.imageUrl} alt={`Pratinjau ${project.title}`} loading="lazy" />
        ) : (
          <div className="project-art-placeholder">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <b>{project.title}</b>
            <i>{lines(t.workStudyInMaking)}</i>
          </div>
        )}
        <span className="project-year">{project.year}</span>
        <div className="project-overlay-hint">
          <span>{project.liveUrl ? `🌐 ${t.workLiveIframe}` : `🔍 ${t.workTabMedia}`}</span>
        </div>
      </div>
      <div className="project-info">
        <div>
          <div className="project-category-row">
            <span>{project.category}</span>
            <span className={`project-type-tag ${isPersonal ? 'is-personal' : 'is-work'}`}>
              {isPersonal ? (t.workBadgePersonal || '💡 PRIBADI') : (t.workBadgeWork || '🏢 KANTOR')}
            </span>
          </div>
          <h2
            className="project-title-link"
            onClick={() => onSelectProject(project, project.liveUrl ? 'iframe' : 'media')}
          >
            {project.title}
          </h2>
        </div>
        <div className="project-links">
          {project.liveUrl && (
            <button
              type="button"
              className="project-action-btn"
              onClick={() => onSelectProject(project, 'iframe')}
              title={t.workLiveIframe}
            >
              <span>🌐 {t.workLiveIframe}</span>
            </button>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" title={t.workOpenTab}>
              {t.workLive}
            </a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noreferrer">
              {t.workRepo}
            </a>
          )}
        </div>
      </div>
      <p className="project-description">{project.description}</p>
      {project.tech?.length > 0 && (
        <div className="tag-list">
          {project.tech.map((item) => <span key={item}>{item}</span>)}
        </div>
      )}
    </article>
  )
}

function EmptyPersonalCard({ t }) {
  return (
    <div className="personal-empty-card">
      <div className="personal-empty-icon">💡</div>
      <div className="personal-empty-content">
        <h3>{t.workEmptyPersonalTitle}</h3>
        <p>{t.workEmptyPersonalDesc}</p>
        <div className="personal-empty-hint">
          <span>Portal Admin:</span> <code>/myconfig</code> → <b>Karya & project</b> → <i>Tipe: Projek Pribadi</i>
        </div>
      </div>
    </div>
  )
}

function WorkPage({ projects, t, onSelectProject }) {
  const [filter, setFilter] = useState('all')

  const workProjects = useMemo(
    () => projects.filter((p) => p.projectType !== 'personal'),
    [projects],
  )
  const personalProjects = useMemo(
    () => projects.filter((p) => p.projectType === 'personal'),
    [projects],
  )

  return (
    <article className="page">
      <div className="section-kicker"><span>{t.workKicker}</span><span className="kicker-line" /></div>
      <div className="heading-row">
        <div>
          <p className="chapter-intro">{t.workIntro}</p>
          <h1>{t.workHeading}</h1>
        </div>
        <span className="page-doodle">↘</span>
      </div>

      <div className="project-filters" role="tablist" aria-label="Filter kategori project">
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'all'}
          className={`project-filter-btn ${filter === 'all' ? 'is-active' : ''}`}
          onClick={() => setFilter('all')}
        >
          {t.workFilterAll} <span className="filter-count">{projects.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'work'}
          className={`project-filter-btn ${filter === 'work' ? 'is-active' : ''}`}
          onClick={() => setFilter('work')}
        >
          {t.workFilterWork} <span className="filter-count">{workProjects.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'personal'}
          className={`project-filter-btn ${filter === 'personal' ? 'is-active' : ''}`}
          onClick={() => setFilter('personal')}
        >
          {t.workFilterPersonal} <span className="filter-count">{personalProjects.length}</span>
        </button>
      </div>

      {filter === 'all' && (
        <div className="project-groups">
          <section className="project-group-section">
            <header className="project-group-header">
              <span className="project-group-kicker">{t.workGroupWork}</span>
              <p className="project-group-desc">{t.workGroupWorkDesc}</p>
            </header>
            <div className="project-grid">
              {workProjects.map((project, index) => (
                <ProjectCard
                  key={project.id || `${project.title}-${index}`}
                  project={project}
                  index={index}
                  t={t}
                  onSelectProject={onSelectProject}
                />
              ))}
              {workProjects.length === 0 && <p className="empty-note">{t.workEmpty}</p>}
            </div>
          </section>

          <section className="project-group-section">
            <header className="project-group-header">
              <span className="project-group-kicker">{t.workGroupPersonal}</span>
              <p className="project-group-desc">{t.workGroupPersonalDesc}</p>
            </header>
            {personalProjects.length > 0 ? (
              <div className="project-grid">
                {personalProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id || `${project.title}-${index}`}
                    project={project}
                    index={index}
                    t={t}
                    onSelectProject={onSelectProject}
                  />
                ))}
              </div>
            ) : (
              <EmptyPersonalCard t={t} />
            )}
          </section>
        </div>
      )}

      {filter === 'work' && (
        <section className="project-group-section">
          <header className="project-group-header">
            <span className="project-group-kicker">{t.workGroupWork}</span>
            <p className="project-group-desc">{t.workGroupWorkDesc}</p>
          </header>
          <div className="project-grid">
            {workProjects.map((project, index) => (
              <ProjectCard
                key={project.id || `${project.title}-${index}`}
                project={project}
                index={index}
                t={t}
                onSelectProject={onSelectProject}
              />
            ))}
            {workProjects.length === 0 && <p className="empty-note">{t.workEmpty}</p>}
          </div>
        </section>
      )}

      {filter === 'personal' && (
        <section className="project-group-section">
          <header className="project-group-header">
            <span className="project-group-kicker">{t.workGroupPersonal}</span>
            <p className="project-group-desc">{t.workGroupPersonalDesc}</p>
          </header>
          {personalProjects.length > 0 ? (
            <div className="project-grid">
              {personalProjects.map((project, index) => (
                <ProjectCard
                  key={project.id || `${project.title}-${index}`}
                  project={project}
                  index={index}
                  t={t}
                  onSelectProject={onSelectProject}
                />
              ))}
            </div>
          ) : (
            <EmptyPersonalCard t={t} />
          )}
        </section>
      )}
    </article>
  )
}

function ProjectPreviewModal({ project, initialTab = 'iframe', onClose, t }) {
  const hasLiveUrl = Boolean(project.liveUrl && project.liveUrl.trim())
  const [tab, setTab] = useState(hasLiveUrl && initialTab === 'iframe' ? 'iframe' : 'media')
  const [iframeKey, setIframeKey] = useState(0)
  const [iframeLoading, setIframeLoading] = useState(true)

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function reloadIframe() {
    setIframeLoading(true)
    setIframeKey((k) => k + 1)
  }

  return (
    <div className="project-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="project-modal-window" onClick={(e) => e.stopPropagation()}>
        <header className="browser-chrome">
          <div className="browser-dots" aria-hidden="true">
            <button type="button" className="dot dot-close" onClick={onClose} title={t.workClose} />
            <span className="dot dot-minimize" />
            <span className="dot dot-expand" />
          </div>

          <div className="browser-tabs">
            {hasLiveUrl && (
              <button
                type="button"
                className={`browser-tab ${tab === 'iframe' ? 'is-active' : ''}`}
                onClick={() => setTab('iframe')}
              >
                🌐 {t.workTabIframe}
              </button>
            )}
            <button
              type="button"
              className={`browser-tab ${tab === 'media' ? 'is-active' : ''}`}
              onClick={() => setTab('media')}
            >
              🎬 {t.workTabMedia}
            </button>
          </div>

          <div className="browser-address-bar">
            <span className="address-lock">🔒</span>
            <span className="address-url">{hasLiveUrl ? project.liveUrl : project.title}</span>
            {hasLiveUrl && (
              <button type="button" className="address-reload" onClick={reloadIframe} title={t.workReload}>
                ⟳
              </button>
            )}
          </div>

          <div className="browser-actions">
            {hasLiveUrl && (
              <a
                className="browser-btn-external"
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                title={t.workOpenTab}
              >
                {t.workOpenTab}
              </a>
            )}
            <button type="button" className="browser-btn-close" onClick={onClose} aria-label={t.workClose}>
              ✕
            </button>
          </div>
        </header>

        <div className="browser-body">
          {tab === 'iframe' && hasLiveUrl ? (
            <div className="iframe-stage">
              {iframeLoading && (
                <div className="iframe-loader">
                  <span className="book-mark">✳</span>
                  <p>{t.loadingText}</p>
                </div>
              )}
              <iframe
                key={iframeKey}
                src={project.liveUrl}
                title={`Live preview of ${project.title}`}
                className="project-iframe"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                loading="lazy"
                onLoad={() => setIframeLoading(false)}
              />
              <div className="iframe-notice">
                <span>ℹ️ {t.workIframeNotice}</span>
                <a href={project.liveUrl} target="_blank" rel="noreferrer">
                  {t.workOpenTab}
                </a>
              </div>
            </div>
          ) : (
            <div className="media-stage">
              <div className="media-visuals">
                {project.videoUrl && (
                  <div className="media-video-container">
                    <span className="media-section-badge">🎬 {t.workVideoBadge}</span>
                    <video
                      src={project.videoUrl}
                      controls
                      autoPlay
                      muted
                      playsInline
                      className="media-video-player"
                    />
                  </div>
                )}
                {project.imageUrl && (
                  <div className="media-image-container">
                    <img src={project.imageUrl} alt={project.title} className="media-image-preview" />
                  </div>
                )}
                {!project.videoUrl && !project.imageUrl && (
                  <div className="media-empty-placeholder">
                    <span className="book-mark">✳</span>
                    <p>{t.workNoMedia}</p>
                  </div>
                )}
              </div>

              <div className="media-details">
                <div className="media-category-row">
                  <span className="media-category">{project.category} · {project.year}</span>
                  <span className={`project-type-pill ${project.projectType === 'personal' ? 'is-personal' : 'is-work'}`}>
                    {project.projectType === 'personal' ? (t.workBadgePersonal || '💡 PRIBADI') : (t.workBadgeWork || '🏢 KANTOR')}
                  </span>
                </div>
                <h2 className="media-title">{project.title}</h2>
                <p className="media-description">{project.description}</p>

                {project.tech?.length > 0 && (
                  <div className="media-tech-section">
                    <span className="media-tech-label">{t.workTech}:</span>
                    <div className="tag-list">
                      {project.tech.map((item) => (
                        <b key={item}>{item}</b>
                      ))}
                    </div>
                  </div>
                )}

                <div className="media-actions">
                  {project.liveUrl && (
                    <button
                      type="button"
                      className="button button-rust"
                      onClick={() => setTab('iframe')}
                    >
                      🌐 {t.workTabIframe}
                    </button>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="button button-outline"
                    >
                      {t.workOpenTab}
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="button button-outline"
                    >
                      {t.workRepo}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SkillsPage({ groups, techStack, t }) {
  const technologies = techStack.reduce((result, item) => {
    result[item.category] ??= []
    result[item.category].push(item.name)
    return result
  }, {})
  return (
    <article className="page">
      <div className="section-kicker"><span>{t.skillsKicker}</span><span className="kicker-line" /></div>
      <p className="chapter-intro">{t.skillsIntro}</p><h1 className="skills-heading">{t.skillsHeading}</h1>
      <div className="skills-layout">
        <div className="skill-groups">{groups.map(([category, skills]) => <section className="skill-group" key={category}><span className="group-label">{category}</span>
          {skills.map((item) => <div className="skill-row" key={item.id}><span>{item.name}</span><div className="skill-level" aria-label={t.skillsLevelAria(item.level)}>{[1, 2, 3, 4, 5].map((level) => <i className={level <= item.level ? 'filled' : ''} key={level} />)}</div></div>)}
        </section>)}</div>
        <aside className="tech-card"><span className="group-label">{t.skillsToolkit}</span><h2>{t.skillsToolkitTitle1}<br /><i>{t.skillsToolkitTitle2}</i></h2>
          {Object.entries(technologies).map(([category, items]) => <div className="tech-group" key={category}><span>{category}</span><div className="tag-list">{items.map((item) => <b key={item}>{item}</b>)}</div></div>)}
          <span className="tech-spark">✳</span>
        </aside>
      </div>
    </article>
  )
}

function EducationPage({ education, certifications, t, lang }) {
  return (
    <article className="page">
      <div className="section-kicker"><span>{t.educationKicker}</span><span className="kicker-line" /></div>
      <p className="chapter-intro">{t.educationIntro}</p><h1>{t.educationHeading}</h1>
      <div className="education-list">{education.map((item) => (
        <article className="education-card" key={item.id}>
          <span className="education-year">{formatDate(item.startDate, lang)} — {item.endDate ? formatDate(item.endDate, lang) : t.educationPresent}</span>
          <div><h2>{item.institution}</h2><p>{item.degree}{item.field ? ` · ${item.field}` : ''}</p>{item.description && <small>{item.description}</small>}</div>
          <span className="education-mark">✳</span>
        </article>
      ))}</div>
      {certifications.length > 0 && (
        <>
          <div className="group-label cert-label">{t.certLabel}</div>
          <div className="education-list cert-list">{certifications.map((item) => (
            <article className="education-card" key={item.id}>
              <span className="education-year">{item.issuedDate ? formatDate(item.issuedDate, lang) : '—'}</span>
              <div><h2>{item.name}</h2>{item.issuer && <p>{item.issuer}</p>}</div>
              {item.credentialUrl ? <a className="education-mark cert-link" href={item.credentialUrl} target="_blank" rel="noreferrer" aria-label={t.certAria(item.name)}>↗</a> : <span className="education-mark">✳</span>}
            </article>
          ))}</div>
        </>
      )}
    </article>
  )
}

function ClosingPage({ profile, t }) {
  const links = [
    { label: 'Email', href: profile.email && `mailto:${profile.email}`, text: profile.email },
    { label: 'GitHub', href: profile.githubUrl },
    { label: 'Instagram', href: profile.instagramUrl },
    { label: 'Twitter', href: profile.twitterUrl },
    { label: 'LinkedIn', href: profile.linkedinUrl },
  ].filter((item) => item.href)
  return (
    <article className="page page-last">
      <div className="section-kicker"><span>{t.closingKicker}</span><span className="kicker-line" /></div>
      <p className="chapter-intro">{t.closingIntro}</p>
      <h1 className="closing-title">{t.closingTitle1}<br /><i>{t.closingTitle2}</i></h1>
      <div className="social-list">{links.map((item) => (
        <a key={item.label} href={item.href} {...(item.label === 'Email' ? {} : { target: '_blank', rel: 'noreferrer' })}>
          <span>{item.label.toUpperCase()}</span><b>{item.text || handleFromUrl(item.href)}</b><i aria-hidden="true">↗</i>
        </a>
      ))}</div>
      <div className="margin-note">{t.closingFarewell}</div>
    </article>
  )
}

function handleFromUrl(url) {
  try {
    const parts = new URL(url).pathname.split('/').filter(Boolean)
    const name = parts[parts.length - 1]
    return name ? `@${name.replace(/^@/, '')}` : new URL(url).hostname
  } catch {
    return url
  }
}

function formatDate(value, lang = 'id') {
  if (!value) return ''
  const locale = lang === 'en' ? 'en-US' : 'id-ID'
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`)).toUpperCase()
}

export default App
