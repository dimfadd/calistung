# Spek MVP — Loop Fonik Bahasa Indonesia (Fase Awal)

> Spesifikasi yang menjadi acuan saat membangun (termasuk saat vibe coding). Turunan dari
> `KONSEP-PRODUK.md`. Bila ada konflik, prinsip di `KONSEP-PRODUK.md` yang menang.
>
> Status: Draft awal · Terakhir diperbarui: 2026-10-23

---

## 1. Lingkup

- **Jalur:** Membaca saja.
- **Fase:** Awal (anak ~4–5 tahun), **didampingi orang tua**.
- **Bahasa:** Bahasa Indonesia saja.
- **Isi MVP:** **Tahap 1–2** dari urutan di §3. Tahap 0 berupa kartu panduan lisan untuk
  orang tua. Tahap 3 ke atas dikerjakan setelah MVP terbukti berhasil.
- **Platform:** PWA (web), responsif untuk ponsel, tablet, dan laptop (lihat §7).

Target hasil MVP: anak bisa **membaca sendiri kata CV-CV** (dua suku kata terbuka) yang
tersusun dari 9 bunyi, misalnya *mama, susu, nasi, batu*, tanpa dibacakan lebih dulu.

---

## 2. Catatan Ejaan: Transparan, tapi Tidak 100%

Ejaan Indonesia sangat konsisten. Meski begitu, ada pengecualian yang **harus** diajarkan
secara eksplisit. Jangan menganggapnya tidak ada.

| Pengecualian | Contoh | Penanganan |
|---|---|---|
| Huruf **e** punya dua bunyi: pepet /ə/ dan taling /e/ | *e*mas, s*e*patu (pepet) · m*e*ja, sat*e* (taling) | Diajarkan sebagai dua bunyi untuk satu huruf, di Tahap 4 |
| **k** di akhir kata menjadi hentian glotal | bapa*k*, ana*k* | Diajarkan bersama suku kata tertutup, di Tahap 6 |
| **Digraf** (dua huruf, satu bunyi) | *ng*, *ny*, *sy*, *kh* | Diajarkan sebagai satu kesatuan, di Tahap 7 |
| **Diftong** | pant*ai*, pul*au*, sep*oi* | Tahap 7 |

MVP (Tahap 1–2) sengaja **tidak menyentuh** satu pun pengecualian ini.

---

## 3. Urutan Pengenalan Bunyi

Prinsip penyusunan:
1. Vokal yang paling sering muncul dan paling mudah dibedakan didahulukan (a, i, u).
2. Konsonan yang gerak bibirnya terlihat dan mudah diucapkan anak didahulukan (m, b, p).
3. Setiap tahap harus langsung menghasilkan **kata nyata yang bisa digambar**, supaya anak
   merasakan "aku bisa baca" sejak tahap pertama.
4. Suku kata terbuka (KV) dulu, suku kata tertutup (KVK) belakangan.

> Prinsip di atas berlabel [Kemungkinan Besar], karena sejalan dengan riset fonik sistematis.
> **Urutan konsonan per tahap adalah proposal desain** dan perlu divalidasi lewat uji ke anak.

| Tahap | Bunyi baru | Contoh kata | Masuk MVP? |
|---|---|---|---|
| **0** | (lisan) tepuk suku kata, bunyi awal, rima | — | Kartu orang tua |
| **1** | **a, i, u, m, b, p** | mama, papa, ibu, abu, ubi, bibi, pipi, bumi | **Ya** |
| **2** | **s, t, n** | susu, nasi, batu, mata, satu, tamu, sapi, pita, tisu, itu, ini, sana, sini | **Ya** |
| 3 | k, l, r, d, g | kaki, kuda, gigi, dadu, kuku, rusa, gula, lima, paku | Tidak |
| 4 | o, e (pepet & taling) | bola, topi, roti, meja, sate, sepatu, kelapa | Tidak |
| 5 | c, j, h, w, y (f, v, z belakangan, jarang) | kaca, jari, baju, cucu, kopi | Tidak |
| 6 | suku kata tertutup (KVK), k akhir | ikan, makan, minum, bapak | Tidak |
| 7 | ng, ny, sy, kh, ai, au, oi | bunga, nyanyi, pantai, pulau | Tidak |
| 8 | kalimat pendek | "ini bola", "ibu makan nasi" | Tidak |

---

## 4. Loop Inti (per bunyi baru)

Setiap bunyi baru diajarkan lewat enam langkah, dengan urutan tetap:

1. **Kenal bunyi.** Huruf tampil besar dan audio bunyinya diputar. Yang diputar adalah
   **bunyinya**, misalnya /m/, **bukan nama huruf** "em".
2. **Tirukan.** Anak menirukan bunyi itu. Orang tua menekan ✓ kalau tiruannya benar.
   *(Tanpa pengenalan suara: [Kemungkinan Besar] pengenalan suara anak kecil masih belum
   andal, dan salah koreksi lebih merusak daripada tidak dikoreksi sama sekali.)*
