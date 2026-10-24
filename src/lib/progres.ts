import { get, set } from 'idb-keyval'
import { HARI_LOLOS_DIBUTUHKAN, UNITS, type Huruf } from '../data/tahap1'

export interface HasilTantangan {
  tanggal: string
  benar: number
  lolos: boolean
}

export interface Progres {
  versi: 1
  sudahPengenalan: boolean
  unitSelesai: Huruf[]
  riwayatTantangan: HasilTantangan[]
  /** Jumlah tantangan gagal berturut-turut (SPEK §5: 2 kali gagal, turun satu langkah). */
  gagalBeruntun: number
  /** Konsonan yang perlu dilatih ulang (gabung + baca) sebelum tantangan berikutnya. */
  perluLatihUlang: Huruf[]
}

export const PROGRES_AWAL: Progres = {
  versi: 1,
  sudahPengenalan: false,
  unitSelesai: [],
  riwayatTantangan: [],
  gagalBeruntun: 0,
  perluLatihUlang: [],
}

const KUNCI = 'calistung-progres-v1'

/** 'tersimpan' = IndexedDB jalan. 'sementara' = penyimpanan gagal, progres hilang saat ditutup. */
export type StatusSimpan = 'tersimpan' | 'sementara'

export async function muatProgres(): Promise<{ progres: Progres; status: StatusSimpan }> {
  try {
    const data = await get<Progres>(KUNCI)
    return { progres: data?.versi === 1 ? data : PROGRES_AWAL, status: 'tersimpan' }
  } catch {
    return { progres: PROGRES_AWAL, status: 'sementara' }
  }
}

export async function simpanProgres(p: Progres): Promise<StatusSimpan> {
  try {
    await set(KUNCI, p)
    return 'tersimpan'
  } catch {
    return 'sementara'
  }
}

/** Tanggal lokal YYYY-MM-DD, dipakai untuk aturan "lolos di 2 hari berbeda". */
export function hariIni(): string {
  const d = new Date()
  const dua = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${dua(d.getMonth() + 1)}-${dua(d.getDate())}`
}

export function hariLolos(p: Progres): string[] {
  return [...new Set(p.riwayatTantangan.filter((h) => h.lolos).map((h) => h.tanggal))]
}

export function tahapDikuasai(p: Progres): boolean {
  return hariLolos(p).length >= HARI_LOLOS_DIBUTUHKAN
}

export function unitBerikutnya(p: Progres): Huruf | null {
  return UNITS.find((u) => !p.unitSelesai.includes(u.huruf))?.huruf ?? null
}

export type Kegiatan =
  | { jenis: 'pelajaran'; huruf: Huruf }
  | { jenis: 'latihUlang' }
  | { jenis: 'tantangan' }
  | { jenis: 'tungguBesok' }
  | { jenis: 'dikuasai' }

export function kegiatanBerikutnya(p: Progres): Kegiatan {
  const unit = unitBerikutnya(p)
  if (unit) return { jenis: 'pelajaran', huruf: unit }
  if (tahapDikuasai(p)) return { jenis: 'dikuasai' }
  if (p.perluLatihUlang.length > 0) return { jenis: 'latihUlang' }
  if (hariLolos(p).includes(hariIni())) return { jenis: 'tungguBesok' }
  return { jenis: 'tantangan' }
}
