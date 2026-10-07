import { createElement } from 'react'

export const uiTextFields = [
  { key: 'brand', label: 'Brand (pojok kiri atas, pakai baris baru)', value: 'CATATAN\nPERJALANAN', group: 'Header' },
  { key: 'topbarLeft', label: 'Teks tengah header (kiri)', value: 'PORTFOLIO DIGITAL', group: 'Header' },
  { key: 'topbarRight', label: 'Teks tengah header (kanan)', value: 'EDISI 2025', group: 'Header' },
  { key: 'contactLabel', label: 'Tombol kontak', value: 'Sapa saya', group: 'Header' },
  { key: 'coverCaption1', label: 'Keterangan sampul baris 1', value: 'SEBUAH BUKU TENTANG', group: 'Sampul' },
  { key: 'coverCaption2', label: 'Keterangan sampul baris 2', value: 'IDE, PROSES & PERJALANAN', group: 'Sampul' },
  { key: 'coverTopline', label: 'Teks atas sampul (kiri)', value: 'PORTFOLIO / VOL. 01', group: 'Sampul' },
  { key: 'coverYear', label: 'Teks atas sampul (kanan)', value: '2025—NOW', group: 'Sampul' },
  { key: 'coverTitle1', label: 'Judul sampul baris 1', value: 'The', group: 'Sampul' },
  { key: 'coverTitle2', label: 'Judul sampul baris 2 (miring)', value: 'making', group: 'Sampul' },
  { key: 'coverTitle3', label: 'Judul sampul baris 3', value: 'of things.', group: 'Sampul' },
  { key: 'coverOpen', label: 'Tombol buka buku', value: 'BUKA BUKU', group: 'Sampul' },
  { key: 'coverScrollHint', label: 'Petunjuk gulir', value: 'GULIR UNTUK MEMBUKA', group: 'Sampul' },
  { key: 'coverAside', label: 'Teks vertikal sampul', value: 'SCROLL SLOWLY, STAY AWHILE', group: 'Sampul' },
  { key: 'coverInner', label: 'Teks halaman dalam sampul (pakai baris baru)', value: 'A COLLECTION OF\nTHOUGHTS & MAKING', group: 'Sampul' },
  { key: 'exLibris', label: 'Teks bagian dalam sampul', value: 'EX LIBRIS', group: 'Sampul' },
  { key: 'backLabel', label: 'Tombol kembali ke sampul', value: 'SAMPUL', group: 'Daftar isi & halaman' },
  { key: 'tocLabel', label: 'Judul daftar isi', value: 'DAFTAR ISI', group: 'Daftar isi & halaman' },
  { key: 'railVol', label: 'Teks bawah daftar isi baris 1', value: 'VOL. 01', group: 'Daftar isi & halaman' },
  { key: 'railYear', label: 'Teks bawah daftar isi baris 2', value: '2025—NOW', group: 'Daftar isi & halaman' },
  { key: 'pageTopline', label: 'Header halaman', value: 'CATATAN PERJALANAN', group: 'Daftar isi & halaman' },
  { key: 'pageAbout', label: 'Menu: Tentang', value: 'Tentang', group: 'Daftar isi & halaman' },
  { key: 'pageEducation', label: 'Menu: Pendidikan', value: 'Pendidikan', group: 'Daftar isi & halaman' },
  { key: 'pageSkills', label: 'Menu: Keahlian', value: 'Keahlian', group: 'Daftar isi & halaman' },
  { key: 'pageJourney', label: 'Menu: Perjalanan', value: 'Perjalanan', group: 'Daftar isi & halaman' },
  { key: 'pageWork', label: 'Menu: Karya pilihan', value: 'Karya pilihan', group: 'Daftar isi & halaman' },
  { key: 'pageClosing', label: 'Menu: Penutup', value: 'Penutup', group: 'Daftar isi & halaman' },
  // Halaman Tentang
  { key: 'aboutGreeting', label: 'Tentang: Sapaan pembuka sebelum nama (contoh: "Halo, saya ")', value: 'Halo, saya ', group: 'Halaman Tentang' },
  { key: 'aboutHeadline', label: 'Tentang: Judul besar / Headline (contoh: "Merangkai ide menjadi pengalaman digital yang bermakna.")', value: 'Merangkai ide menjadi pengalaman digital yang bermakna.', group: 'Halaman Tentang' },
  { key: 'aboutKicker', label: 'Tentang: Label bagian atas', value: '01 / TENTANG SAYA', group: 'Halaman Tentang' },
  { key: 'aboutNextBtn', label: 'Tentang: Tombol lanjut ke pendidikan', value: 'Lihat pendidikan saya', group: 'Halaman Tentang' },
  { key: 'aboutNotes', label: 'Tentang: Catatan margin samping (pakai baris baru)', value: 'CATATAN\n01 — 06', group: 'Halaman Tentang' },
  { key: 'aboutFig', label: 'Tentang: Keterangan foto figur', value: 'FIG. 01 — A WORK IN PROGRESS', group: 'Halaman Tentang' },
  { key: 'aboutOpenToIdeas', label: 'Tentang: Stempel status (pakai baris baru)', value: 'OPEN\nTO IDEAS', group: 'Halaman Tentang' },
  { key: 'aboutBasedIn', label: 'Tentang: Label domisili / lokasi', value: 'BERBASIS DI', group: 'Halaman Tentang' },
  { key: 'aboutFocus', label: 'Tentang: Label fokus / peran', value: 'FOKUS', group: 'Halaman Tentang' },
  { key: 'aboutEmail', label: 'Tentang: Label email', value: 'EMAIL', group: 'Halaman Tentang' },
  { key: 'aboutWebsite', label: 'Tentang: Label website', value: 'WEBSITE', group: 'Halaman Tentang' },
  { key: 'aboutResume', label: 'Tentang: Label resume', value: 'RESUME', group: 'Halaman Tentang' },
  { key: 'aboutVisit', label: 'Tentang: Teks link website', value: 'Kunjungi ↗', group: 'Halaman Tentang' },
  { key: 'aboutViewResume', label: 'Tentang: Teks link resume', value: 'Lihat resume ↗', group: 'Halaman Tentang' },
  { key: 'aboutChangePhoto', label: 'Tentang: Petunjuk placeholder foto (pakai baris baru)', value: 'Ganti foto\nprofil Anda', group: 'Halaman Tentang' },

  // Halaman Pendidikan
  { key: 'educationKicker', label: 'Pendidikan: Label bagian atas', value: '02 / AKAR & ARAH', group: 'Halaman Pendidikan' },
  { key: 'educationIntro', label: 'Pendidikan: Sub-judul pembuka (contoh: "Terus belajar,")', value: 'Terus belajar,', group: 'Halaman Pendidikan' },
  { key: 'educationHeading', label: 'Pendidikan: Judul utama (contoh: "selalu ada bab baru.")', value: 'selalu ada bab baru.', group: 'Halaman Pendidikan' },
  { key: 'educationPresent', label: 'Pendidikan: Label status masa sekarang (aktif)', value: 'SEKARANG', group: 'Halaman Pendidikan' },
  { key: 'certLabel', label: 'Pendidikan: Label bagian sertifikasi', value: 'SERTIFIKASI', group: 'Halaman Pendidikan' },

  // Halaman Keahlian
  { key: 'skillsKicker', label: 'Keahlian: Label bagian atas', value: '04 / BEKAL DI PERJALANAN', group: 'Halaman Keahlian' },
  { key: 'skillsIntro', label: 'Keahlian: Sub-judul pembuka', value: 'Alat dan cara berpikir', group: 'Halaman Keahlian' },
  { key: 'skillsHeading', label: 'Keahlian: Judul utama', value: 'untuk terus bertumbuh.', group: 'Halaman Keahlian' },
  { key: 'skillsToolkit', label: 'Keahlian: Label kartu toolkit', value: 'TOOLKIT / 001', group: 'Halaman Keahlian' },
  { key: 'skillsToolkitTitle1', label: 'Keahlian: Judul toolkit baris 1', value: 'Teknologi yang', group: 'Halaman Keahlian' },
  { key: 'skillsToolkitTitle2', label: 'Keahlian: Judul toolkit baris 2 (miring)', value: 'akrab di tangan.', group: 'Halaman Keahlian' },

  // Halaman Perjalanan
  { key: 'journeyKicker', label: 'Perjalanan: Label bagian atas', value: '02 / JEJAK LANGKAH', group: 'Halaman Perjalanan' },
  { key: 'journeyIntro', label: 'Perjalanan: Sub-judul pembuka', value: 'Setiap langkah,', group: 'Halaman Perjalanan' },
  { key: 'journeyHeading', label: 'Perjalanan: Judul utama', value: 'membentuk cerita.', group: 'Halaman Perjalanan' },
  { key: 'journeyChapters', label: 'Perjalanan: Label hitungan bab', value: ' BAB', group: 'Halaman Perjalanan' },
  { key: 'journeyPresent', label: 'Perjalanan: Label status masa sekarang (aktif)', value: 'SEKARANG', group: 'Halaman Perjalanan' },
  { key: 'journeyEmpty', label: 'Perjalanan: Pesan saat data belum ada', value: 'Perjalanan berikutnya segera ditulis.', group: 'Halaman Perjalanan' },

  // Halaman Karya pilihan
  { key: 'workKicker', label: 'Karya: Label bagian atas', value: '03 / PILIHAN KARYA', group: 'Halaman Karya pilihan' },
  { key: 'workIntro', label: 'Karya: Sub-judul pembuka', value: 'Sedikit dari', group: 'Halaman Karya pilihan' },
  { key: 'workHeading', label: 'Karya: Judul utama', value: 'yang sudah dibuat.', group: 'Halaman Karya pilihan' },
  { key: 'workStudyInMaking', label: 'Karya: Keterangan kartu (pakai baris baru)', value: 'STUDY IN\nMAKING', group: 'Halaman Karya pilihan' },
  { key: 'workLive', label: 'Karya: Tombol link live demo', value: 'LIVE ↗', group: 'Halaman Karya pilihan' },
  { key: 'workRepo', label: 'Karya: Tombol link repo GitHub', value: 'REPO ↗', group: 'Halaman Karya pilihan' },
  { key: 'workLiveIframe', label: 'Karya: Tombol buka live modal', value: 'PREVIEW IFRAME', group: 'Halaman Karya pilihan' },
  { key: 'workOpenTab', label: 'Karya: Tombol buka di tab baru', value: 'Buka di Tab Baru ↗', group: 'Halaman Karya pilihan' },
  { key: 'workClose', label: 'Karya: Tombol tutup modal', value: 'Tutup', group: 'Halaman Karya pilihan' },
  { key: 'workReload', label: 'Karya: Tombol reload iframe', value: 'Muat Ulang', group: 'Halaman Karya pilihan' },
  { key: 'workTabIframe', label: 'Karya: Tab web live (iFrame)', value: 'Live Demo (iFrame)', group: 'Halaman Karya pilihan' },
  { key: 'workTabMedia', label: 'Karya: Tab media & info', value: 'Media & Deskripsi', group: 'Halaman Karya pilihan' },
  { key: 'workVideoBadge', label: 'Karya: Label badge video', value: 'VIDEO', group: 'Halaman Karya pilihan' },
  { key: 'workYear', label: 'Karya: Label tahun pembuatan', value: 'TAHUN', group: 'Halaman Karya pilihan' },
  { key: 'workTech', label: 'Karya: Label teknologi digunakan', value: 'TEKNOLOGI', group: 'Halaman Karya pilihan' },
  { key: 'workFilterAll', label: 'Karya: Tab filter Semua', value: 'Semua', group: 'Halaman Karya pilihan' },
  { key: 'workFilterWork', label: 'Karya: Tab filter Projek Kantor', value: '🏢 Projek Kantor', group: 'Halaman Karya pilihan' },
  { key: 'workFilterPersonal', label: 'Karya: Tab filter Projek Pribadi', value: '💡 Projek Pribadi', group: 'Halaman Karya pilihan' },
  { key: 'workGroupWork', label: 'Karya: Judul grup Projek Kantor', value: '01 / PROJEK KANTOR & ENTERPRISE', group: 'Halaman Karya pilihan' },
  { key: 'workGroupWorkDesc', label: 'Karya: Deskripsi grup Projek Kantor', value: 'Platform skala enterprise, sistem pemerintahan, dan arsitektur backend skala besar.', group: 'Halaman Karya pilihan' },
  { key: 'workGroupPersonal', label: 'Karya: Judul grup Projek Pribadi', value: '02 / PROJEK PRIBADI & EKSPERIMEN', group: 'Halaman Karya pilihan' },
  { key: 'workGroupPersonalDesc', label: 'Karya: Deskripsi grup Projek Pribadi', value: 'Eksplorasi ide mandiri, produk sampingan, dan eksperimen teknologi.', group: 'Halaman Karya pilihan' },
  { key: 'workEmptyPersonalTitle', label: 'Karya: Judul kotak kosong projek pribadi', value: 'Ruang Projek Pribadi', group: 'Halaman Karya pilihan' },
  { key: 'workEmptyPersonalDesc', label: 'Karya: Deskripsi kotak kosong projek pribadi', value: 'Belum ada projek pribadi yang ditambahkan. Anda dapat menambahkannya melalui portal admin.', group: 'Halaman Karya pilihan' },
  { key: 'workBadgeWork', label: 'Karya: Badge Projek Kantor', value: '🏢 KANTOR', group: 'Halaman Karya pilihan' },
  { key: 'workBadgePersonal', label: 'Karya: Badge Projek Pribadi', value: '💡 PRIBADI', group: 'Halaman Karya pilihan' },
  { key: 'workEmpty', label: 'Karya: Pesan saat data belum ada', value: 'Karya pilihan akan segera ditambahkan.', group: 'Halaman Karya pilihan' },

  // Penutup
  { key: 'closingKicker', label: 'Penutup: Label bagian atas', value: '06 / PENUTUP', group: 'Penutup' },
  { key: 'closingIntro', label: 'Penutup: Sub-judul pembuka', value: 'Ujung halaman?', group: 'Penutup' },
  { key: 'closingTitle1', label: 'Penutup: Judul baris 1', value: 'Belum. Mari mulai', group: 'Penutup' },
  { key: 'closingTitle2', label: 'Penutup: Judul baris 2 (miring)', value: 'cerita yang baru.', group: 'Penutup' },
  { key: 'closingFarewell', label: 'Penutup: Salam perpisahan bawah', value: 'SAMPAI JUMPA', group: 'Penutup' },
]

