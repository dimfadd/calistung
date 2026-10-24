import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  HURUF_TAHAP1,
  KATA,
  PENGECOH,
  SOAL_PER_SET,
  UNITS,
  kataSiapCek,
  type Huruf,
} from './data/tahap1'
import { hentikan, jalurFonem, jalurSuku, putar } from './lib/audio'
import {
  Bingkai,
  HurufBerwarna,
  Instruksi,
  KartuBunyi,
  PetunjukOrtu,
  TitikKemajuan,
  Umpan,
  useRekaman,
} from './komponen'
import { PUJIAN, acak, pilihSatu } from './util'

export type Langkah =
  | { jenis: 'kenal'; huruf: Huruf }
  | { jenis: 'tirukan'; huruf: Huruf }
  | { jenis: 'temukan'; target: Huruf[]; pool: Huruf[] }
  | { jenis: 'gabung'; konsonan: Huruf; suku: string }
  | { jenis: 'baca'; kata: string }
  | { jenis: 'cek'; kata: string }

const unitDari = (h: string) => UNITS.find((u) => u.huruf === h)!

/** Suku kata satu huruf (mis. "i" pada i-bu) adalah fonem vokal, jadi rekamannya file fonem. */
const jalurBagian = (s: string) => (s.length === 1 ? jalurFonem(s) : jalurSuku(s))

/** Urutan langkah satu unit (SPEK §4): kenal, tirukan, temukan, lalu gabung, baca, cek untuk konsonan. */
export function langkahPelajaran(h: Huruf, selesai: Huruf[]): Langkah[] {
  const unit = unitDari(h)
  const daftar: Langkah[] = [
    { jenis: 'kenal', huruf: h },
    { jenis: 'tirukan', huruf: h },
    { jenis: 'temukan', target: [h, h], pool: [...selesai, h] },
  ]
  for (const suku of unit.sukuKata ?? []) daftar.push({ jenis: 'gabung', konsonan: h, suku })
  for (const kata of unit.kata ?? []) daftar.push({ jenis: 'baca', kata })
  for (const kata of unit.kata ?? []) if (KATA[kata].bisaDicek) daftar.push({ jenis: 'cek', kata })
  return daftar
}

/** Turun satu langkah setelah 2 tantangan gagal (SPEK §5): ulang gabung dan baca. */
export function langkahLatihUlang(daftarHuruf: Huruf[]): Langkah[] {
  return daftarHuruf.flatMap((h) => {
    const unit = unitDari(h)
    return [
      ...(unit.sukuKata ?? []).map((suku): Langkah => ({ jenis: 'gabung', konsonan: h, suku })),
      ...(unit.kata ?? []).map((kata): Langkah => ({ jenis: 'baca', kata })),
    ]
  })
}

/** Pengulangan singkat di awal sesi (SPEK §5). */
export function langkahUlasan(selesai: Huruf[]): Langkah[] {
  return [{ jenis: 'temukan', target: acak(selesai).slice(0, 3), pool: selesai }]
}

interface Kerangka {
  atas: ReactNode
  onOrtu: () => void
}

export function Rangkaian({
  langkah,
  label,
  onSelesai,
  onOrtu,
}: {
  langkah: Langkah[]
  label: string
  onSelesai: () => void
  onOrtu: () => void
}) {
  const [i, setI] = useState(0)
  const l = langkah[i]
  const lanjut = () => (i + 1 < langkah.length ? setI(i + 1) : onSelesai())
  const k: Kerangka = {
    atas: <TitikKemajuan total={langkah.length} kini={i} label={label} />,
    onOrtu,
  }
  switch (l.jenis) {
    case 'kenal':
      return <Kenal key={i} k={k} huruf={l.huruf} onSelesai={lanjut} />
    case 'tirukan':
      return <Tirukan key={i} k={k} huruf={l.huruf} onSelesai={lanjut} />
    case 'temukan':
      return <Temukan key={i} k={k} target={l.target} pool={l.pool} onSelesai={lanjut} />
    case 'gabung':
      return <Gabung key={i} k={k} konsonan={l.konsonan} suku={l.suku} onSelesai={lanjut} />
    case 'baca':
      return <Baca key={i} k={k} kata={l.kata} onSelesai={lanjut} />
    case 'cek':
      return <Cek key={i} k={k} kata={l.kata} mode="belajar" onJawab={lanjut} />
  }
}

