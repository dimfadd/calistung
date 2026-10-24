import { useCallback, useEffect, useRef, useState } from 'react'
import { BATAS_REKAM_MS, REKAMAN_TAHAP1 } from './data/tahap1'
import { bukaKunciAudio, hentikan, putar, putarUrl, sumberRekaman, type SumberRekaman } from './lib/audio'
import { SuaraTidakTerdengar, olahRekaman } from './lib/olahSuara'
import { hapusRekamanOrtu, simpanRekamanOrtu } from './lib/rekamanOrtu'
import { HurufBerwarna } from './komponen'

type Fase =
  | { nama: 'siap' }
  | { nama: 'meminta' }
  | { nama: 'merekam' }
  | { nama: 'mengolah' }
  | { nama: 'tinjau'; url: string; blob: Blob }
  | { nama: 'galat'; pesan: string }

/** Bunyi yang paling sering salah direkam orang dewasa (letupan tanpa vokal). */
const BUNYI_RAWAN = new Set(['fonem/b', 'fonem/p'])

function cekDukungan(): 'ok' | 'https' | 'browser' {
  if (!window.isSecureContext) return 'https'
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') return 'browser'
  return 'ok'
}

export function RekamSuara({ onKembali }: { onKembali: () => void }) {
  const [status, setStatus] = useState<Record<string, SumberRekaman> | null>(null)
  const [pilih, setPilih] = useState(0)
  const [fase, setFase] = useState<Fase>({ nama: 'siap' })
  const [pesan, setPesan] = useState<string | null>(null)
  const perekam = useRef<MediaRecorder | null>(null)
  const aliran = useRef<MediaStream | null>(null)
  const konteks = useRef<AudioContext | null>(null)
  const timer = useRef(0)
  const dibatalkan = useRef(false)
  const urlPratinjau = useRef<string | null>(null)
  const dukungan = cekDukungan()
  const item = REKAMAN_TAHAP1[pilih]
  const sumber = status?.[item.id] ?? null

  const muatStatus = useCallback(async () => {
    const hasil = await Promise.all(REKAMAN_TAHAP1.map((r) => sumberRekaman(r.id)))
    setStatus(Object.fromEntries(REKAMAN_TAHAP1.map((r, i) => [r.id, hasil[i].sumber])))
  }, [])

  const buangPratinjau = () => {
    if (urlPratinjau.current) URL.revokeObjectURL(urlPratinjau.current)
    urlPratinjau.current = null
  }

  const batalRekam = useCallback(() => {
    dibatalkan.current = true
    clearTimeout(timer.current)
    if (perekam.current?.state === 'recording') perekam.current.stop()
    aliran.current?.getTracks().forEach((t) => t.stop())
  }, [])

  useEffect(() => {
    hentikan()
    muatStatus()
    return () => {
      batalRekam()
      buangPratinjau()
      konteks.current?.close().catch(() => {})
    }
  }, [muatStatus, batalRekam])

  const pilihItem = (i: number) => {
    batalRekam()
    buangPratinjau()
    setPesan(null)
    setPilih(i)
    setFase({ nama: 'siap' })
  }

  const mulaiRekam = async () => {
    // Dipanggil langsung dari sentuhan: buka kunci audio & buat AudioContext sebelum await (iOS).
    bukaKunciAudio()
    hentikan()
    buangPratinjau()
    setPesan(null)
    konteks.current ??= new AudioContext()
    setFase({ nama: 'meminta' })
    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch (e) {
      setFase({
        nama: 'galat',
        pesan:
          (e as DOMException).name === 'NotAllowedError'
            ? 'Izin mikrofon ditolak. Buka pengaturan browser, izinkan mikrofon untuk situs ini, lalu coba lagi.'
            : 'Mikrofon tidak bisa dipakai. Pastikan perangkat punya mikrofon dan tidak sedang dipakai aplikasi lain.',
      })
      return
    }
    aliran.current = stream
    dibatalkan.current = false
    const potongan: Blob[] = []
    const rek = new MediaRecorder(stream)
    rek.ondataavailable = (e) => {
      if (e.data.size) potongan.push(e.data)
    }
    rek.onstop = async () => {
      clearTimeout(timer.current)
      stream.getTracks().forEach((t) => t.stop())
      if (dibatalkan.current) return
      setFase({ nama: 'mengolah' })
      try {
        const wav = await olahRekaman(new Blob(potongan, { type: rek.mimeType }), konteks.current!)
        const url = URL.createObjectURL(wav)
        urlPratinjau.current = url
        setFase({ nama: 'tinjau', url, blob: wav })
        putarUrl(url)
      } catch (e) {
        setFase({
          nama: 'galat',
          pesan:
            e instanceof SuaraTidakTerdengar
              ? 'Suara tidak terdengar. Dekatkan perangkat ke mulut, di ruangan yang tenang, lalu coba lagi.'
              : 'Rekaman tidak bisa diolah di browser ini. Coba Chrome atau Safari versi terbaru.',
        })
      }
    }
    perekam.current = rek
    rek.start()
    setFase({ nama: 'merekam' })
    timer.current = window.setTimeout(() => rek.state === 'recording' && rek.stop(), BATAS_REKAM_MS)
  }

  const berhenti = () => {
    if (perekam.current?.state === 'recording') perekam.current.stop()
  }

  const simpan = async () => {
    if (fase.nama !== 'tinjau') return
    try {
      await simpanRekamanOrtu(item.id, fase.blob)
    } catch {
      setFase({
        nama: 'galat',
        pesan: 'Gagal menyimpan. Penyimpanan perangkat mungkin penuh atau diblokir (misalnya mode privat).',
      })
      return
    }
    buangPratinjau()
    await muatStatus()
    const label = item.label
    // Lanjut ke bunyi berikutnya yang belum punya suara orang tua.
    const urutan = REKAMAN_TAHAP1.map((_, k) => (pilih + 1 + k) % REKAMAN_TAHAP1.length)
    const segar = await Promise.all(REKAMAN_TAHAP1.map((r) => sumberRekaman(r.id)))
    const berikut = urutan.find((k) => segar[k].sumber !== 'ortu')
    setPesan(
      berikut === undefined
        ? `Suara "${label}" tersimpan. Semua bunyi sudah memakai suara Anda.`
        : `Suara "${label}" tersimpan. Lanjut ke "${REKAMAN_TAHAP1[berikut].label}".`,
    )
    if (berikut !== undefined) setPilih(berikut)
    setFase({ nama: 'siap' })
  }

  const hapus = async () => {
    await hapusRekamanOrtu(item.id)
    await muatStatus()
    setPesan(`Suara Anda untuk "${item.label}" dihapus.`)
  }

  const jumlahOrtu = status ? Object.values(status).filter((s) => s === 'ortu').length : 0

  const daftar = (jenis: 'fonem' | 'suku') => (
    <ul className="rekam-daftar">
      {REKAMAN_TAHAP1.map((r, i) =>
        r.jenis !== jenis ? null : (
          <li key={r.id}>
            <button
              type="button"
              className={`rekam-item ${i === pilih ? 'pilih' : ''}`}
              aria-current={i === pilih ? 'true' : undefined}
              onClick={() => pilihItem(i)}
            >
              <span className="rekam-item-label">{r.label}</span>
              <span className={`rekam-status status-${status?.[r.id] ?? 'kosong'}`}>
                {status === null
                  ? '…'
                  : status[r.id] === 'ortu'
                    ? 'Suara Anda'
                    : status[r.id] === 'bawaan'
                      ? 'Bawaan'
                      : 'Belum'}
              </span>
            </button>
          </li>
        ),
      )}
    </ul>
  )

  return (
    <div className="halaman-ortu">
      <main className="ortu-isi">
        <div className="ortu-kepala">
          <h1>Rekam suara Anda</h1>
          <button
            type="button"
            className="tombol-kedua"
            onClick={() => {
              batalRekam()
              onKembali()
            }}
          >
            Selesai
          </button>
        </div>
        <p className="ortu-lead">
          Anak akan mendengar bunyi huruf dengan suara Anda. Rekam satu per satu, dengarkan hasilnya, lalu simpan.
        </p>
        <p className="ortu-catatan">
          Ucapkan <b>bunyinya</b>, bukan nama hurufnya: huruf m dibaca "mmm", bukan "em". Suara Anda hanya
          tersimpan di perangkat ini dan tidak dikirim ke internet.
        </p>

        {dukungan === 'https' && (
          <p className="ortu-galat" role="alert">
            Merekam suara butuh alamat yang aman (HTTPS). Buka app lewat link Vercel yang diawali https://, bukan
            alamat http dari jaringan lokal.
          </p>
        )}
        {dukungan === 'browser' && (
          <p className="ortu-galat" role="alert">
            Browser ini belum bisa merekam suara. Gunakan Chrome atau Safari versi terbaru.
          </p>
        )}

        {dukungan === 'ok' && (
          <section className="rekam-panel" aria-labelledby="judul-rekam-kini">
            <p className="rekam-jenis">{item.jenis === 'fonem' ? 'Bunyi huruf' : 'Suku kata'}</p>
            <p className="rekam-label" id="judul-rekam-kini">
              <HurufBerwarna teks={item.label} />
            </p>
            <p className="rekam-petunjuk">Ucapkan: {item.petunjuk}.</p>
            {BUNYI_RAWAN.has(item.id) && (
              <p className="rekam-peringatan">
                Bunyi ini paling sering salah direkam. Ucapkan sangat pendek, tanpa "e": bukan "{item.label}e" atau "
                {item.label}eh".
              </p>
            )}
            <p className="rekam-keadaan" aria-live="polite">
              {fase.nama === 'meminta' && 'Meminta izin mikrofon…'}
              {fase.nama === 'merekam' && (
                <span className="rekam-merekam">
                  <span className="rekam-titik" aria-hidden="true" />
                  Merekam. Ucapkan sekarang, lalu tekan Berhenti.
                </span>
              )}
              {fase.nama === 'mengolah' && 'Merapikan rekaman…'}
              {fase.nama === 'tinjau' && 'Dengarkan hasilnya. Sudah pas bunyinya?'}
              {fase.nama === 'galat' && <span className="ortu-galat-teks">{fase.pesan}</span>}
              {fase.nama === 'siap' &&
                (sumber === 'ortu'
                  ? 'Sudah memakai suara Anda.'
                  : sumber === 'bawaan'
                    ? 'Sekarang memakai rekaman bawaan.'
                    : status === null
                      ? 'Memeriksa rekaman…'
                      : 'Belum ada rekaman untuk bunyi ini.')}
            </p>
            <div className="ortu-aksi">
              {(fase.nama === 'siap' || fase.nama === 'galat') && (
                <button type="button" className="tombol" onClick={mulaiRekam}>
                  {fase.nama === 'galat' ? 'Coba lagi' : sumber === 'ortu' ? 'Rekam ulang' : 'Mulai rekam'}
                </button>
              )}
              {fase.nama === 'siap' && sumber === 'ortu' && (
                <>
                  <button
                    type="button"
                    className="tombol-kedua"
                    onClick={() => {
                      bukaKunciAudio()
                      putar({ jenis: 'rekaman', jalur: item.id })
                    }}
                  >
                    Dengarkan suara Anda
                  </button>
                  <button type="button" className="tombol-bahaya" onClick={hapus}>
                    Hapus suara ini
                  </button>
                </>
              )}
              {fase.nama === 'merekam' && (
                <button type="button" className="tombol" onClick={berhenti}>
                  Berhenti
                </button>
              )}
              {fase.nama === 'tinjau' && (
                <>
                  <button type="button" className="tombol-kedua" onClick={() => putarUrl(fase.url)}>
                    Dengarkan lagi
                  </button>
                  <button type="button" className="tombol-kedua" onClick={mulaiRekam}>
                    Rekam ulang
                  </button>
                  <button type="button" className="tombol" onClick={simpan}>
                    Simpan
                  </button>
                </>
              )}
            </div>
            {pesan && (
              <p className="rekam-pesan" role="status">
                {pesan}
              </p>
            )}
          </section>
        )}

        <p>
          {status === null
            ? 'Memeriksa rekaman…'
            : `${jumlahOrtu} dari ${REKAMAN_TAHAP1.length} bunyi sudah memakai suara Anda.`}
        </p>
        <h2>Bunyi huruf</h2>
        {daftar('fonem')}
        <h2>Suku kata</h2>
        {daftar('suku')}
      </main>
    </div>
  )
}
