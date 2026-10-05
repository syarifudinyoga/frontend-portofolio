# Portfolio Web — React + Vite

Frontend independen untuk portfolio buku perjalanan. Semua detail visual dan interaksi berada di React; konten dimuat lewat endpoint `/api/portfolio`. Mode lokal menggunakan Vite untuk meneruskan request `/api` ke Go backend.

## Jalankan lokal (tanpa container)

Frontend dan API jalan di komputer lokal; PostgreSQL lokal harus aktif dan API Go dijalankan di `http://127.0.0.1:3004`.

```sh
cp .env.example .env
npm ci
npm run dev
```

Buka `http://127.0.0.1:3005`. Vite membaca `.env` lokal dan meneruskan request `/api` ke Go API; browser tidak perlu mengakses PostgreSQL langsung dan tidak perlu konfigurasi CORS. Halaman pengelolaan data tersedia lewat URL manual `http://127.0.0.1:3005/myconfig`, lalu masukkan `ADMIN_KEY` yang diatur di `.env` backend. Migration dan isi data portfolio dimiliki repository backend.

Di sampul, klik buku atau scroll ke bawah untuk membuka spread dua halaman; di perangkat sentuh, swipe ke atas juga membuka buku.

## Build dan publikasi

```sh
podman build -f Containerfile -t portfolio-web:local .
```

Jenkinsfile frontend hanya menjalankan `npm ci`/`npm run build`, lalu membangun dan push image web ke `ghcr.io/<GHCR_OWNER>/portfolio-web` (tag nomor build dan `latest`) pada branch `main`. Job ini tidak membangun backend.

Tambahkan credential Jenkins jenis username/password dengan ID `ghcr-creds` dan environment variable `GHCR_OWNER`. Credential memakai GitHub username dan PAT dengan izin `write:packages`.

## Deploy di homeserver

Atur `.env` berisi GHCR owner, `IMAGE_TAG`, `API_UPSTREAM` yang mengarah ke alamat API backend yang bisa dijangkau dari container web, dan `WEB_PORT`. Lalu jalankan:

```sh
podman compose pull
podman compose up -d
```

Frontend dan API dideploy terpisah. Nginx di container web meneruskan `/api/*` ke `API_UPSTREAM`, sehingga browser tetap memakai origin yang sama dan tidak perlu konfigurasi CORS. Pastikan alamat API dapat diakses dari container web. Batasi akses port API di firewall ke jaringan/host tepercaya dan gunakan TLS pada reverse proxy publik.
