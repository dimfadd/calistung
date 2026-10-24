import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { adaRekaman } from './lib/audio'

/** Kerangka layar anak: bilah atas, panggung (satu fokus), dan area aksi. Tanpa scroll. */
export function Bingkai({
  atas,
  onOrtu,
  aksi,
  children,
}: {
  atas?: ReactNode
  onOrtu: () => void
  aksi?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="layar">
      <header className="bilah-atas">
        <div className="bilah-kiri">{atas}</div>
        <GerbangOrtu onBuka={onOrtu} />
      </header>
      <main className="panggung">{children}</main>
      <footer className="aksi">{aksi}</footer>
    </div>
  )
}

const LAMA_TAHAN_MS = 3000

/**
 * Gerbang orang tua: tombol harus ditahan 3 detik (sentuh, mouse, atau Enter/Spasi).
 * Bila dilepas terlalu cepat (diklik biasa), label berubah jadi "Tahan 3 detik" agar
 * orang tua tahu caranya membuka.
 */
export function GerbangOrtu({ onBuka }: { onBuka: () => void }) {
  const [persen, setPersen] = useState(0)
  const [petunjuk, setPetunjuk] = useState(false)
  const bingkai = useRef(0)
  const menahan = useRef(false)
  const timerPetunjuk = useRef(0)

  const berhenti = () => {
    cancelAnimationFrame(bingkai.current)
    menahan.current = false
    setPersen(0)
  }

  /** Dilepas sebelum 3 detik: tampilkan cara membuka. */
  const lepas = () => {
    if (!menahan.current) return
    berhenti()
    setPetunjuk(true)
    clearTimeout(timerPetunjuk.current)
    timerPetunjuk.current = window.setTimeout(() => setPetunjuk(false), 2500)
  }

  const mulai = () => {
    cancelAnimationFrame(bingkai.current)
    menahan.current = true
    setPetunjuk(false)
    const t0 = performance.now()
    const detak = () => {
      const p = Math.min(1, (performance.now() - t0) / LAMA_TAHAN_MS)
      setPersen(p)
      if (p >= 1) {
        berhenti()
        onBuka()
      } else bingkai.current = requestAnimationFrame(detak)
    }
    bingkai.current = requestAnimationFrame(detak)
  }

  useEffect(
    () => () => {
      cancelAnimationFrame(bingkai.current)
      clearTimeout(timerPetunjuk.current)
    },
    [],
  )

  return (
    <button
      type="button"
      className={`tombol-gerbang ${petunjuk ? 'petunjuk' : ''}`}
      style={{ '--p': persen } as CSSProperties}
      aria-label="Untuk orang tua. Tahan 3 detik untuk membuka."
      onPointerDown={mulai}
      onPointerUp={lepas}
      onPointerLeave={lepas}
      onPointerCancel={lepas}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
          e.preventDefault()
          mulai()
        }
      }}
      onKeyUp={lepas}
    >
      {persen > 0 ? 'Tahan terus…' : petunjuk ? 'Tahan 3 detik' : 'Untuk orang tua'}
    </button>
  )
}

/** Kartu yang bisa diketuk untuk mendengar bunyi. Titik = satu bunyi, busur = satu suku kata. */
export function KartuBunyi({
  label,
  tanda = 'titik',
  ukuran = 'besar',
  onTekan,
  className = '',
  ariaLabel,
  polos = false,
}: {
  label: string
  tanda?: 'titik' | 'busur' | 'tanpa'
  ukuran?: 'besar' | 'sedang'
  onTekan?: () => void
  className?: string
  ariaLabel?: string
  /** Tanpa warna vokal/konsonan: dipakai di pilihan jawaban agar warna tidak membocorkan jawaban. */
  polos?: boolean
}) {
  const grup = label.length === 1 ? (VOKAL.has(label) ? 'grup-vokal' : 'grup-konsonan') : ''
  return (
    <button
      type="button"
      className={`kartu-bunyi ukuran-${ukuran} ${polos ? 'polos' : grup} ${className}`}
      onClick={onTekan}
      aria-label={ariaLabel ?? `Dengar bunyi ${label}`}
    >
      <span className="huruf">{polos ? label : <HurufBerwarna teks={label} />}</span>
      {tanda !== 'tanpa' && <span className={`tanda tanda-${tanda}`} aria-hidden="true" />}
    </button>
  )
}

const VOKAL = new Set(['a', 'i', 'u', 'e', 'o'])

/** Tiap huruf diberi kelas vokal/konsonan agar tema bisa mewarnainya (konvensi Montessori). */
export function HurufBerwarna({ teks }: { teks: string }) {
  return (
    <>
      {[...teks].map((c, i) => (
        <span key={i} className={VOKAL.has(c) ? 'h-vokal' : 'h-konsonan'}>
          {c}
        </span>
      ))}
    </>
  )
}

/** Status satu atau beberapa file rekaman: null selama diperiksa. */
export function useRekaman(jalur: string[]): boolean[] | null {
  const kunci = jalur.join('|')
  const [ada, setAda] = useState<boolean[] | null>(null)
  useEffect(() => {
    let aktif = true
    setAda(null)
    Promise.all(kunci.split('|').map(adaRekaman)).then((h) => aktif && setAda(h))
    return () => {
      aktif = false
    }
  }, [kunci])
  return ada
}

/** Muncul hanya bila rekaman belum ada: orang tua yang mengucapkan bunyinya. */
export function PetunjukOrtu({ tampil, children }: { tampil: boolean; children: ReactNode }) {
  if (!tampil) return null
  return (
    <p className="petunjuk-ortu" role="note">
      <strong>Orang tua:</strong> rekaman belum ada. {children}
    </p>
  )
}

/** Teks instruksi untuk orang tua. Anak mendengarnya lewat audio. */
export function Instruksi({ children }: { children: ReactNode }) {
  return <p className="instruksi">{children}</p>
}

export function Umpan({ teks, nada }: { teks: string | null; nada?: 'baik' | 'coba' }) {
  return (
    <p className={`umpan ${nada ? `umpan-${nada}` : ''}`} aria-live="polite">
      {teks ?? ' '}
    </p>
  )
}

/** Titik kemajuan langkah di bilah atas. */
export function TitikKemajuan({ total, kini, label }: { total: number; kini: number; label: string }) {
  return (
    <div className="kemajuan" role="img" aria-label={`${label}, langkah ${kini + 1} dari ${total}`}>
      <span className="kemajuan-label">{label}</span>
      <span className="kemajuan-titik" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={i < kini ? 'lewat' : i === kini ? 'kini' : ''} />
        ))}
      </span>
    </div>
  )
}