export const defaultTextsID = Object.fromEntries(uiTextFields.map((field) => [field.key, field.value]))
export const defaultTexts = defaultTextsID

export const defaultTextsEN = {
  brand: 'JOURNEY\nMEMOIR',
  topbarLeft: 'DIGITAL PORTFOLIO',
  topbarRight: '2025 EDITION',
  contactLabel: 'Say hello',
  coverCaption1: 'A BOOK ABOUT',
  coverCaption2: 'IDEAS, PROCESS & CRAFT',
  coverTopline: 'PORTFOLIO / VOL. 01',
  coverYear: '2025—NOW',
  coverTitle1: 'The',
  coverTitle2: 'making',
  coverTitle3: 'of things.',
  coverOpen: 'OPEN BOOK',
  coverScrollHint: 'SCROLL TO OPEN',
  coverAside: 'SCROLL SLOWLY, STAY AWHILE',
  coverInner: 'A COLLECTION OF\nTHOUGHTS & MAKING',
  exLibris: 'EX LIBRIS',
  backLabel: 'COVER',
  tocLabel: 'TABLE OF CONTENTS',
  railVol: 'VOL. 01',
  railYear: '2025—NOW',
  pageTopline: 'JOURNEY NOTES',
  pageAbout: 'About',
  pageEducation: 'Education',
  pageSkills: 'Skills',
  pageJourney: 'Journey',
  pageWork: 'Selected Works',
  pageClosing: 'Closing',
  aboutGreeting: 'Hello, I’m ',
  aboutHeadline: 'Crafting ideas into meaningful digital experiences.',
  aboutKicker: '01 / ABOUT ME',
  aboutNextBtn: 'Explore my education',
  aboutNotes: 'NOTES\n01 — 06',
  aboutFig: 'FIG. 01 — A WORK IN PROGRESS',
  aboutOpenToIdeas: 'OPEN\nTO IDEAS',
  aboutBasedIn: 'BASED IN',
  aboutFocus: 'FOCUS',
  aboutEmail: 'EMAIL',
  aboutWebsite: 'WEBSITE',
  aboutResume: 'RESUME',
  aboutVisit: 'Visit ↗',
  aboutViewResume: 'View resume ↗',
  aboutChangePhoto: 'Change profile\nphoto',
  educationKicker: '02 / ROOTS & DIRECTION',
  educationIntro: 'Lifelong learning,',
  educationHeading: 'always a new chapter.',
  educationPresent: 'PRESENT',
  certLabel: 'CERTIFICATIONS',
  skillsKicker: '04 / TOOLS & MINDSET',
  skillsIntro: 'Tools and ways of thinking',
  skillsHeading: 'to continuously grow.',
  skillsToolkit: 'TOOLKIT / 001',
  skillsToolkitTitle1: 'Technologies',
  skillsToolkitTitle2: 'close at hand.',
  journeyKicker: '02 / MILESTONES & JOURNEY',
  journeyIntro: 'Every single step,',
  journeyHeading: 'shapes the story.',
  journeyChapters: ' CHAPTERS',
  journeyPresent: 'PRESENT',
  journeyEmpty: 'Next chapter will be written soon.',
  workKicker: '03 / SELECTED WORKS',
  workIntro: 'A glimpse of',
  workHeading: 'what has been crafted.',
  workStudyInMaking: 'STUDY IN\nMAKING',
  workLive: 'LIVE ↗',
  workRepo: 'REPO ↗',
  workLiveIframe: 'LIVE IFRAME',
  workOpenTab: 'Open in New Tab ↗',
  workClose: 'Close',
  workReload: 'Reload',
  workTabIframe: 'Live Web (iFrame)',
  workTabMedia: 'Media & Description',
  workVideoBadge: 'VIDEO',
  workYear: 'YEAR',
  workTech: 'TECH STACK',
  workFilterAll: 'All',
  workFilterWork: '🏢 Work Projects',
  workFilterPersonal: '💡 Personal Projects',
  workGroupWork: '01 / ENTERPRISE & WORK PROJECTS',
  workGroupWorkDesc: 'Enterprise-scale platforms, government systems, and large-scale backend architectures.',
  workGroupPersonal: '02 / PERSONAL & EXPERIMENTAL PROJECTS',
  workGroupPersonalDesc: 'Independent explorations, side products, and experimental technologies.',
  workEmptyPersonalTitle: 'Personal Project Space',
  workEmptyPersonalDesc: 'No personal projects added yet. You can add them anytime via the admin portal.',
  workBadgeWork: '🏢 WORK',
  workBadgePersonal: '💡 PERSONAL',
  workEmpty: 'Selected projects will be added soon.',
  closingKicker: '06 / CLOSING',
  closingIntro: 'End of the page?',
  closingTitle1: 'Not yet. Let us begin',
  closingTitle2: 'a new story.',
  closingFarewell: 'SEE YOU SOON',
}