3. **Temukan.** "Mana bunyi /m/?" Anak memilih dari 2–3 huruf dengan mengetuk.
4. **Gabung (blending).** Konsonan bergeser mendekati vokal, lalu audio suku katanya diputar
   (m + a → "ma").
5. **Baca kata.** Suku kata dirangkai menjadi kata (ma-ma → *mama*), disertai gambar.
6. **Cek membaca.** Kata tampil sebagai **tulisan saja**, lalu anak memilih gambar yang cocok
   dari 3 pilihan.
   **Audio kata TIDAK boleh diputar otomatis di langkah ini.** Kalau diputar, yang diuji
   menjadi kemampuan mendengar, bukan membaca. Audio baru boleh diputar setelah anak menjawab.

---

## 5. Penguasaan (Mastery) & Pengulangan

> Angka ambang di bawah berlabel [Menebak]. Ini titik awal yang wajar, dan harus disetel
> berdasarkan hasil uji ke anak nyata.

- **Satu set** berisi 5 soal. **Lolos** kalau minimal 4 dijawab benar.
- Satu tahap dinyatakan **dikuasai** kalau anak lolos set cek-membaca di **2 sesi pada hari
  yang berbeda**. Tahap berikutnya baru terbuka setelah itu.
- Kalau gagal 2 set berturut-turut, app **turun satu langkah** (kembali ke langkah 4–5 untuk
  bunyi tersebut). Tidak ada pesan "salah" yang menghukum.
- **Pengulangan:** setiap sesi dibuka dengan 1–2 menit mengulang bunyi dari tahap sebelumnya.
- **Durasi sesi:** dibatasi 10 menit, lalu app menutup sesi dengan lembut ("Sampai besok!").

---

## 6. Daftar Audio MVP

| Jenis | Isi | Jumlah | Sumber |
|---|---|---|---|
| Fonem terisolasi | a, i, u, m, b, p, s, t, n | 9 | **Rekam manusia** |
| Suku kata KV | {m, b, p, s, t, n} × {a, i, u} | 18 | **Rekam manusia** (lihat catatan) |
| Kata | ±20 kata dari Tahap 1–2 | ±20 | AI TTS (boleh diganti rekaman) |
| Instruksi & pujian | "Mana bunyi…", "Hebat, kamu coba terus!" | ±30 | AI TTS |

Total rekaman manusia untuk MVP: **±27 file**. Jumlah ini kecil dan cukup direkam sekali.

> Catatan suku kata: belum ada kepastian apakah AI TTS mengucapkan suku kata tunggal ("ba")
> dengan benar. Seringkali TTS justru membacanya sebagai ejaan huruf ("be-a") [Menebak].
> Karena itu, untuk MVP suku kata direkam manusia. Uji AI TTS secara terpisah, dan pindahkan
> ke TTS hanya bila hasilnya terbukti benar.

Standar rekaman: satu penutur yang sama untuk semua fonem & suku kata, ruang senyap, format
mono, volume dinormalisasi, tanpa jeda kosong di awal dan akhir.

---

## 7. Kebutuhan Teknis (PWA & Responsif)

**Stack yang disarankan (cocok untuk vibe coding):** React + Vite + TypeScript, ditambah
`vite-plugin-pwa`. Tanpa backend.

**PWA**
- Bisa dipasang ke home screen (manifest + service worker).
- **Offline-first:** semua audio & gambar MVP di-cache, sehingga app tetap jalan tanpa internet.
- Progres disimpan di perangkat (IndexedDB). Ada peringatan untuk iOS: data bisa terhapus
  kalau app tidak dipasang ke home screen, jadi tampilkan ajakan "Pasang ke layar utama".
- Audio diputar hanya setelah ada sentuhan pengguna (aturan wajib di iOS Safari).

**Responsif (urutan prioritas desain)**
1. **Tablet**, terutama posisi landscape (pengalaman utama anak).
2. **Ponsel**, mulai lebar 360px.
3. **Laptop/PC** (paling cocok untuk orang tua; tetap berfungsi penuh untuk anak).

- Area sentuh untuk anak minimal **64px**, dengan jarak antar-tombol yang lega.
- Satu tugas per layar. Tanpa scroll di layar anak.

**Privasi & keamanan anak**
- Tanpa iklan, tanpa pelacak pihak ketiga, tanpa akun di MVP.
- Data anak tidak keluar dari perangkat. Ini sejalan dengan UU Pelindungan Data Pribadi
  (UU 27/2022), yang mewajibkan persetujuan orang tua untuk pemrosesan data anak.
- **Gerbang orang tua** untuk pengaturan dan dashboard: tekan-tahan 3 detik, atau soal hitung
  yang sederhana bagi orang dewasa.

---

## 8. Di Luar MVP

Hal-hal berikut sengaja tidak dikerjakan di MVP: menulis/tracing, berhitung, Tahap 3+, mode
mandiri, pengenalan suara, akun & sinkron server, Bahasa Inggris, dan monetisasi.
