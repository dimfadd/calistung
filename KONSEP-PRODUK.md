# Konsep Produk — Aplikasi Calistung Berkualitas Tinggi

> Dokumen acuan (living document). Mendefinisikan **filosofi, metode berbasis bukti, peta
> konten, prinsip desain, dan metrik sukses** sebelum masuk ke keputusan teknis aplikasi.
>
> Status: Draft awal · Terakhir diperbarui: 2026-10-23

---

## 0. Ringkasan Satu Paragraf

Aplikasi calistung (baca–tulis–hitung) untuk anak usia **3–7 tahun**, dirancang
mengutamakan **kualitas dan kebermanfaatan nyata**, bukan kecepatan atau metrik screen-time.
Metode mengikuti bukti riset terkuat: **Systematic Synthetic Phonics (fonik bunyi)** untuk
membaca, **pendekatan CPA (Concrete–Pictorial–Abstract)** untuk berhitung, dan **progresi
motorik bertahap** untuk menulis. Produk **adaptif berbasis penguasaan (mastery)**, mendukung
anak lokal WNI, anak Tionghoa-Indonesia, dan bilingual dengan **jalur bahasa terpisah** (bukan
dicampur). Target rasa produk: tenang, dewasa, tidak norak — kualitas yang melahirkan
kebermanfaatan, lalu loyalitas.

---

## 1. Prinsip Inti (Non-negotiable)

Lima keputusan ini adalah identitas produk. Kalau salah satu dilanggar, produk kehilangan
diferensiasinya dan jatuh ke kelas "app calistung biasa".

1. **Mastery, bukan screen-time.** Metrik sukses adalah *apakah anak benar-benar kuasai konsep*,
   bukan berapa lama bermain atau berapa level selesai. Sesi sengaja pendek dan berhenti otomatis.
2. **Berbasis bukti, bukan marketing.** Setiap mekanik pengajaran harus bisa ditelusuri ke
   metode yang punya basis riset (lihat §3). Tidak ada fitur "karena kelihatan keren".
