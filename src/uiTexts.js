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
  { key: 'closingIntro', label: 'Penutup: pembuka', value: 'Ujung halaman?', group: 'Penutup' },
  { key: 'closingTitle1', label: 'Penutup: judul baris 1', value: 'Belum. Mari mulai', group: 'Penutup' },
  { key: 'closingTitle2', label: 'Penutup: judul baris 2 (miring)', value: 'cerita yang baru.', group: 'Penutup' },
]

export const defaultTexts = Object.fromEntries(uiTextFields.map((field) => [field.key, field.value]))

export function resolveTexts(saved) {
  const result = { ...defaultTexts }
  for (const [key, value] of Object.entries(saved || {})) {
    if (key in result && typeof value === 'string' && value.trim()) result[key] = value
  }
  return result
}

export function lines(text) {
  return text.split('\n').flatMap((line, index) => (index === 0 ? [line] : [createElement('br', { key: index }), line]))
}