/** Langkah 1: kenal bunyi. Yang diputar adalah bunyi, bukan nama huruf. */
function Kenal({ k, huruf, onSelesai }: { k: Kerangka; huruf: Huruf; onSelesai: () => void }) {
  const jalur = jalurFonem(huruf)
  const ada = useRekaman([jalur])
  useEffect(() => {
    putar({ jenis: 'tts', teks: 'Dengarkan bunyi huruf ini.' }, { jenis: 'jeda', ms: 250 }, { jenis: 'rekaman', jalur })
    return hentikan
  }, [jalur])
  return (
    <Bingkai
      {...k}
      aksi={
        <button type="button" className="tombol" onClick={onSelesai}>
          Lanjut
        </button>
      }
    >
      <Instruksi>Dengarkan bunyinya. Ketuk hurufnya untuk mendengar lagi.</Instruksi>
      <KartuBunyi label={huruf} onTekan={() => putar({ jenis: 'rekaman', jalur })} />
      <PetunjukOrtu tampil={ada?.[0] === false}>Ucapkan: {unitDari(huruf).petunjuk}.</PetunjukOrtu>
    </Bingkai>
  )
}

/** Langkah 2: tirukan. Tanpa pengenalan suara; orang tua yang menilai. */
function Tirukan({ k, huruf, onSelesai }: { k: Kerangka; huruf: Huruf; onSelesai: () => void }) {
  const jalur = jalurFonem(huruf)
  const ada = useRekaman([jalur])
  useEffect(() => {
    putar(
      { jenis: 'tts', teks: 'Sekarang kamu tirukan bunyinya.' },
      { jenis: 'jeda', ms: 250 },
      { jenis: 'rekaman', jalur },
    )
    return hentikan
  }, [jalur])
  return (
    <Bingkai
      {...k}
      aksi={
        <>
          <button type="button" className="tombol-kedua" onClick={() => putar({ jenis: 'rekaman', jalur })}>
            Dengar lagi
          </button>
          <button type="button" className="tombol" onClick={onSelesai}>
            Anak sudah menirukan
          </button>
        </>
      }
    >
      <Instruksi>Ajak anak menirukan bunyinya. Tekan "Anak sudah menirukan" bila tiruannya sudah pas.</Instruksi>
      <KartuBunyi label={huruf} onTekan={() => putar({ jenis: 'rekaman', jalur })} />
      <PetunjukOrtu tampil={ada?.[0] === false}>Ucapkan: {unitDari(huruf).petunjuk}.</PetunjukOrtu>
    </Bingkai>
  )
}

