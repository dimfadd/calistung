# Calistung

Prototipe PWA untuk belajar membaca lewat bunyi huruf (fonik), Bahasa Indonesia.
Isi saat ini: **Tahap 1** (bunyi a, i, u, m, b, p, lalu kata mama, papa, ibu, ubi, bumi, pipi).

Dokumen acuan:
- `KONSEP-PRODUK.md`: filosofi, metode, dan keputusan produk.
- `SPEK-MVP-FONIK.md`: spec MVP (urutan bunyi, loop 6 langkah, aturan penguasaan).
- `CLAUDE.md`: aturan wajib untuk AI saat vibe coding di repo ini.

## Menjalankan

```bash
npm install
npm run dev        # buka http://localhost:5173
```

### Mencoba di tablet atau ponsel

```bash
npm run dev -- --host
```

Buka alamat "Network" yang muncul (misalnya `http://192.168.1.5:5173`) dari tablet yang
terhubung ke Wi-Fi yang sama. Fitur pasang ke layar utama (PWA) dan mode offline baru
aktif bila app di-hosting lewat HTTPS (lihat bagian Rilis).

## Audio

Rekaman bunyi huruf dan suku kata belum ada. Daftar file dan standarnya ada di
`public/audio/README.md`. Selama file belum ada, app meminta orang tua mengucapkan bunyinya.
Bunyi huruf tidak pernah dibuat dengan TTS.

## Rilis

```bash
npm run build      # hasil di dist/, bisa di-hosting di host statis apa pun (HTTPS)
npm run preview    # cek hasil build secara lokal
```

## Yang masih sementara

- Gambar kata memakai emoji; harus diganti ilustrasi asli sebelum diuji ke anak.
- Instruksi dan kata memakai suara TTS perangkat. Di perangkat tanpa suara Bahasa Indonesia,
  instruksi hanya tampil sebagai teks.
- Ambang penguasaan (4 dari 5, di 2 hari berbeda) masih tebakan awal dan perlu disetel lewat uji.
