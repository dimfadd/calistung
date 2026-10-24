# CLAUDE.md

Aplikasi calistung (PWA) untuk anak 3–7 tahun. Sebelum membangun apa pun, baca
`KONSEP-PRODUK.md` (filosofi & keputusan) dan `SPEK-MVP-FONIK.md` (spec MVP).

## Aturan pedagogi (tidak boleh dilanggar)

- Ajarkan **bunyi** huruf (/m/), bukan **nama** huruf ("em").
- Ikuti urutan bunyi di `SPEK-MVP-FONIK.md` §3. Jangan pakai urutan alfabet.
- Di langkah cek-membaca, **jangan putar audio kata secara otomatis**.
- Audio fonem dan suku kata wajib rekaman manusia: suara orang tua (direkam lewat app,
  disimpan di IndexedDB) didahulukan, lalu file di `public/audio/`.
  **Jangan pernah membuat audio fonem atau suku kata dengan TTS.**
- Suara orang tua & data anak hanya disimpan di perangkat; jangan mengirimnya ke server.
- Sesi dibatasi 10 menit. Dilarang memakai gacha, streak yang menekan, reward acak, iklan,
  atau pelacak pihak ketiga.
- Pengaturan dan dashboard harus dilindungi gerbang orang tua.

## UI

- Warna cerah terarah, setiap warna punya satu tugas (`KONSEP-PRODUK.md` §6): biru = vokal,
  merah = konsonan, kuning = tombol aksi, hijau = berhasil saja, oranye = penanda suku kata &
  fokus. Pakai token warna di `src/styles.css`, jangan menambah warna baru tanpa tugas jelas.
- Pilihan jawaban (langkah Temukan) harus polos: warna vokal/konsonan tidak boleh membocorkan
  jawaban.
- Semua teks lolos WCAG AA. Tipografi bersih, ruang kosong lega, animasi seperlunya. Hindari
  tampilan generik khas template dan jangan meniru produk lain (mis. Kahoot).
- Prioritas: tablet, lalu ponsel, lalu laptop. Area sentuh anak minimal 64px, satu tugas per
  layar.
- Semua teks UI dalam Bahasa Indonesia.

## Stack

React + Vite + TypeScript + `vite-plugin-pwa`. Offline-first, progres disimpan di IndexedDB,
tanpa backend di MVP.