/** Langkah 3: temukan huruf dari bunyinya. */
function Temukan({
  k,
  target,
  pool,
  onSelesai,
}: {
  k: Kerangka
  target: Huruf[]
  pool: Huruf[]
  onSelesai: () => void
}) {
  const [ke, setKe] = useState(0)
  const [salah, setSalah] = useState<{ huruf: Huruf; n: number } | null>(null)
  const [pujian, setPujian] = useState<string | null>(null)
  const timer = useRef(0)
  const h = target[ke]
  const jalur = jalurFonem(h)
  const ada = useRekaman([jalur])

  const pilihan = useMemo(() => {
    const lain = pool.filter((x) => x !== h)
    const sumber = (lain.length >= 2 ? lain : HURUF_TAHAP1.filter((x) => x !== h)) as Huruf[]
    return acak([h, ...acak(sumber).slice(0, 2)])
  }, [h, ke, pool])

  useEffect(() => {
    setSalah(null)
    setPujian(null)
    putar(
      { jenis: 'tts', teks: 'Ketuk huruf yang bunyinya seperti ini.' },
      { jenis: 'jeda', ms: 250 },
      { jenis: 'rekaman', jalur },
    )
    return hentikan
  }, [ke, jalur])

  useEffect(() => () => clearTimeout(timer.current), [])

  const pilih = (x: Huruf) => {
    if (pujian) return
    if (x === h) {
      const teks = pilihSatu(PUJIAN)
      setPujian(teks)
      setSalah(null)
      putar({ jenis: 'tts', teks })
      timer.current = window.setTimeout(() => (ke + 1 < target.length ? setKe(ke + 1) : onSelesai()), 1300)
    } else {
      setSalah({ huruf: x, n: (salah?.n ?? 0) + 1 })
      putar({ jenis: 'tts', teks: 'Hampir. Dengar lagi, ya.' }, { jenis: 'rekaman', jalur })
    }
  }

  return (
    <Bingkai
      {...k}
      aksi={
        <button type="button" className="tombol-kedua" onClick={() => putar({ jenis: 'rekaman', jalur })}>
          Dengar lagi
        </button>
      }
    >
      <Instruksi>Dengarkan bunyinya, lalu ketuk hurufnya.</Instruksi>
      <div className="deret-pilihan">
        {pilihan.map((x) => (
          <KartuBunyi
            key={`${x}-${salah?.huruf === x ? salah.n : 0}`}
            label={x}
            ukuran="sedang"
            tanda="tanpa"
            polos
            ariaLabel={`Huruf ${x}`}
            className={pujian && x === h ? 'benar' : salah?.huruf === x ? 'goyang' : ''}
            onTekan={() => pilih(x)}
          />
        ))}
      </div>
      <Umpan teks={pujian ?? (salah ? 'Hampir. Dengar lagi, ya.' : null)} nada={pujian ? 'baik' : salah ? 'coba' : undefined} />
      <PetunjukOrtu tampil={ada?.[0] === false}>Ucapkan: {unitDari(h).petunjuk}.</PetunjukOrtu>
    </Bingkai>
  )
}

/** Langkah 4: gabung konsonan dan vokal menjadi suku kata (blending). */
function Gabung({
  k,
  konsonan,
  suku,
  onSelesai,
}: {
  k: Kerangka
  konsonan: Huruf
  suku: string
  onSelesai: () => void
}) {
  const vokal = suku.slice(1)
  const jalurK = jalurFonem(konsonan)
  const jalurV = jalurFonem(vokal)
  const jalurS = jalurSuku(suku)
  const ada = useRekaman([jalurK, jalurV, jalurS])
  const [ketukK, setKetukK] = useState(false)
  const [ketukV, setKetukV] = useState(false)
  const [tergabung, setTergabung] = useState(false)

  useEffect(() => {
    putar({ jenis: 'tts', teks: 'Ketuk tiap huruf. Lalu gabungkan bunyinya.' })
    return hentikan
  }, [suku])

  const gabungkan = () => {
    setTergabung(true)
    putar({ jenis: 'jeda', ms: 450 }, { jenis: 'rekaman', jalur: jalurS })
  }

  return (
    <Bingkai
      {...k}
      aksi={
        tergabung ? (
          <>
            <button
              type="button"
              className="tombol-kedua"
              onClick={() =>
                putar(
                  { jenis: 'rekaman', jalur: jalurK },
                  { jenis: 'jeda', ms: 200 },
                  { jenis: 'rekaman', jalur: jalurV },
                  { jenis: 'jeda', ms: 350 },
                  { jenis: 'rekaman', jalur: jalurS },
                )
              }
            >
              Dengar lagi
            </button>
            <button type="button" className="tombol" onClick={onSelesai}>
              Lanjut
            </button>
          </>
        ) : (
          <button type="button" className="tombol" disabled={!(ketukK && ketukV)} onClick={gabungkan}>
            Gabungkan
          </button>
        )
      }
    >
      <Instruksi>
        {tergabung
          ? `Bunyinya bergabung menjadi "${suku}".`
          : ketukK && ketukV
            ? 'Sekarang gabungkan bunyinya.'
            : 'Ketuk kedua huruf dulu untuk mendengar bunyinya.'}
      </Instruksi>
      <div className={`rangkai ${tergabung ? 'tergabung' : ''}`}>
        <KartuBunyi
          label={konsonan}
          className={ketukK ? 'sudah' : ''}
          onTekan={() => {
            setKetukK(true)
            putar({ jenis: 'rekaman', jalur: jalurK })
          }}
        />
        <KartuBunyi
          label={vokal}
          className={ketukV ? 'sudah' : ''}
          onTekan={() => {
            setKetukV(true)
            putar({ jenis: 'rekaman', jalur: jalurV })
          }}
        />
      </div>
      <PetunjukOrtu tampil={ada?.includes(false) ?? false}>
        Ucapkan bunyi {konsonan} ({unitDari(konsonan).petunjuk}), lalu bunyi {vokal}, lalu gabungkan menjadi "{suku}".
      </PetunjukOrtu>
    </Bingkai>
  )
}

