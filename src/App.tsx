import { useEffect, useState } from 'react'
import { AMBANG_LOLOS, BATAS_SESI_MS, UNITS, type Huruf } from './data/tahap1'
import { bukaKunciAudio, hentikan } from './lib/audio'
import {
  PROGRES_AWAL,
  hariIni,
  kegiatanBerikutnya,
  muatProgres,
  simpanProgres,
  tahapDikuasai,
  type Progres,
  type StatusSimpan,
} from './lib/progres'
import { Rangkaian, Tantangan, langkahLatihUlang, langkahPelajaran, langkahUlasan, type Langkah } from './langkah'
import { AreaOrtu, Beranda, HasilTantangan, Pengenalan, SelesaiSesi } from './layar'

type Layar =
  | { nama: 'memuat' }
  | { nama: 'pengenalan' }
  | { nama: 'beranda' }
  | { nama: 'rangkaian'; langkah: Langkah[]; label: string; selesai: 'pelajaran' | 'latihUlang' | 'ulasan'; huruf?: Huruf }
  | { nama: 'tantangan' }
  | { nama: 'hasil'; benar: number; lolos: boolean; dikuasai: boolean }
  | { nama: 'selesaiSesi' }

export default function App() {
  const [progres, setProgres] = useState<Progres>(PROGRES_AWAL)
  const [statusSimpan, setStatusSimpan] = useState<StatusSimpan>('tersimpan')
  const [layar, setLayar] = useState<Layar>({ nama: 'memuat' })
  const [ortuTerbuka, setOrtuTerbuka] = useState(false)
  const [sesiMulai, setSesiMulai] = useState<number | null>(null)
  const [sudahUlasan, setSudahUlasan] = useState(false)

  useEffect(() => {
    muatProgres().then(({ progres, status }) => {
      setProgres(progres)
      setStatusSimpan(status)
      setLayar({ nama: progres.sudahPengenalan ? 'beranda' : 'pengenalan' })
    })
  }, [])

  const perbarui = (p: Progres) => {
    setProgres(p)
    simpanProgres(p).then(setStatusSimpan)
  }

  const sesiHabis = (mulai = sesiMulai) => mulai !== null && Date.now() - mulai >= BATAS_SESI_MS

  /** Setelah satu kegiatan selesai: kembali ke beranda, atau tutup sesi bila sudah 10 menit. */
  const selesaiKegiatan = () => setLayar({ nama: sesiHabis() ? 'selesaiSesi' : 'beranda' })

  const jalankanKegiatan = (p: Progres) => {
    const k = kegiatanBerikutnya(p)
    if (k.jenis === 'pelajaran') {
      setLayar({
        nama: 'rangkaian',
        langkah: langkahPelajaran(k.huruf, p.unitSelesai),
        label: `Huruf ${k.huruf}`,
        selesai: 'pelajaran',
        huruf: k.huruf,
      })
    } else if (k.jenis === 'latihUlang') {
      setLayar({
        nama: 'rangkaian',
        langkah: langkahLatihUlang(p.perluLatihUlang),
        label: 'Latihan menggabung',
        selesai: 'latihUlang',
      })
    } else if (k.jenis === 'tantangan') {
      setLayar({ nama: 'tantangan' })
    } else {
      setLayar({ nama: 'beranda' })
    }
  }

  const mulai = () => {
    // Harus dipanggil langsung di handler sentuhan agar audio jalan di iOS.
    bukaKunciAudio()
    const awal = sesiMulai ?? Date.now()
    if (sesiMulai === null) setSesiMulai(awal)
    if (sesiHabis(awal)) return setLayar({ nama: 'selesaiSesi' })
    if (!sudahUlasan && progres.unitSelesai.length > 0) {
      setSudahUlasan(true)
      return setLayar({ nama: 'rangkaian', langkah: langkahUlasan(progres.unitSelesai), label: 'Ulang sebentar', selesai: 'ulasan' })
    }
    setSudahUlasan(true)
    jalankanKegiatan(progres)
  }

  const rangkaianSelesai = (l: Extract<Layar, { nama: 'rangkaian' }>) => {
    if (l.selesai === 'ulasan') return sesiHabis() ? setLayar({ nama: 'selesaiSesi' }) : jalankanKegiatan(progres)
    if (l.selesai === 'pelajaran' && l.huruf) {
      perbarui({ ...progres, unitSelesai: [...progres.unitSelesai, l.huruf] })
    } else if (l.selesai === 'latihUlang') {
      perbarui({ ...progres, perluLatihUlang: [] })
    }
    selesaiKegiatan()
  }

  const tantanganSelesai = (benar: number, kataSalah: string[]) => {
    const lolos = benar >= AMBANG_LOLOS
    const riwayatTantangan = [...progres.riwayatTantangan, { tanggal: hariIni(), benar, lolos }]
    let p: Progres
    if (lolos) {
      p = { ...progres, riwayatTantangan, gagalBeruntun: 0, perluLatihUlang: [] }
    } else if (progres.gagalBeruntun + 1 >= 2) {
      // SPEK §5: gagal 2 kali berturut-turut, turun satu langkah ke gabung & baca.
      const huruf = UNITS.filter((u) => u.kata?.some((k) => kataSalah.includes(k))).map((u) => u.huruf)
      p = { ...progres, riwayatTantangan, gagalBeruntun: 0, perluLatihUlang: huruf }
    } else {
      p = { ...progres, riwayatTantangan, gagalBeruntun: progres.gagalBeruntun + 1 }
    }
    perbarui(p)
    setLayar({ nama: 'hasil', benar, lolos, dikuasai: lolos && tahapDikuasai(p) })
  }

  const bukaOrtu = () => {
    hentikan()
    setOrtuTerbuka(true)
  }

  if (ortuTerbuka) {
    return (
      <AreaOrtu
        progres={progres}
        statusSimpan={statusSimpan}
        sesiBerakhir={sesiHabis()}
        onTutup={() => {
          setOrtuTerbuka(false)
          // Pelajaran yang terpotong diulang dari awal unitnya.
          setLayar({ nama: sesiHabis() ? 'selesaiSesi' : 'beranda' })
        }}
        onSesiBaru={() => {
          setSesiMulai(null)
          setSudahUlasan(false)
          setOrtuTerbuka(false)
          setLayar({ nama: 'beranda' })
        }}
        onHapus={() => {
          perbarui({ ...PROGRES_AWAL, sudahPengenalan: true })
          setSesiMulai(null)
          setSudahUlasan(false)
          setOrtuTerbuka(false)
          setLayar({ nama: 'beranda' })
        }}
      />
    )
  }

  switch (layar.nama) {
    case 'memuat':
      return (
        <div className="memuat" role="status">
          Memuat…
        </div>
      )
    case 'pengenalan':
      return (
        <Pengenalan
          onSiap={() => {
            perbarui({ ...progres, sudahPengenalan: true })
            setLayar({ nama: 'beranda' })
          }}
        />
      )
    case 'beranda':
      return <Beranda progres={progres} onMulai={mulai} onOrtu={bukaOrtu} />
    case 'rangkaian':
      return (
        <Rangkaian
          key={layar.label}
          langkah={layar.langkah}
          label={layar.label}
          onSelesai={() => rangkaianSelesai(layar)}
          onOrtu={bukaOrtu}
        />
      )
    case 'tantangan':
      return <Tantangan onSelesai={tantanganSelesai} onOrtu={bukaOrtu} />
    case 'hasil':
      return <HasilTantangan {...layar} onKembali={selesaiKegiatan} onOrtu={bukaOrtu} />
    case 'selesaiSesi':
      return <SelesaiSesi onOrtu={bukaOrtu} />
  }
}
