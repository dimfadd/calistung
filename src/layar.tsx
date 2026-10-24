import { useEffect, useRef, useState } from 'react'
import { HARI_LOLOS_DIBUTUHKAN, REKAMAN_TAHAP1, SOAL_PER_SET, UNITS } from './data/tahap1'
import { hentikan, putar, sumberRekaman, ttsTersedia, type SumberRekaman } from './lib/audio'
import { RekamSuara } from './RekamSuara'
import {
  hariLolos,
  kegiatanBerikutnya,
  type Kegiatan,
  type Progres,
  type StatusSimpan,
} from './lib/progres'
import { Bingkai } from './komponen'

/** Layar pertama untuk orang tua: Fase Awal wajib didampingi (KONSEP §2). */
export function Pengenalan({ onSiap }: { onSiap: () => void }) {
  return (
    <div className="halaman-ortu">
      <main className="ortu-isi">
        <h1>Sebelum mulai</h1>
        <p className="ortu-lead">
          Ini prototipe Tahap 1. Anak belajar enam bunyi: <b className="contoh">a i u m b p</b>, lalu membaca
          kata pertamanya seperti <b className="contoh">mama</b> dan <b className="contoh">bumi</b>.
        </p>
        <ol className="ortu-daftar">
          <li>
            <b>Duduk di samping anak.</b> Di usia ini anak belajar paling baik bersama Anda. Beberapa langkah
            membutuhkan Anda, misalnya menilai apakah anak sudah menirukan bunyi dengan pas.
          </li>
          <li>
            <b>Yang diajarkan adalah bunyi, bukan nama huruf.</b> Huruf m dibaca "mmm", bukan "em". Bila Anda
            ikut mengucapkan, pakai bunyinya.
          </li>
          <li>
            <b>Sesi paling lama 10 menit.</b> Setelah itu app berhenti sendiri. Sedikit tapi rutin setiap hari
            lebih baik daripada lama sekali-sekali.
          </li>
          <li>
            <b>Rekam suara Anda untuk bunyi huruf</b> (di menu Untuk orang tua), agar anak belajar dengan suara
            orang tuanya. Sebelum direkam, app meminta Anda mengucapkan bunyinya langsung.
          </li>
          <li>
            <b>Pasang ke layar utama</b> (di iPad/iPhone: tombol Bagikan, lalu "Tambahkan ke Layar Utama"). Tanpa
            ini, Safari bisa menghapus progres anak bila app lama tidak dibuka.
          </li>
        </ol>
        <p className="ortu-catatan">
          Pengaturan dan catatan progres ada di tombol <b>Untuk orang tua</b> di pojok kanan atas. Tahan tombolnya
          3 detik untuk membuka.
        </p>
        <button type="button" className="tombol" onClick={onSiap}>
          Saya siap mendampingi
        </button>
      </main>
    </div>
  )
}

const LABEL_CTA: Record<Kegiatan['jenis'], string> = {
  pelajaran: '',
  latihUlang: 'Latihan menggabung bunyi',
  tantangan: 'Tantangan membaca',
  tungguBesok: '',
  dikuasai: '',
}