/** Langkah 5: baca kata dari suku katanya. Gambar baru muncul setelah kata dibaca. */
function Baca({ k, kata, onSelesai }: { k: Kerangka; kata: string; onSelesai: () => void }) {
  const data = KATA[kata]
  const jalur = data.suku.map(jalurBagian)
  const ada = useRekaman(jalur)
  const [tergabung, setTergabung] = useState(false)

  useEffect(() => {
    putar({ jenis: 'tts', teks: 'Ketuk tiap bagian. Lalu baca katanya.' })
    return hentikan
  }, [kata])

  return (
    <Bingkai
      {...k}
      aksi={
        tergabung ? (
          <>
            <button type="button" className="tombol-kedua" onClick={() => putar({ jenis: 'kata', kata })}>
              Dengar lagi
            </button>
            <button type="button" className="tombol" onClick={onSelesai}>
              Lanjut
            </button>
          </>
        ) : (
          <button
            type="button"
            className="tombol"
            onClick={() => {
              setTergabung(true)
              putar({ jenis: 'jeda', ms: 400 }, { jenis: 'kata', kata })
            }}
          >
            Baca katanya
          </button>
        )
      }
    >
      <Instruksi>{tergabung ? `Kamu membaca "${kata}".` : 'Ketuk tiap bagian, lalu baca katanya.'}</Instruksi>
      <div className="baca">
        <div className={`rangkai rangkai-suku ${tergabung ? 'tergabung' : ''}`}>
          {data.suku.map((s, i) => (
            <KartuBunyi
              key={i}
              label={s}
              tanda="busur"
              onTekan={() => putar({ jenis: 'rekaman', jalur: jalur[i] })}
            />
          ))}
        </div>
        {tergabung && (
          <div className="gambar muncul" role="img" aria-label={data.label}>
            {data.gambar}
          </div>
        )}
      </div>
      <PetunjukOrtu tampil={ada?.includes(false) ?? false}>Ucapkan tiap bagian: {data.suku.join(', ')}.</PetunjukOrtu>
    </Bingkai>
  )
}

/**
 * Langkah 6: cek membaca. Kata hanya tampil sebagai tulisan; audionya baru diputar
 * SETELAH anak menjawab, supaya yang diuji membaca, bukan mendengar (SPEK §4).
 */
