# Portfolio Web — React + Vite

Frontend independen untuk portfolio buku perjalanan. Semua detail visual dan interaksi berada di React; konten dimuat lewat endpoint `/api/portfolio`. Nginx melayani aplikasi dan reverse proxy `/api/` ke backend yang ditentukan saat container dijalankan.

## Jalankan lokal

1. Salin `.env.example` menjadi `.env`. Isi `GHCR_OWNER`; pastikan `API_UPSTREAM` menunjuk ke alamat API yang dapat dijangkau dari container web. Pada Podman, `host.containers.internal` biasanya tersedia; pada Docker/Linux, gunakan IP/domain homeserver atau konfigurasi host gateway yang sesuai.
2. Jalankan `podman compose up --build` (atau gunakan `docker compose`).
3. Buka `http://localhost:8088`.

Migration dan isi data portfolio dimiliki repository backend.

### Development dengan Vite

Jalankan API backend di `localhost:8080`, kemudian dari direktori frontend:

```sh
npm ci
npm run dev
```

Vite meneruskan request `/api` ke backend lokal.

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