export const customTextTranslations = {
  'SEDIKIT\nCERITA': 'A SHORT\nSTORY',
  'CATATAN\nPERJALANAN': 'JOURNEY\nMEMOIR',
  'Kontak Saya': 'Contact Me',
  'Sapa saya': 'Say hello',
  'JUST SIMPLE LIFE': 'JUST SIMPLE LIFE',
  'SEBUAH PERJALANAN TENTANG': 'A JOURNEY ABOUT',
  'SEBUAH BUKU TENTANG': 'A BOOK ABOUT',
  'IDE, PROSES & PERJALANAN': 'IDEAS, PROCESS & CRAFT',
  'LIHAT JEJAK': 'EXPLORE JOURNEY',
  'BUKA BUKU': 'OPEN BOOK',
  'The': 'The',
  'Journey': 'Journey',
  'making': 'making',
  'of me': 'of me',
  'of things.': 'of things.',
  'RESUME/ VOL.01': 'RESUME / VOL.01',
  'PORTFOLIO / VOL. 01': 'PORTFOLIO / VOL. 01',
  '2021 - NOW': '2021 — NOW',
  '2025—NOW': '2025 — NOW',
  'Tentang': 'About',
  'Pendidikan': 'Education',
  'Pengalaman': 'Experience',
  'Perjalanan': 'Journey',
  'Keahlian': 'Skills',
  'Portofolio': 'Portfolio',
  'Karya pilihan': 'Selected Works',
  'Penutup': 'Closing',
  '2021-NOW': '2021 — NOW',
  'JEJAK DIGITAL': 'DIGITAL FOOTPRINT',
  'PORTFOLIO DIGITAL': 'DIGITAL PORTFOLIO',
  'EDISI 2026': '2026 EDITION',
  'EDISI 2025': '2025 EDITION',
  'SAMPUL': 'COVER',
  'DAFTAR ISI': 'TABLE OF CONTENTS',
  'CATATAN PERJALANAN': 'JOURNEY NOTES',
  'GULIR UNTUK MEMBUKA': 'SCROLL TO OPEN',
  'Halo, saya ': 'Hello, I’m ',
  'Halo, saya': 'Hello, I’m ',
  'Hai, saya ': 'Hi, I’m ',
  'Hai, saya': 'Hi, I’m ',
  'Merangkai ide menjadi pengalaman digital yang bermakna.': 'Crafting ideas into meaningful digital experiences.',
  'Membangun aplikasi web end-to-end, REST API berskala nasional, dan solusi data interaktif.': 'Building end-to-end web applications, national-scale REST APIs, and interactive data solutions.',
  '01 / TENTANG SAYA': '01 / ABOUT ME',
  'Lihat pendidikan saya': 'Explore my education',
  'CATATAN\n01 — 06': 'NOTES\n01 — 06',
  'FIG. 01 — A WORK IN PROGRESS': 'FIG. 01 — A WORK IN PROGRESS',
  'OPEN\nTO IDEAS': 'OPEN\nTO IDEAS',
  'BERBASIS DI': 'BASED IN',
  'FOKUS': 'FOCUS',
  'EMAIL': 'EMAIL',
  'WEBSITE': 'WEBSITE',
  'RESUME': 'RESUME',
  'Kunjungi ↗': 'Visit ↗',
  'Lihat resume ↗': 'View resume ↗',
  'Ganti foto\nprofil Anda': 'Change profile\nphoto',
  '02 / AKAR & ARAH': '02 / ROOTS & DIRECTION',
  'Terus belajar,': 'Lifelong learning,',
  'selalu ada bab baru.': 'always a new chapter.',
  'SEKARANG': 'PRESENT',
  'SERTIFIKASI': 'CERTIFICATIONS',
  '04 / BEKAL DI PERJALANAN': '04 / TOOLS & MINDSET',
  'Alat dan cara berpikir': 'Tools and ways of thinking',
  'untuk terus bertumbuh.': 'to continuously grow.',
  'TOOLKIT / 001': 'TOOLKIT / 001',
  'Teknologi yang': 'Technologies',
  'akrab di tangan.': 'close at hand.',
  '02 / JEJAK LANGKAH': '02 / MILESTONES & JOURNEY',
  'Setiap langkah,': 'Every single step,',
  'membentuk cerita.': 'shapes the story.',
  ' BAB': ' CHAPTERS',
  'Perjalanan berikutnya segera ditulis.': 'Next chapter will be written soon.',
  '03 / PILIHAN KARYA': '03 / SELECTED WORKS',
  'Sedikit dari': 'A glimpse of',
  'yang sudah dibuat.': 'what has been crafted.',
  'STUDY IN\nMAKING': 'STUDY IN\nMAKING',
  'LIVE ↗': 'LIVE ↗',
  'REPO ↗': 'REPO ↗',
  'PREVIEW IFRAME': 'LIVE IFRAME',
  'Buka di Tab Baru ↗': 'Open in New Tab ↗',
  'Tutup': 'Close',
  'Muat Ulang': 'Reload',
  'Live Demo (iFrame)': 'Live Web (iFrame)',
  'Media & Deskripsi': 'Media & Description',
  'VIDEO': 'VIDEO',
  'TAHUN': 'YEAR',
  'TEKNOLOGI': 'TECH STACK',
  'Semua': 'All',
  '🏢 Projek Kantor': '🏢 Work Projects',
  '💡 Projek Pribadi': '💡 Personal Projects',
  '01 / PROJEK KANTOR & ENTERPRISE': '01 / ENTERPRISE & WORK PROJECTS',
  'Platform skala enterprise, sistem pemerintahan, dan arsitektur backend skala besar.': 'Enterprise-scale platforms, government systems, and large-scale backend architectures.',
  '02 / PROJEK PRIBADI & EKSPERIMEN': '02 / PERSONAL & EXPERIMENTAL PROJECTS',
  'Eksplorasi ide mandiri, produk sampingan, dan eksperimen teknologi.': 'Independent explorations, side products, and experimental technologies.',
  'Ruang Projek Pribadi': 'Personal Project Space',
  'Belum ada projek pribadi yang ditambahkan. Anda dapat menambahkannya melalui portal admin.': 'No personal projects added yet. You can add them anytime via the admin portal.',
  '🏢 KANTOR': '🏢 WORK',
  '💡 PRIBADI': '💡 PERSONAL',
  'Karya pilihan akan segera ditambahkan.': 'Selected projects will be added soon.',
  '06 / PENUTUP': '06 / CLOSING',
  'Ujung halaman?': 'End of the page?',
  'Belum. Mari mulai': 'Not yet. Let us begin',
  'cerita yang baru.': 'a new story.',
  'SAMPAI JUMPA': 'SEE YOU SOON',
}