export function Cek({
  k,
  kata,
  mode,
  onJawab,
}: {
  k: Kerangka
  kata: string
  mode: 'belajar' | 'tantangan'
  onJawab: (benar: boolean) => void
}) {
  const data = KATA[kata]
  const pilihan = useMemo(() => {
    const pengecoh = [
      ...Object.values(KATA)
        .filter((x) => x.bisaDicek && x.tulisan !== kata)
        .map(({ gambar, label }) => ({ gambar, label })),
      ...PENGECOH,
    ]
    return acak([{ gambar: data.gambar, label: data.label }, ...acak(pengecoh).slice(0, 2)])
  }, [kata, data])
  const [hasil, setHasil] = useState<{ benar: boolean; pujian: string } | null>(null)
  const [salah, setSalah] = useState<{ label: string; n: number } | null>(null)

  useEffect(() => {
    putar({ jenis: 'tts', teks: 'Baca kata ini. Lalu ketuk gambarnya.' })
    return hentikan
  }, [kata])

  const pilih = (label: string) => {
    if (hasil) return
    if (label === data.label) {
      const pujian = pilihSatu(PUJIAN)
      // Di tantangan, hanya jawaban pertama yang dihitung.
      setHasil({ benar: mode === 'belajar' || salah === null, pujian })
      putar({ jenis: 'tts', teks: pujian }, { jenis: 'jeda', ms: 200 }, { jenis: 'kata', kata })
    } else if (mode === 'tantangan') {
      setHasil({ benar: false, pujian: '' })
      setSalah({ label, n: 1 })
      putar({ jenis: 'tts', teks: 'Ini gambarnya.' }, { jenis: 'jeda', ms: 200 }, { jenis: 'kata', kata })
    } else {
      setSalah({ label, n: (salah?.n ?? 0) + 1 })
      putar({ jenis: 'tts', teks: 'Coba baca lagi pelan-pelan.' })
    }
  }

  const umpan = hasil
    ? hasil.benar || mode === 'belajar'
      ? hasil.pujian
      : `Ini gambar "${kata}". Kita latihan lagi nanti.`
    : salah
      ? 'Coba baca lagi pelan-pelan.'
      : null

  return (
    <Bingkai
      {...k}
      aksi={
        hasil && (
          <button type="button" className="tombol" onClick={() => onJawab(hasil.benar)}>
            Lanjut
          </button>
        )
      }
    >
      <Instruksi>Biarkan anak membaca sendiri, lalu mengetuk gambarnya.</Instruksi>
      <p className="kata-tulisan" lang="id">
        <HurufBerwarna teks={kata} />
      </p>
      <div className="deret-pilihan">
        {pilihan.map((o) => (
          <button
            key={`${o.label}-${salah?.label === o.label ? salah.n : 0}`}
            type="button"
            className={`kartu-gambar ${
              hasil && o.label === data.label ? 'benar' : salah?.label === o.label ? 'goyang' : ''
            }`}
            aria-label={o.label}
            onClick={() => pilih(o.label)}
          >
            <span aria-hidden="true">{o.gambar}</span>
          </button>
        ))}
      </div>
      <Umpan teks={umpan} nada={hasil?.benar ? 'baik' : umpan ? 'coba' : undefined} />
    </Bingkai>
  )
}

/** Tantangan Tahap 1: 5 kata, satu kesempatan per kata (SPEK §5). */
export function Tantangan({
  onSelesai,
  onOrtu,
}: {
  onSelesai: (benar: number, kataSalah: string[]) => void
  onOrtu: () => void
}) {
  const soal = useMemo(() => acak(kataSiapCek(HURUF_TAHAP1)).slice(0, SOAL_PER_SET), [])
  const [i, setI] = useState(0)
  const [jawaban, setJawaban] = useState<boolean[]>([])

  const jawab = (benar: boolean) => {
    const semua = [...jawaban, benar]
    if (i + 1 < soal.length) {
      setJawaban(semua)
      setI(i + 1)
    } else {
      onSelesai(
        semua.filter(Boolean).length,
        soal.filter((_, j) => !semua[j]).map((s) => s.tulisan),
      )
    }
  }

  return (
    <Cek
      key={i}
      k={{ atas: <TitikKemajuan total={soal.length} kini={i} label="Tantangan membaca" />, onOrtu }}
      kata={soal[i].tulisan}
      mode="tantangan"
      onJawab={jawab}
    />
  )
}