export function Beranda({
  progres,
  onMulai,
  onOrtu,
}: {
  progres: Progres
  onMulai: () => void
  onOrtu: () => void
}) {
  const kegiatan = kegiatanBerikutnya(progres)
  const jumlahLolos = hariLolos(progres).length
  const cta =
    kegiatan.jenis === 'pelajaran'
      ? progres.unitSelesai.length === 0
        ? 'Mulai belajar'
        : `Belajar huruf ${kegiatan.huruf}`
      : LABEL_CTA[kegiatan.jenis]

  return (
    <Bingkai
      onOrtu={onOrtu}
      atas={<span className="judul-tahap">Tahap 1</span>}
      aksi={
        cta && (
          <button type="button" className="tombol tombol-mulai" onClick={onMulai}>
            {cta}
          </button>
        )
      }
    >
      <ol className="jalur" aria-label="Jalur Tahap 1">
        {UNITS.map((u) => {
          const selesai = progres.unitSelesai.includes(u.huruf)
          const kini = kegiatan.jenis === 'pelajaran' && kegiatan.huruf === u.huruf
          return (
            <li
              key={u.huruf}
              className={`jalur-huruf grup-${u.jenis} ${selesai ? 'selesai' : ''} ${kini ? 'kini' : ''}`}
              aria-label={`Huruf ${u.huruf}: ${selesai ? 'selesai' : kini ? 'berikutnya' : 'belum'}`}
            >
              <span className="huruf" aria-hidden="true">
                {u.huruf}
              </span>
              <span className="tanda tanda-titik" aria-hidden="true" />
            </li>
          )
        })}
        <li
          className={`jalur-tantangan ${
            kegiatan.jenis === 'tantangan' || kegiatan.jenis === 'latihUlang' ? 'kini' : ''
          } ${kegiatan.jenis === 'dikuasai' ? 'selesai' : ''}`}
          aria-label={`Tantangan membaca: lolos ${jumlahLolos} dari ${HARI_LOLOS_DIBUTUHKAN} hari`}
        >
          <span className="jalur-tantangan-kata" aria-hidden="true">
            baca
          </span>
          <span className="jalur-hari" aria-hidden="true">
            {Array.from({ length: HARI_LOLOS_DIBUTUHKAN }, (_, i) => (
              <span key={i} className={i < jumlahLolos ? 'isi' : ''} />
            ))}
          </span>
        </li>
      </ol>
      {kegiatan.jenis === 'tungguBesok' && (
        <p className="pesan-beranda">
          Tantangan hari ini sudah lolos. Coba lagi besok, ya. Membaca di hari yang berbeda membantu anak mengingat.
        </p>
      )}
      {kegiatan.jenis === 'dikuasai' && (
        <p className="pesan-beranda">
          <b>Tahap 1 dikuasai.</b> Anak sudah membaca kata pertamanya sendiri di dua hari berbeda. Tahap 2 belum
          tersedia di prototipe ini.
        </p>
      )}
    </Bingkai>
  )
}

export function HasilTantangan({
  benar,
  lolos,
  dikuasai,
  onKembali,
  onOrtu,
}: {
  benar: number
  lolos: boolean
  dikuasai: boolean
  onKembali: () => void
  onOrtu: () => void
}) {
  const teks = dikuasai
    ? 'Tahap satu selesai. Kamu sudah bisa membaca sendiri!'
    : lolos
      ? `Hebat! Kamu membaca ${benar} kata. Kita coba lagi besok, ya.`
      : 'Kamu sudah berusaha. Kita latihan lagi, ya.'

  useEffect(() => {
    putar({ jenis: 'tts', teks })
    return hentikan
  }, [teks])

  return (
    <Bingkai
      onOrtu={onOrtu}
      aksi={
        <button type="button" className="tombol" onClick={onKembali}>
          Kembali
        </button>
      }
    >
      <div className="hasil">
        <p className="hasil-judul">{dikuasai ? 'Tahap 1 selesai' : lolos ? 'Hebat!' : 'Terima kasih sudah berusaha'}</p>
        {lolos && (
          <p className="hasil-angka" aria-label={`${benar} dari ${SOAL_PER_SET} kata terbaca`}>
            {Array.from({ length: SOAL_PER_SET }, (_, i) => (
              <span key={i} className={i < benar ? 'isi' : ''} aria-hidden="true" />
            ))}
          </p>
        )}
        <p className="instruksi">{teks}</p>
      </div>
    </Bingkai>
  )
}

export function SelesaiSesi({ onOrtu }: { onOrtu: () => void }) {
  useEffect(() => {
    putar({ jenis: 'tts', teks: 'Kita sudah belajar hari ini. Sampai besok!' })
    return hentikan
  }, [])
  return (
    <Bingkai onOrtu={onOrtu}>
      <div className="hasil">
        <p className="hasil-judul">Sampai besok!</p>
        <p className="instruksi">Sesi hari ini sudah 10 menit. Belajar sedikit tapi rutin membuat anak lebih ingat.</p>
      </div>
    </Bingkai>
  )
}