export const uiStrings = {
  id: {
    backCoverAria: 'Kembali ke sampul',
    tocAria: 'Daftar isi buku',
    prevPageAria: 'Halaman sebelumnya',
    nextPageAria: 'Halaman berikutnya',
    brandAria: 'Kembali ke sampul',
    openBookAria: 'Buka buku portofolio',
    aboutKicker: '01 / TENTANG SAYA',
    aboutGreeting: 'Halo, saya ',
    aboutNextBtn: 'Lihat pendidikan saya',
    aboutChangePhoto: 'Ganti foto\nprofil Anda',
    aboutBasedIn: 'BERBASIS DI',
    aboutFocus: 'FOKUS',
    aboutEmail: 'EMAIL',
    aboutWebsite: 'WEBSITE',
    aboutResume: 'RESUME',
    aboutVisit: 'Kunjungi ↗',
    aboutViewResume: 'Lihat resume ↗',
    aboutNotes: 'CATATAN\n01 — 06',
    aboutFig: 'FIG. 01 — A WORK IN PROGRESS',
    aboutOpenToIdeas: 'OPEN\nTO IDEAS',
    journeyKicker: '02 / JEJAK LANGKAH',
    journeyIntro: 'Setiap langkah,',
    journeyHeading: 'membentuk cerita.',
    journeyChapters: ' BAB',
    journeyPresent: 'SEKARANG',
    journeyEmpty: 'Perjalanan berikutnya segera ditulis.',
    workKicker: '03 / PILIHAN KARYA',
    workIntro: 'Sedikit dari',
    workHeading: 'yang sudah dibuat.',
    workEmpty: 'Karya pilihan akan segera ditambahkan.',
    workStudyInMaking: 'STUDY IN\nMAKING',
    workLive: 'LIVE ↗',
    workRepo: 'REPO ↗',
    workLiveIframe: 'PREVIEW IFRAME',
    workOpenTab: 'Buka di Tab Baru ↗',
    workClose: 'Tutup',
    workReload: 'Muat Ulang',
    workIframeNotice: 'Catatan: Beberapa web membatasi preview iframe karena aturan keamanan. Jika kosong, klik tombol Buka di Tab Baru.',
    workTabIframe: 'Live Demo (iFrame)',
    workTabMedia: 'Media & Deskripsi',
    workVideoBadge: 'VIDEO',
    workYear: 'TAHUN',
    workTech: 'TEKNOLOGI',
    workFilterAll: 'Semua',
    workFilterWork: '🏢 Projek Kantor',
    workFilterPersonal: '💡 Projek Pribadi',
    workGroupWork: '01 / PROJEK KANTOR & ENTERPRISE',
    workGroupWorkDesc: 'Platform skala enterprise, sistem pemerintahan, dan arsitektur backend skala besar.',
    workGroupPersonal: '02 / PROJEK PRIBADI & EKSPERIMEN',
    workGroupPersonalDesc: 'Eksplorasi ide mandiri, produk sampingan, dan eksperimen teknologi.',
    workEmptyPersonalTitle: 'Ruang Projek Pribadi',
    workEmptyPersonalDesc: 'Belum ada projek pribadi yang ditambahkan. Anda dapat menambahkannya melalui portal admin.',
    workBadgeWork: '🏢 KANTOR',
    workBadgePersonal: '💡 PRIBADI',
    skillsKicker: '04 / BEKAL DI PERJALANAN',
    skillsIntro: 'Alat dan cara berpikir',
    skillsHeading: 'untuk terus bertumbuh.',
    skillsLevelAria: (level) => `Level ${level} dari 5`,
    skillsToolkit: 'TOOLKIT / 001',
    skillsToolkitTitle1: 'Teknologi yang',
    skillsToolkitTitle2: 'akrab di tangan.',
    educationKicker: '02 / AKAR & ARAH',
    educationIntro: 'Terus belajar,',
    educationHeading: 'selalu ada bab baru.',
    educationPresent: 'SEKARANG',
    certLabel: 'SERTIFIKASI',
    certAria: (name) => `Lihat sertifikat ${name}`,
    closingKicker: '06 / PENUTUP',
    closingFarewell: 'SAMPAI JUMPA',
    loadingText: 'Menghubungkan ke backend lokal...',
    errorEyebrow: 'KONEKSI BACKEND GAGAL',
    errorHeading: 'Backend tidak terhubung.',
    errorDesc: 'Periksa log Go API di terminal tempat backend dijalankan, lalu coba lagi.',
    errorReload: 'Muat ulang',
    langAria: 'Pilih bahasa / Select language',
  },
  en: {
    backCoverAria: 'Back to cover',
    tocAria: 'Table of contents',
    prevPageAria: 'Previous page',
    nextPageAria: 'Next page',
    brandAria: 'Back to cover',
    openBookAria: 'Open portfolio book',
    aboutKicker: '01 / ABOUT ME',
    aboutGreeting: 'Hello, I’m ',
    aboutNextBtn: 'Explore my education',
    aboutChangePhoto: 'Change profile\nphoto',
    aboutBasedIn: 'BASED IN',
    aboutFocus: 'FOCUS',
    aboutEmail: 'EMAIL',
    aboutWebsite: 'WEBSITE',
    aboutResume: 'RESUME',
    aboutVisit: 'Visit ↗',
    aboutViewResume: 'View resume ↗',
    aboutNotes: 'NOTES\n01 — 06',
    aboutFig: 'FIG. 01 — A WORK IN PROGRESS',
    aboutOpenToIdeas: 'OPEN\nTO IDEAS',
    journeyKicker: '02 / MILESTONES & JOURNEY',
    journeyIntro: 'Every single step,',
    journeyHeading: 'shapes the story.',
    journeyChapters: ' CHAPTERS',
    journeyPresent: 'PRESENT',
    journeyEmpty: 'Next chapter will be written soon.',
    workKicker: '03 / SELECTED WORKS',
    workIntro: 'A glimpse of',
    workHeading: 'what has been crafted.',
    workEmpty: 'Selected projects will be added soon.',
    workStudyInMaking: 'STUDY IN\nMAKING',
    workLive: 'LIVE ↗',
    workRepo: 'REPO ↗',
    workLiveIframe: 'LIVE IFRAME',
    workOpenTab: 'Open in New Tab ↗',
    workClose: 'Close',
    workReload: 'Reload',
    workIframeNotice: 'Note: Some external websites restrict iframe embedding. If blank, please click Open in New Tab.',
    workTabIframe: 'Live Web (iFrame)',
    workTabMedia: 'Media & Description',
    workVideoBadge: 'VIDEO',
    workYear: 'YEAR',
    workTech: 'TECH STACK',
    workFilterAll: 'All',
    workFilterWork: '🏢 Work Projects',
    workFilterPersonal: '💡 Personal Projects',
    workGroupWork: '01 / ENTERPRISE & WORK PROJECTS',
    workGroupWorkDesc: 'Enterprise-scale platforms, government systems, and large-scale backend architectures.',
    workGroupPersonal: '02 / PERSONAL & EXPERIMENTAL PROJECTS',
    workGroupPersonalDesc: 'Independent explorations, side products, and experimental technologies.',
    workEmptyPersonalTitle: 'Personal Project Space',
    workEmptyPersonalDesc: 'No personal projects added yet. You can add them anytime via the admin portal.',
    workBadgeWork: '🏢 WORK',
    workBadgePersonal: '💡 PERSONAL',
    skillsKicker: '04 / TOOLS & MINDSET',
    skillsIntro: 'Tools and ways of thinking',
    skillsHeading: 'to continuously grow.',
    skillsLevelAria: (level) => `Level ${level} of 5`,
    skillsToolkit: 'TOOLKIT / 001',
    skillsToolkitTitle1: 'Technologies',
    skillsToolkitTitle2: 'close at hand.',
    educationKicker: '02 / ROOTS & DIRECTION',
    educationIntro: 'Lifelong learning,',
    educationHeading: 'always a new chapter.',
    educationPresent: 'PRESENT',
    certLabel: 'CERTIFICATIONS',
    certAria: (name) => `View certificate ${name}`,
    closingKicker: '06 / CLOSING',
    closingFarewell: 'SEE YOU SOON',
    loadingText: 'Connecting to local backend...',
    errorEyebrow: 'BACKEND CONNECTION FAILED',
    errorHeading: 'Backend not connected.',
    errorDesc: 'Check the Go API logs in your terminal and try again.',
    errorReload: 'Reload',
    langAria: 'Select language',
  },
}