3. **Fonik bunyi yang akurat.** Ajarkan *bunyi* huruf (fonem), bukan nama huruf. Audio direkam
   penutur asli berkualitas, bukan text-to-speech murahan. (Ini kesalahan #1 app lokal.)
4. **Desain menahan diri (restraint).** "Tidak norak" = minim warna neon, minim animasi/suara
   ramai, tanpa reward gacha-like. Estetika tenang, tipografi bersih, banyak ruang kosong.
5. **Pendamping manusia untuk usia dini.** Anak 3–4 tahun belajar paling efektif lewat
   interaksi dua arah (serve-and-return), bukan layar sendirian. App memosisikan orang tua
   sebagai *co-player*, bukan pengawas.

---

## 2. Pengguna & Konteks Pakai

### Rentang umur: 3–7 tahun, adaptif per fase

| Fase | Umur ~ | Fokus |
|------|--------|-------|
| **Pra-calistung** | 3–4 | Membangun kesiapan (prasyarat), bukan calistung formal |
| **Awal** | 4–5 | Mulai fonik bunyi, pengenalan angka & bentuk huruf |
| **Lanjut** | 5–7 | Baca kata→kalimat, konsep penjumlahan, menulis huruf |

### Model pemakaian (keputusan penting, berbeda per umur)

- **Pra-calistung (3–4 th): WAJIB didampingi.**
  Mode mandiri **tidak** disediakan untuk usia ini. App memberi orang tua kalimat untuk
  diucapkan dan aktivitas off-screen. Rasional: [Bukti kuat] anak di bawah 5 tahun belajar
  bahasa & literasi paling efektif lewat interaksi manusia; layar satu arah tidak menggantikannya
  (sejalan rekomendasi American Academy of Pediatrics).
- **Fase Awal & Lanjut (5+): mode mandiri diizinkan.**
  Dengan instruksi audio, UI sangat sederhana, dan auto-pacing. Orang tua tetap dapat laporan
  progres.

> **Catatan desain:** "mandiri total untuk balita" adalah jebakan yang diam-diam menjadikan
> produk sebagai penitipan digital — justru itulah yang membuat app lain terasa murahan.
> Membatasi kemandirian di usia dini adalah *tanda kualitas*, bukan keterbatasan.

### Segmen anak

Produk melayani anak WNI lokal, anak Tionghoa-Indonesia (Cindo), dan anak bilingual.
Implikasi kunci: **bahasa pertama (L1) tiap anak berbeda** — ada yang Indonesia, ada yang
Inggris/Mandarin di rumah. App tidak boleh memaksa semua mulai dari Bahasa Indonesia
(lihat §4).

---

## 3. Metode Pengajaran (Basis Bukti)

### 3.1 MEMBACA — Systematic Synthetic Phonics (SSP) / "Science of Reading"

[Bukti kuat] Metode dengan dukungan riset terkuat di dunia untuk mengajar membaca.

- Ajarkan **bunyi (fonem)**, bukan nama huruf. ("b" = bunyi /b/, bukan "be".)
- Urutan pengenalan huruf **sistematis berdasarkan frekuensi & kemudahan merangkai**, bukan
  urutan alfabet.
- **Blending**: menggabungkan bunyi menjadi kata (b-a → "ba").
- Didahului **phonemic awareness** (kesadaran bunyi) — idealnya aktivitas lisan/off-screen:
  tepuk suku kata, mencari kata berima.

**Keunggulan Bahasa Indonesia:** [Bukti kuat] ejaan Indonesia **transparan** (satu huruf = satu
bunyi, hampir tanpa pengecualian; pengecualiannya dicatat di `SPEK-MVP-FONIK.md` §2). Ini membuat **metode fonik berbasis suku kata** sangat cepat
berhasil (ba-bi-bu-be-bo → ba-ju, bu-ku). Jauh lebih mudah dibanding Bahasa Inggris yang tidak
transparan.

**Yang dihindari:** metode hafal-kata-utuh (whole-word / look-say) — terbukti lemah.

Rujukan untuk pendalaman: *Science of Reading*, *Scarborough's Reading Rope*,
*Systematic Synthetic Phonics*.

### 3.2 BERHITUNG — pendekatan CPA (Concrete–Pictorial–Abstract) / Singapore Math

[Bukti kuat] Tiga tahap berurutan, tidak boleh dilompati:

1. **Concrete** — benda nyata (manipulatif): hitung kelereng, balok.
2. **Pictorial** — gambar mewakili benda. *← Di sinilah aplikasi paling berperan.*
3. **Abstract** — angka & simbol (3 + 2 = 5).

Konsep fondasi yang wajib (sering dilewati app lemah):

- **Subitizing** — mengenali jumlah kecil tanpa menghitung satu-satu (lihat 3 titik → "tiga").
- **Korespondensi 1-1** — satu benda = satu hitungan.
- **Konsep sebelum prosedur** — anak paham "5 itu 2 dan 3" sebelum hafal penjumlahan.

### 3.3 MENULIS — progresi motorik bertahap (sebagian besar OFF-screen)

[Bukti kuat] Menulis fisik butuh motorik halus yang **tidak bisa digantikan layar** (jari di
kaca ≠ pegang pensil). Peran app **terbatas** pada pengenalan bentuk & arah goresan huruf.

Urutan: gerakan kasar (di udara/pasir) → garis & bentuk → huruf besar → huruf kecil → kata.

> **Posisi produk:** app adalah *pendamping* menulis, bukan pengganti. Aktivitas menulis fisik
> diserahkan ke dunia nyata lewat panduan off-screen — dan ini dijual sebagai *nilai lebih*,
> bukan kelemahan.

### 3.4 Strategi Audio — Hybrid (manusia + AI TTS)

Audio adalah aset paling kritis sekaligus paling mahal. Keputusan: **hybrid**, dibagi
berdasarkan jenis ucapan.

| Jenis audio | Sumber | Alasan |
|---|---|---|
| **Bunyi fonem terisolasi** (/b/, /s/, /m/ murni) | **Rekam manusia** | [Kemungkinan besar] AI TTS dilatih pada ucapan mengalir, sering salah pada bunyi tunggal (menambah schwa "buh", atau menyebut nama huruf). Himpunan fonem kecil & tetap — rekam sekali selamanya, beban produksi rendah. |
| **Kata, kalimat, instruksi, cerita** | **AI TTS neural** | Kualitas TTS modern sudah natural untuk ucapan mengalir; menang telak untuk skala & konten dinamis. |

Prinsip: AI TTS dipakai untuk segala yang mengalir; **satu-satunya** yang tidak boleh diserahkan
ke TTS adalah bunyi fonem tunggal — karena di situlah fondasi metode fonik bertumpu.

---

## 4. Strategi Bilingual (Indonesia + Inggris)

**Keputusan: bahasa DIPISAH, tidak dicampur.**

Rasional: [Kemungkinan besar] mencampur dua sistem fonik yang bertolak belakang (Indonesia
transparan vs Inggris tidak) membingungkan anak — huruf "a" dan "c" dibaca berbeda di tiap
bahasa. Untuk anak yang belajar mandiri, ini beban kognitif, bukan fitur.

Aturan:

1. **Pilih bahasa rumah (L1) di awal.** Opsi: Bahasa Indonesia, Inggris, atau (untuk anak Cindo)
   Mandarin sebagai konteks keluarga. App **mulai dari bahasa yang paling kuat dikuasai anak**.
2. **Satu jalur fonik per bahasa.** Masing-masing punya urutan huruf, bunyi, dan progresinya
   sendiri. Tidak ada layar yang mencampur fonik dua bahasa.
3. **Bahasa kedua (L2) menyusul**, kira-kira setelah L1 stabil (indikatif ~1 tahun / setelah
   mastery fase Awal tercapai), sebagai jalur terpisah.

---

## 5. Peta Konten per Fase

| Fase | Umur ~ | Baca | Hitung | Tulis |
|------|--------|------|--------|-------|
| **Pra-calistung** | 3–4 | Kesadaran bunyi, rima, suku kata (lisan) | Subitizing, korespondensi 1-1, banyak/sedikit | Motorik: tracing garis & bentuk |
| **Awal** | 4–5 | Fonik bunyi, blending suku kata (ba-bu) | Angka 1–10 (konkret → gambar) | Bentuk huruf, arah goresan |
| **Lanjut** | 5–7 | Baca kata → kalimat pendek | Penjumlahan via konsep (CPA) | Huruf → kata (off-screen dominan) |

Jalur L2 (bahasa kedua) mengikuti struktur yang sama, dimulai setelah L1 stabil.

---

## 6. Prinsip Desain & Pengalaman

### Rasa visual ("tidak norak")

- Palet warna **lembut & terbatas**; hindari neon jenuh.
- Tipografi bersih, ukuran besar, kontras cukup; banyak ruang kosong (white space).
- Karakter/ilustrasi secukupnya — mendukung konten, bukan mendominasi.
- Referensi rasa: estetika Montessori-modern, tenang, "mahal tapi hangat".

### Interaksi

- **Sesi 10–15 menit, berhenti otomatis.** Jangan optimalkan durasi main.
- **Instruksi via audio** (anak pra-baca tidak bisa baca perintah).
- **Umpan balik merayakan usaha**, bukan hanya hasil ("kamu coba terus, keren").
- **Tanpa mekanik adiktif**: tidak ada gacha, streak yang menekan, atau reward acak.

### Adaptif berbasis penguasaan

- Anak **tidak maju sebelum menguasai** konsep (mastery gating).
- Kesulitan menyesuaikan: naik bila lancar, turun/ulang bila kesulitan.
- Bukan satu jalur seragam untuk semua anak.

### Peran orang tua

- Dashboard progres sederhana & jujur (menunjukkan penguasaan nyata, bukan skor kosong).
- Kartu aktivitas off-screen (menulis, menghitung benda di rumah).
- Untuk pra-calistung: skrip "apa yang diucapkan ke anak".

---

## 7. Metrik Sukses (Produk & Pembelajaran)

**Yang diukur:**

- **Penguasaan konsep** per anak (bukti anak benar-benar bisa, lewat penilaian ringan dalam app).
- **Retensi pembelajaran** (apakah masih bisa setelah jeda).
- **Transfer ke dunia nyata** (laporan orang tua: anak mulai baca label, hitung tangga, dll).
- **Loyalitas organik** (retensi pemakaian sehat, rujukan dari mulut ke mulut).

**Yang TIDAK dijadikan metrik utama:**

- Durasi screen-time per sesi.
- Jumlah level diselesaikan secepat mungkin.
- Keterlibatan (engagement) demi engagement.

> Logika bisnis: kualitas → kebermanfaatan nyata → reputasi → loyalitas. Bukan
> engagement-maximization.

---

## 8. Keputusan yang Sudah Dikunci

- [x] Framing "tercepat" diganti "**berkualitas & berbasis bukti**".
- [x] Pra-calistung (3–4 th) **wajib didampingi**; mode mandiri hanya 5+.
- [x] Bahasa **dipisah** (jalur per bahasa), tidak dicampur.
- [x] Metode: SSP (baca), CPA (hitung), progresi motorik (tulis).
- [x] Metrik inti: **mastery**, bukan screen-time.
- [x] **Audio hybrid**: fonem terisolasi = rekam manusia; ucapan mengalir = AI TTS (lihat §3.4).
- [x] **L1 MVP = Bahasa Indonesia saja.** Inggris = ekspansi L2 setelah inti terbukti.
      Mandarin = di luar lingkup model fonik (logografis), diperlakukan sebagai konteks bahasa
      rumah untuk anak Cindo, bukan jalur calistung.
- [x] **Device-first: tablet** (area sentuh & tracing); ponsel sekunder.
- [x] **Platform: PWA (web)** yang responsif untuk ponsel, tablet, dan laptop, dengan prioritas
      desain tablet. Stack: React + Vite + TypeScript. Backend ditunda (MVP 100% lokal).
      *(Sebelumnya Flutter. Diganti karena app dibangun lewat vibe coding: stack web punya
      lebih banyak data latih AI dan bisa di-preview instan di browser.)*
- [x] **Tim: solo founder, membangun lewat vibe coding** → lingkup dipotong keras (lihat §9).
      Aturan pedagogi untuk AI dicatat di `CLAUDE.md`.

## 9. Lingkup MVP & Jalur Eksekusi (proposal)

**Kendala penentu:** dibangun solo oleh pemula tanpa skill mobile. Maka MVP dipotong sampai
tersisa **satu jalur, satu fase, dikerjakan sempurna**, dan pedagogi divalidasi sebelum
membangun besar.

**Lingkup MVP:**

> **Jalur Membaca · Fase Awal (4–5 th) · Bahasa Indonesia.**
> Loop fonik inti: bunyi huruf → blending suku kata (ma, su, ni) → kata pertama (ma-ma, su-su).
> Rincian lengkapnya ada di `SPEK-MVP-FONIK.md`.
> Didampingi orang tua. Audio hybrid. Tanpa backend (lokal).

Semua yang lain — menulis, berhitung, fase lain, adaptif penuh, bahasa Inggris — adalah
**ekspansi setelah inti terbukti**, bukan bagian MVP.

**Urutan eksekusi (validasi dulu):**

1. **Kunci spec pedagogi** (urutan bunyi, loop, aturan mastery) di `SPEK-MVP-FONIK.md`.
   Spec ini yang diberikan ke AI. Prototipe kertas jadi opsional, karena prototipe digital
   lewat vibe coding pun sudah murah.
2. **Vibe-code PWA MVP dari spec**, lalu rekam ±27 audio fonem & suku kata.
3. **Uji MVP digital** ke anak yang sama; bandingkan dengan prototipe kertas.
4. Baru putuskan ekspansi berdasarkan hasil.

## 10. Pertanyaan Terbuka (berikutnya)

- Model monetisasi (yang tidak bertabrakan dengan prinsip anti-adiktif).
- Validasi urutan bunyi & ambang mastery (`SPEK-MVP-FONIK.md` §3 & §5) lewat uji ke anak.
- Produksi rekaman fonem: siapa penuturnya (jumlah & standar sudah ditetapkan di spec §6).
- Pilihan penyedia AI TTS Bahasa Indonesia & lisensinya.
- Validasi dengan pendidik/ahli PAUD sebelum rilis.

---

### Catatan tingkat keyakinan

Klaim metode pengajaran (§3) berlabel **[Bukti kuat]** merujuk pada konsensus riset literasi &
numerasi awal yang mapan. Klaim berlabel **[Kemungkinan besar]** adalah inferensi desain yang
kuat namun bergantung konteks implementasi. Keputusan produk (§6–§7) adalah pilihan strategis,
bukan temuan riset — terbuka untuk diuji dengan data pengguna nyata.
