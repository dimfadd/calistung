// Isi Tahap 1 sesuai SPEK-MVP-FONIK.md §3. Urutan array = urutan pengajaran.

export type Huruf = 'a' | 'i' | 'u' | 'm' | 'b' | 'p'

export interface Unit {
  huruf: Huruf
  jenis: 'vokal' | 'konsonan'
  /** Petunjuk cara mengucap bunyi, untuk orang tua bila rekaman belum ada. */
  petunjuk: string
  /** Hanya konsonan: suku kata KV yang dirangkai di langkah Gabung. */
  sukuKata?: string[]
  /** Hanya konsonan: kata baru yang bisa dibaca setelah unit ini. */
  kata?: string[]
}

export interface Kata {
  tulisan: string
  suku: string[]
  /** Gambar sementara (emoji). Ganti dengan ilustrasi asli sebelum uji ke anak. */
  gambar: string
  /** Label gambar untuk pembaca layar. */
  label: string
  /** False bila gambarnya bisa tertukar dengan kata lain (mis. ibu dan mama). */
  bisaDicek: boolean
}

export const UNITS: Unit[] = [
  { huruf: 'a', jenis: 'vokal', petunjuk: 'a, mulut terbuka lebar' },
  { huruf: 'i', jenis: 'vokal', petunjuk: 'i, bibir ditarik seperti senyum' },
  { huruf: 'u', jenis: 'vokal', petunjuk: 'u, bibir dimonyongkan' },
  {
    huruf: 'm',
    jenis: 'konsonan',
    petunjuk: 'mmm, bibir rapat dan berdengung, tanpa "e"',
    sukuKata: ['ma', 'mi', 'mu'],
    kata: ['mama'],
  },
  {
    huruf: 'b',
    jenis: 'konsonan',
    petunjuk: 'b pendek, bibir meletup pelan, tanpa "e" atau "eh"',
    sukuKata: ['ba', 'bi', 'bu'],
    kata: ['ibu', 'ubi', 'bumi'],
  },
  {
    huruf: 'p',
    jenis: 'konsonan',
    petunjuk: 'p pendek, hembusan tanpa suara, tanpa "e" atau "eh"',
    sukuKata: ['pa', 'pi', 'pu'],
    kata: ['papa', 'pipi'],
  },
]

export const KATA: Record<string, Kata> = {
  mama: { tulisan: 'mama', suku: ['ma', 'ma'], gambar: '👩', label: 'mama', bisaDicek: true },
  ibu: { tulisan: 'ibu', suku: ['i', 'bu'], gambar: '👩‍🍼', label: 'ibu', bisaDicek: false },
  ubi: { tulisan: 'ubi', suku: ['u', 'bi'], gambar: '🍠', label: 'ubi', bisaDicek: true },
  bumi: { tulisan: 'bumi', suku: ['bu', 'mi'], gambar: '🌍', label: 'bumi', bisaDicek: true },
  papa: { tulisan: 'papa', suku: ['pa', 'pa'], gambar: '👨', label: 'papa', bisaDicek: true },
  pipi: { tulisan: 'pipi', suku: ['pi', 'pi'], gambar: '😊', label: 'pipi', bisaDicek: true },
}

/** Gambar pengecoh untuk soal cek. Kata-katanya tidak pernah ditampilkan. */
export const PENGECOH = [
  { gambar: '⚽', label: 'bola' },
  { gambar: '🐟', label: 'ikan' },
  { gambar: '🍌', label: 'pisang' },
]

export const HURUF_TAHAP1: Huruf[] = UNITS.map((u) => u.huruf)

/** Kata yang sudah bisa dibaca dan bisa dicek, setelah unit-unit yang selesai. */
export function kataSiapCek(selesai: Huruf[]): Kata[] {
  return UNITS.filter((u) => selesai.includes(u.huruf))
    .flatMap((u) => u.kata ?? [])
    .map((k) => KATA[k])
    .filter((k) => k.bisaDicek)
}

/** Tantangan Tahap 1 (SPEK §5): satu set berisi 5 soal, lolos bila minimal 4 benar. */
export const SOAL_PER_SET = 5
export const AMBANG_LOLOS = 4
/** Tahap dikuasai bila lolos pada sekian hari yang berbeda. */
export const HARI_LOLOS_DIBUTUHKAN = 2
/** Batas durasi sesi (SPEK §5). */
export const BATAS_SESI_MS = 10 * 60 * 1000