export const contentDictionary = {
  // === PROFILES ===
  'Nama Anda': 'Your Name',
  'Syarifudin Yoga Pinasty': 'Syarifudin Yoga Pinasty',
  'Fullstack Software Engineer': 'Fullstack Software Engineer',
  'Software Engineer': 'Software Engineer',
  'Backend Developer': 'Backend Developer',
  'Fullstack Developer': 'Fullstack Developer',
  'Merangkai ide menjadi pengalaman digital yang bermakna.': 'Crafting ideas into meaningful digital experiences.',
  'Membangun aplikasi web end-to-end, REST API berskala nasional, dan solusi data interaktif.': 'Building end-to-end web applications, national-scale REST APIs, and interactive data solutions.',
  'Saya adalah developer yang senang membangun produk digital dengan perhatian pada detail, performa, dan pengalaman pengguna. Ganti cerita ini dengan perkenalan dan fokus profesional Anda.':
    'I am a developer who loves crafting digital products with great attention to detail, performance, and user experience. Driven by problem-solving and modern web engineering.',
  'Software Engineer dengan pengalaman lebih dari 4 tahun dalam pengembangan perangkat lunak dan teknologi informasi. Memiliki pengalaman dalam merancang, mengembangkan, dan mengoptimalkan aplikasi serta sistem yang skalabel, andal, dan berorientasi pada kebutuhan pengguna. Terbiasa bekerja dengan berbagai teknologi modern dalam pengembangan aplikasi, pengelolaan basis data, integrasi sistem, serta implementasi solusi berbasis cloud dan container.\n\nMemiliki pengalaman menangani proyek dengan skala dan kompleksitas yang beragam, termasuk platform dengan lebih dari 700.000 pengguna. Memiliki kemampuan analitis, pemecahan masalah, serta mampu bekerja secara mandiri maupun kolaboratif. Berkomitmen untuk terus mengembangkan kompetensi dan memberikan solusi teknologi yang efektif, efisien, dan bernilai bagi organisasi.':
    'Software Engineer with over 4 years of experience in software development and information technology. Experienced in designing, developing, and optimizing scalable, reliable, and user-centric systems and applications. Well-versed with modern technologies across application development, database management, system integration, as well as cloud and container solutions.\n\nExperienced in handling projects of diverse scale and complexity, including high-traffic platforms serving over 700,000 active users. Possesses strong analytical and problem-solving skills, capable of delivering results both independently and collaboratively. Committed to continuous growth and delivering effective, high-impact technology solutions.',
  // Bio Paragraph 1
  'Fullstack Software Engineer dengan 5+ tahun pengalaman dalam membangun aplikasi web end-to-end, REST API berskala besar, dan dashboard visualisasi data interaktif. Menguasai JavaScript (ReactJS, Next.js, Node.js, NestJS, ExpressJS), PHP (Laravel, CodeIgniter), Python, Ruby on Rails, dan Go.':
    'Fullstack Software Engineer with 5+ years of experience building end-to-end web applications, scalable REST APIs, and interactive data visualization dashboards. Proficient in JavaScript (ReactJS, Next.js, Node.js, NestJS, ExpressJS), PHP (Laravel, CodeIgniter), Python, Ruby on Rails, and Go.',
  // Bio Paragraph 2
  'Berpengalaman dalam cloud-native deployment dengan Docker, Kubernetes, dan Google Cloud Platform (GCP), serta pengembangan pipeline ETL dan data warehousing. Terbukti berhasil menghadirkan platform berskala nasional yang melayani 700.000+ pengguna aktif serta solusi otomasi cerdas terintegrasi AI.':
    'Experienced in cloud-native deployment with Docker, Kubernetes, and Google Cloud Platform (GCP), as well as ETL pipeline development and data warehousing. Proven track record of delivering national-scale platforms serving 700,000+ active users and AI-integrated intelligent automation solutions.',
  // Bio Combined
  'Fullstack Software Engineer dengan 5+ tahun pengalaman dalam membangun aplikasi web end-to-end, REST API berskala besar, dan dashboard visualisasi data interaktif. Menguasai JavaScript (ReactJS, Next.js, Node.js, NestJS, ExpressJS), PHP (Laravel, CodeIgniter), Python, Ruby on Rails, dan Go.\n\nBerpengalaman dalam cloud-native deployment dengan Docker, Kubernetes, dan Google Cloud Platform (GCP), serta pengembangan pipeline ETL dan data warehousing. Terbukti berhasil menghadirkan platform berskala nasional yang melayani 700.000+ pengguna aktif serta solusi otomasi cerdas terintegrasi AI.':
    'Fullstack Software Engineer with 5+ years of experience building end-to-end web applications, scalable REST APIs, and interactive data visualization dashboards. Proficient in JavaScript (ReactJS, Next.js, Node.js, NestJS, ExpressJS), PHP (Laravel, CodeIgniter), Python, Ruby on Rails, and Go.\n\nExperienced in cloud-native deployment with Docker, Kubernetes, and Google Cloud Platform (GCP), as well as ETL pipeline development and data warehousing. Proven track record of delivering national-scale platforms serving 700,000+ active users and AI-integrated intelligent automation solutions.',

  // Locations
  'Kota Anda, Indonesia': 'Your City, Indonesia',
  'Sumedang, Indonesia': 'Sumedang, Indonesia',
  'Jakarta Selatan': 'South Jakarta, Indonesia',
  'Jakarta Selatan, Indonesia': 'South Jakarta, Indonesia',
  'Bandung, Jawa Barat': 'Bandung, West Java, Indonesia',
  'Cimalaka, Sumedang, Jawa Barat 45353': 'Sumedang, West Java, Indonesia 45353',
  'Cimalaka, Sumedang, Jawa Barat  45353': 'Sumedang, West Java, Indonesia 45353',
  'Cimalaka, Sumedang, Jawa Barat': 'Sumedang, West Java, Indonesia',
  'Sumedang, Jawa Barat': 'Sumedang, West Java, Indonesia',

  // === EXPERIENCES ===
  'Studio Kreatif': 'Creative Studio',
  'PT Infomedia Nusantara': 'PT Infomedia Nusantara',
  'PT Bee Solution Partners': 'PT Bee Solution Partners',
  'Merancang arsitektur backend, REST API berkinerja tinggi, dan pipeline ETL data warehouse untuk platform skala enterprise dan nasional.':
    'Architecting backend systems, high-performance REST APIs, and data warehouse ETL pipelines for enterprise and national-scale platforms.',
  'Merancang arsitektur REST API scalable menggunakan JavaScript, Go, dan Python untuk mendukung platform berskala nasional dengan 700.000+ pengguna aktif dan high-concurrency traffic.':
    'Architected scalable REST API services using JavaScript, Go, and Python supporting national-scale platforms with 700,000+ active users under high-concurrency traffic.',
  'Mengembangkan end-to-end ETL pipeline untuk integrasi enterprise data warehouse, mereduksi latency pemrosesan data, dan memastikan sinkronisasi data real-time antar sistem.':
    'Engineered end-to-end ETL pipelines for enterprise data warehouse integration, reducing processing latency and ensuring real-time cross-system data synchronization.',
  'Mendeploy dan mengelola containerized microservices menggunakan Docker dan Kubernetes, meningkatkan reliabilitas sistem dan kapabilitas horizontal scaling saat peak loads.':
    'Deployed and orchestrated containerized microservices using Docker and Kubernetes, boosting system reliability and horizontal scaling capabilities during peak loads.',
  'Mengoptimalkan performa dan infrastruktur backend untuk Rekrutmen Bersama BUMN, menjamin stabilitas sistem selama masa rekrutmen nasional.':
    'Optimized backend performance and infrastructure for BUMN Joint Recruitment, ensuring rock-solid stability throughout national recruitment periods.',
  'Mengintegrasikan API chatbot Twitter bertenaga AI untuk Transjakarta dan Telkomsel guna mengotomatiskan alur kerja customer service dan query handling real-time.':
    'Integrated AI-powered Twitter chatbot APIs for Transjakarta and Telkomsel to automate customer service workflows and real-time query handling at enterprise scale.',
  'Membangun API integrasi mail engine untuk Bank Sinarmas (BSIM), mempercepat proses pengiriman dan pelacakan email transaksional perbankan enterprise.':
    'Built transactional mail engine API integration for Bank Sinarmas (BSIM), accelerating transactional email dispatch and tracking across enterprise banking infrastructure.',
  'Membangun 4+ aplikasi web fullstack untuk instansi pemerintah dan klien telekomunikasi dari tahap analisis kebutuhan hingga deployment produksi.':
    'Delivered 4+ fullstack web applications for government agencies and telecommunication clients from requirements analysis to production deployment.',
  'Menyelesaikan 4+ aplikasi web fullstack menggunakan PHP, JavaScript, dan Python untuk instansi pemerintah dan klien telekomunikasi dari tahap requirement gathering hingga deployment produksi.':
    'Delivered 4+ fullstack web applications using PHP, JavaScript, and Python for government agencies and telecommunication clients from requirements gathering to production deployment.',
  'Merancang dashboard visualisasi data interaktif dengan Apache Superset untuk monitoring KPI real-time program KORSABHARA dan BNN-LKN.':
    'Designed interactive data visualization dashboards with Apache Superset for real-time KPI monitoring across KORSABHARA and BNN-LKN law enforcement programs.',
  'Mengembangkan platform Telkom Tour secara end-to-end dengan frontend responsif ReactJS dan arsitektur RESTful API backend yang aman.':
    'Engineered Telkom Tour tourism platform end-to-end featuring a responsive ReactJS frontend and secure backend RESTful API architecture.',
  'Mengelola dan meningkatkan sistem internal BSP dengan otomasi pelaporan yang mengeliminasi workflow manual repetitif dan meningkatkan efisiensi operasional.':
    'Maintained and modernized BSP internal systems with reporting automation, eliminating repetitive manual workflows and elevating operational efficiency.',
  'Membangun produk web end-to-end bersama tim desain dan produk.': 'Building end-to-end web products alongside product and design teams.',
  'Mengembangkan layanan API yang mudah dirawat': 'Developing maintainable, scalable API services',
  'Meningkatkan pengalaman pengguna melalui iterasi berbasis feedback': 'Improving user experience through feedback-driven iterations',
  'Membangn Backend Aplikasi': 'Designing, developing, and optimizing robust backend applications and integration services.',

  // === EDUCATION ===
  'Universitas Anda': 'Your University',
  'Universitas Jenderal Achmad Yani': 'General Achmad Yani University',
  'Sarjana': "Bachelor's Degree",
  'Magister': "Master's Degree",
  'Diploma': 'Diploma',
  'S.Kom': 'Bachelor of Computer Science (S.Kom)',
  'Sarjana Komputer (S.Kom)': 'Bachelor of Computer Science (S.Kom)',
  'Teknik Informatika (Data & Software Engineering)': 'Informatics Engineering (Data & Software Engineering)',
  'Ilmu Komputer': 'Computer Science',
  'Teknik Informatika': 'Informatics Engineering',
  'Sistem Informasi': 'Information Systems',
  'Desain Komunikasi Visual': 'Visual Communication Design',
  'Konsentrasi Data and Software Engineering. Skripsi: Sistem Pendukung Keputusan Penentuan Rumah Tidak Layak Huni Menggunakan Multi-Attribute Utility Theory (MAUT).':
    'Concentration in Data & Software Engineering. Thesis: Decision Support System for Uninhabitable House Assistance Eligibility Using Multi-Attribute Utility Theory (MAUT).',
  'Ganti dengan pendidikan, pencapaian, atau fokus studi Anda.': 'Academic background, achievements, and technical specialization.',

  // === CERTIFICATIONS ===
  'Google Cybersecurity Certificate': 'Google Cybersecurity Certificate',
  'Google Business Intelligence Certificate': 'Google Business Intelligence Certificate',
  'IBM Back-End Development Certificate': 'IBM Back-End Development Certificate',
  'Google IT Support Professional Certificate': 'Google IT Support Professional Certificate',
  'Belajar Dasar Pemrograman JavaScript': 'Fundamentals of JavaScript Programming',
  'Memulai Pemrograman Dengan Python': 'Getting Started with Python Programming',

  // === PROJECTS ===
  'Rekrutmen Bersama BUMN - Backend Infrastructure & API': 'Rekrutmen Bersama BUMN - Backend Infrastructure & API',
  'Optimasi infrastruktur backend dan integrasi API berskala nasional untuk Rekrutmen Bersama BUMN, menjamin performa stabil dan high availability saat melayani 700.000+ pelamar secara serentak.':
    'Optimized backend infrastructure and national-scale API integration for BUMN Joint Recruitment, ensuring high availability and seamless stability while serving 700,000+ concurrent applicants.',
  'BSIM Transactional Mail Engine API': 'BSIM Transactional Mail Engine API',
  'Pembangunan API integrasi mail engine untuk Bank Sinarmas (BSIM), mempercepat otomasi pengiriman dan pelacakan status email transaksional di sistem perbankan enterprise.':
    'Engineered transactional mail engine API integration for Bank Sinarmas (BSIM), accelerating automated delivery and delivery status tracking across enterprise banking systems.',
  'Enterprise Data Warehouse & Real-time ETL Pipeline': 'Enterprise Data Warehouse & Real-time ETL Pipeline',
  'Perancangan dan implementasi pipeline ETL end-to-end untuk integrasi enterprise data warehouse, mereduksi latency pemrosesan data, serta memastikan sinkronisasi data antar sistem secara real-time.':
    'Architected and deployed end-to-end ETL pipelines for enterprise data warehouse integration, reducing processing latency and maintaining real-time data synchronization across systems.',
  'AI-Powered Customer Service Chatbot (Transjakarta & Telkomsel)': 'AI-Powered Customer Service Chatbot (Transjakarta & Telkomsel)',
  'Integrasi API chatbot Twitter bertenaga AI untuk Transjakarta dan Telkomsel yang mengotomatiskan alur kerja customer service dan query handling pelanggan secara real-time pada skala besar.':
    'Integrated AI-powered Twitter chatbot APIs for Transjakarta and Telkomsel, automating customer support workflows and real-time customer query handling at enterprise scale.',
  'Telkom Tour Tourism Platform': 'Telkom Tour Tourism Platform',
  'Pengembangan platform pariwisata Telkom Tour secara end-to-end dengan implementasi frontend interaktif ReactJS dan backend RESTful API yang aman.':
    'End-to-end development of the Telkom Tour travel platform, featuring an interactive ReactJS frontend and secure backend RESTful APIs.',
  'KORSABHARA & BNN-LKN Interactive Monitoring Dashboard': 'KORSABHARA & BNN-LKN Interactive Monitoring Dashboard',
  'Dashboard visualisasi data interaktif menggunakan Apache Superset untuk monitoring KPI real-time program kerja instansi kepolisian KORSABHARA dan Badan Narkotika Nasional (BNN-LKN).':
    'Interactive data visualization dashboard built with Apache Superset for real-time KPI monitoring across KORSABHARA police operations and National Narcotics Board (BNN-LKN).',
  'SPK Penentuan Rumah Tidak Layak Huni (MAUT)': 'Decision Support System for Housing Assistance (MAUT)',
  'Sistem pendukung keputusan penentuan kelayakan bantuan rumah tidak layak huni berbasis web menggunakan metode Multi-Attribute Utility Theory (MAUT) dengan pembobotan multi-kriteria.':
    'Web-based decision support system for uninhabitable housing assistance eligibility using the Multi-Attribute Utility Theory (MAUT) method with multi-criteria weighting.',
  'Platform sederhana untuk mengumpulkan cerita dan ide dalam satu ruang yang nyaman.':
    'A comfortable digital space for curating personal stories, notes, and creative ideas.',
  'Eksplorasi identitas digital yang menghubungkan narasi, visual, dan interaksi.':
    'An exploratory digital identity project intertwining narrative, visual design, and user interaction.',

  // Project Categories
  'Enterprise Platform': 'Enterprise Platform',
  'Banking Integration': 'Banking Integration',
  'Data Engineering': 'Data Engineering',
  'AI & Automation': 'AI & Automation',
  'Fullstack Web Application': 'Fullstack Web Application',
  'Data Visualization': 'Data Visualization',
  'Decision Support System': 'Decision Support System',

  // === SKILLS & TECH CATEGORIES ===
  'Backend & Arsitektur': 'Backend & Architecture',
  'Bahasa Pemrograman': 'Programming Languages',
  'Data & Visualisasi': 'Data & Visualization',
  'DevOps & Cloud': 'DevOps & Cloud',
  'Frontend': 'Frontend',
  'Backend': 'Backend',
  'Integrasi & AI': 'AI & Integration',
  'Bahasa': 'Languages',
  'Basis Data': 'Databases',
  'Message Broker': 'Message Brokers',
  'Cara kerja': 'Ways of Working',
  'Keahlian': 'Core Competencies',
  'Kolaborasi tim': 'Team Collaboration',
  'Desain Sistem': 'System Design',
}