function formatTanggal(t: string) {
  const [y, m, d] = t.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function AreaOrtu({
  progres,
  statusSimpan,
  sesiBerakhir,
  onTutup,
  onSesiBaru,
  onHapus,
}: {
  progres: Progres
  statusSimpan: StatusSimpan
  sesiBerakhir: boolean
  onTutup: () => void
  onSesiBaru: () => void
  onHapus: () => void
}) {
  const [sumber, setSumber] = useState<SumberRekaman[] | null>(null)
  const [halaman, setHalaman] = useState<'utama' | 'rekam'>('utama')
  const dialog = useRef<HTMLDialogElement>(null)
  const tts = ttsTersedia()

  useEffect(() => {
    if (halaman !== 'utama') return
    hentikan()
    let aktif = true
    setSumber(null)
    Promise.all(REKAMAN_TAHAP1.map((r) => sumberRekaman(r.id))).then((h) => {
      if (aktif) setSumber(h.map((x) => x.sumber))
    })
    return () => {
      aktif = false
    }
  }, [halaman])

  if (halaman === 'rekam')
    return (
      <RekamSuara
        onKembali={() => {
          // Kosongkan status lama agar angka sebelum merekam tidak sempat tampil.
          setSumber(null)
          setHalaman('utama')
        }}
      />
    )

  const lolos = hariLolos(progres).length
  const jumlahOrtu = sumber?.filter((x) => x === 'ortu').length ?? 0
  const kosong = sumber ? REKAMAN_TAHAP1.filter((_, i) => sumber[i] === null).map((r) => r.label) : []

  return (
    <div className="halaman-ortu">
      <main className="ortu-isi">
        <div className="ortu-kepala">
          <h1>Untuk orang tua</h1>
          <button type="button" className="tombol-kedua" onClick={onTutup}>
            Kembali ke anak
          </button>
        </div>

        <section aria-labelledby="judul-progres">
          <h2 id="judul-progres">Progres Tahap 1</h2>
          <ul className="ortu-huruf">
            {UNITS.map((u) => (
              <li key={u.huruf} className={progres.unitSelesai.includes(u.huruf) ? 'selesai' : ''}>
                <span className="contoh">{u.huruf}</span>
                {progres.unitSelesai.includes(u.huruf) ? 'selesai' : 'belum'}
              </li>
            ))}
          </ul>
          <p>
            Tantangan membaca lolos di <b>{lolos}</b> dari {HARI_LOLOS_DIBUTUHKAN} hari berbeda yang dibutuhkan.
            {progres.perluLatihUlang.length > 0 &&
              ` Anak dua kali belum lolos, jadi sesi berikutnya berisi latihan ulang huruf ${progres.perluLatihUlang.join(', ')}.`}
          </p>
          {progres.riwayatTantangan.length === 0 ? (
            <p className="ortu-kosong">Belum ada tantangan. Tantangan terbuka setelah keenam huruf selesai.</p>
          ) : (
            <table className="ortu-tabel">
              <thead>
                <tr>
                  <th scope="col">Tanggal</th>
                  <th scope="col">Kata terbaca</th>
                  <th scope="col">Hasil</th>
                </tr>
              </thead>
              <tbody>
                {progres.riwayatTantangan
                  .map((h, i) => (
                    <tr key={i}>
                      <td>{formatTanggal(h.tanggal)}</td>
                      <td>
                        {h.benar} dari {SOAL_PER_SET}
                      </td>
                      <td>{h.lolos ? 'Lolos' : 'Belum lolos'}</td>
                    </tr>
                  ))
                  .reverse()}
              </tbody>
            </table>
          )}
        </section>

        <section aria-labelledby="judul-audio">
          <h2 id="judul-audio">Suara bunyi huruf</h2>
          <p>
            Bunyi huruf dan suku kata selalu diputar dari suara manusia, tidak pernah dari suara komputer, karena
            suara komputer sering salah mengucapkan bunyi huruf. Rekam suara Anda sendiri agar anak belajar dengan
            suara orang tuanya.
          </p>
          {sumber === null ? (
            <p className="ortu-kosong">Memeriksa rekaman…</p>
          ) : (
            <p>
              <b>
                {jumlahOrtu} dari {REKAMAN_TAHAP1.length}
              </b>{' '}
              bunyi sudah memakai suara Anda.
              {kosong.length > 0 &&
                ` ${kosong.length} bunyi belum punya rekaman sama sekali (${kosong.join(', ')}). Selama itu, app meminta Anda mengucapkannya langsung saat anak belajar.`}
            </p>
          )}
          <div className="ortu-aksi">
            <button type="button" className="tombol" onClick={() => setHalaman('rekam')}>
              {jumlahOrtu > 0 ? 'Kelola suara Anda' : 'Rekam suara Anda'}
            </button>
          </div>
          <p>
            Suara komputer Bahasa Indonesia untuk instruksi dan kata:{' '}
            <b>{tts ? 'tersedia di perangkat ini' : 'tidak tersedia di perangkat ini'}</b>.
            {!tts && ' Bacakan teks instruksi di layar untuk anak.'}
          </p>
        </section>

        <section aria-labelledby="judul-prototipe">
          <h2 id="judul-prototipe">Tentang prototipe ini</h2>
          <p>
            Gambar kata (mama, bumi, ubi, dan lainnya) adalah ilustrasi sederhana buatan tahap prototipe, belum
            karya ilustrator.
          </p>
        </section>

        <section aria-labelledby="judul-simpan">
          <h2 id="judul-simpan">Penyimpanan</h2>
          <p>
            {statusSimpan === 'tersimpan'
              ? 'Progres tersimpan di perangkat ini saja. Tidak ada data anak yang dikirim ke internet.'
              : 'Penyimpanan perangkat tidak bisa dipakai (misalnya mode privat). Progres akan hilang saat app ditutup.'}
          </p>
        </section>

        <section aria-labelledby="judul-tahap0">
          <h2 id="judul-tahap0">Permainan lisan (tanpa layar)</h2>
          <p>Lakukan kapan saja, misalnya di mobil atau sebelum tidur. Ini melatih telinga anak untuk bunyi.</p>
          <ul className="ortu-daftar">
            <li>
              <b>Tepuk suku kata.</b> Ucapkan nama benda sambil bertepuk tiap bagian: "sa-pi" (dua tepuk),
              "ba-na-na" (tiga tepuk).
            </li>
            <li>
              <b>Tebak bunyi awal.</b> "Mama, mata, madu. Semuanya mulai dengan bunyi apa?" Jawabannya "mmm".
            </li>
            <li>
              <b>Cari yang berima.</b> "Batu, satu, mana yang bunyinya mirip?" Lalu cari kata lain yang berakhiran
              "-tu".
            </li>
          </ul>
        </section>

        <section aria-labelledby="judul-sesi">
          <h2 id="judul-sesi">Sesi</h2>
          <p>
            {sesiBerakhir
              ? 'Sesi hari ini sudah mencapai 10 menit.'
              : 'Sesi berhenti otomatis setelah 10 menit sejak anak menekan tombol mulai.'}
          </p>
          <div className="ortu-aksi">
            <button type="button" className="tombol-kedua" onClick={onSesiBaru}>
              Mulai sesi baru
            </button>
            <button type="button" className="tombol-bahaya" onClick={() => dialog.current?.showModal()}>
              Hapus semua progres
            </button>
          </div>
        </section>
      </main>

      <dialog ref={dialog} className="dialog" aria-labelledby="judul-hapus">
        <h2 id="judul-hapus">Hapus semua progres?</h2>
        <p>Semua huruf yang sudah selesai dan riwayat tantangan akan hilang. Ini tidak bisa dibatalkan.</p>
        <div className="ortu-aksi">
          <button type="button" className="tombol-kedua" onClick={() => dialog.current?.close()}>
            Batal
          </button>
          <button
            type="button"
            className="tombol-bahaya"
            onClick={() => {
              dialog.current?.close()
              onHapus()
            }}
          >
            Hapus
          </button>
        </div>
      </dialog>
    </div>
  )
}