export function translateContent(text, lang = 'id') {
  if (!text || typeof text !== 'string' || lang === 'id') return text
  const trimmed = text.trim()
  if (!trimmed) return text

  // 1. Direct dictionary matches
  if (contentDictionary[trimmed]) return contentDictionary[trimmed]
  if (customTextTranslations[trimmed]) return customTextTranslations[trimmed]

  // 2. Whitespace and line break normalization match
  const normalizedKey = trimmed.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ')
  for (const [k, v] of Object.entries(contentDictionary)) {
    if (k.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ') === normalizedKey) {
      return v
    }
  }
  for (const [k, v] of Object.entries(customTextTranslations)) {
    if (k.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ') === normalizedKey) {
      return v
    }
  }

  // 3. Multi-paragraph match: split by \n\n or \n and translate each piece
  if (trimmed.includes('\n')) {
    const delimiter = trimmed.includes('\n\n') ? '\n\n' : '\n'
    const parts = trimmed.split(delimiter)
    const translatedParts = parts.map((part) => {
      const pTrimmed = part.trim()
      if (!pTrimmed) return part
      return contentDictionary[pTrimmed] || customTextTranslations[pTrimmed] || part
    })
    if (translatedParts.some((p, i) => p !== parts[i].trim())) {
      return translatedParts.join(delimiter)
    }
  }

  // 4. Case-insensitive match
  const lower = trimmed.toLowerCase()
  for (const [k, v] of Object.entries(contentDictionary)) {
    if (k.trim().toLowerCase() === lower) return v
  }
  for (const [k, v] of Object.entries(customTextTranslations)) {
    if (k.trim().toLowerCase() === lower) return v
  }

  return text
}

export function resolveTexts(saved, lang = 'id') {
  const currentLang = lang === 'en' ? 'en' : 'id'
  const baseDefaults = currentLang === 'en' ? defaultTextsEN : defaultTextsID
  const result = { ...baseDefaults, ...uiStrings[currentLang] }

  if (currentLang === 'id') {
    for (const [key, value] of Object.entries(saved || {})) {
      if (typeof value === 'string' && value.trim()) {
        result[key] = value
      }
    }
  } else {
    for (const [key, value] of Object.entries(saved || {})) {
      if (typeof value === 'string' && value.trim()) {
        const trimmed = value.trim()
        const isDefaultID = defaultTextsID[key] && trimmed === defaultTextsID[key].trim()
        const translated = translateContent(trimmed, 'en')

        if (translated && translated !== trimmed) {
          result[key] = translated
        } else if (isDefaultID && defaultTextsEN[key]) {
          result[key] = defaultTextsEN[key]
        } else if (defaultTextsEN[key] && !trimmed) {
          result[key] = defaultTextsEN[key]
        } else {
          result[key] = translated || value
        }
      }
    }
  }

  return result
}

export function localizePortfolio(portfolio, lang = 'id') {
  if (!portfolio || lang === 'id') return portfolio

  const translate = (str) => translateContent(str, lang)

  return {
    ...portfolio,
    profile: {
      ...portfolio.profile,
      role: translate(portfolio.profile.role),
      headline: translate(portfolio.profile.headline),
      about: translate(portfolio.profile.about),
      location: translate(portfolio.profile.location),
    },
    experiences: (portfolio.experiences || []).map((exp) => ({
      ...exp,
      role: translate(exp.role),
      company: translate(exp.company),
      location: translate(exp.location),
      description: translate(exp.description),
      highlights: (exp.highlights || []).map(translate),
    })),
    education: (portfolio.education || []).map((edu) => ({
      ...edu,
      institution: translate(edu.institution),
      degree: translate(edu.degree),
      field: translate(edu.field),
      description: translate(edu.description),
    })),
    certifications: (portfolio.certifications || []).map((cert) => ({
      ...cert,
      name: translate(cert.name),
      issuer: translate(cert.issuer),
    })),
    skills: (portfolio.skills || []).map((skill) => ({
      ...skill,
      name: translate(skill.name),
      category: translate(skill.category),
    })),
    techStack: (portfolio.techStack || []).map((tech) => ({
      ...tech,
      category: translate(tech.category),
    })),
    projects: (portfolio.projects || []).map((proj) => ({
      ...proj,
      title: translate(proj.title),
      category: translate(proj.category),
      description: translate(proj.description),
    })),
  }
}

export function lines(text) {
  if (!text) return ''
  return text.split('\n').flatMap((line, index) => (index === 0 ? [line] : [createElement('br', { key: index }), line]))
}

