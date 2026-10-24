// Aturan SPEK §3.4 & §6: fonem dan suku kata HANYA dari rekaman manusia.
// TTS hanya dipakai untuk kata dan instruksi. Urutan sumber rekaman: suara orang tua
// (direkam lewat app), lalu file bawaan di public/audio/. Bila keduanya tidak ada, UI
// meminta orang tua mengucapkannya; app tidak pernah menggantinya dengan TTS.

import { urlRekamanOrtu } from './rekamanOrtu'

const BASE = import.meta.env.BASE_URL

/** Id rekaman, mis. "fonem/m", "suku/ma", "kata/mama". */
export const jalurFonem = (huruf: string) => `fonem/${huruf}`
export const jalurSuku = (suku: string) => `suku/${suku}`
export const jalurKata = (kata: string) => `kata/${kata}`

export type Suara =
  | { jenis: 'tts'; teks: string }
  | { jenis: 'rekaman'; jalur: string }
  /** Rekaman kata bila ada, kalau tidak ada pakai TTS (boleh untuk kata, SPEK §6). */
  | { jenis: 'kata'; kata: string }
  | { jenis: 'jeda'; ms: number }

const statusBawaan = new Map<string, Promise<boolean>>()

/**
 * Cek apakah file rekaman bawaan benar-benar ada. Server dev mengembalikan index.html
 * untuk file yang hilang, jadi yang dicek adalah tipe kontennya, bukan status saja.
 */
function adaBawaan(id: string): Promise<boolean> {
  let status = statusBawaan.get(id)
  if (!status) {
    status = fetch(fileBawaan(id))
      .then((res) => res.ok && (res.headers.get('content-type') ?? '').startsWith('audio'))
      .catch(() => false)
    statusBawaan.set(id, status)
  }
  return status
}

const fileBawaan = (id: string) => `${BASE}audio/${id}.mp3`

export type SumberRekaman = 'ortu' | 'bawaan' | null

export async function sumberRekaman(id: string): Promise<{ sumber: SumberRekaman; url: string | null }> {
  const ortu = await urlRekamanOrtu(id)
  if (ortu) return { sumber: 'ortu', url: ortu }
  if (await adaBawaan(id)) return { sumber: 'bawaan', url: fileBawaan(id) }
  return { sumber: null, url: null }
}

export const adaRekaman = (id: string) => sumberRekaman(id).then((s) => s.sumber !== null)

let suaraIndonesia: SpeechSynthesisVoice | null | undefined

function pilihSuara(): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null
  if (suaraIndonesia) return suaraIndonesia
  const daftar = window.speechSynthesis.getVoices()
  suaraIndonesia = daftar.find((v) => v.lang.toLowerCase().startsWith('id')) ?? null
  return suaraIndonesia
}

if ('speechSynthesis' in window) {
  window.speechSynthesis.addEventListener?.('voiceschanged', () => {
    suaraIndonesia = undefined
    pilihSuara()
  })
}

/** False bila perangkat tidak punya suara TTS Bahasa Indonesia. */
export function ttsTersedia(): boolean {
  return pilihSuara() !== null
}

const pemutar = new Audio()
let generasi = 0
let terbuka = false

const WAV_SENYAP =
  'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='

/**
 * iOS Safari hanya mengizinkan audio & TTS yang dimulai dari sentuhan pengguna.
 * Panggil ini langsung di handler tombol pertama (mis. "Mulai") agar pemutar
 * boleh dipakai setelahnya, termasuk setelah await.
 */
export function bukaKunciAudio() {
  if (terbuka) return
  terbuka = true
  pemutar.src = WAV_SENYAP
  pemutar.play().catch(() => {})
  if ('speechSynthesis' in window) window.speechSynthesis.speak(new SpeechSynthesisUtterance(''))
}

/** Hentikan semua suara yang sedang atau akan diputar. */
export function hentikan() {
  generasi++
  pemutar.pause()
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}

function putarUrlDalam(url: string, g: number): Promise<void> {
  return new Promise<void>((selesai) => {
    if (g !== generasi) return selesai()
    pemutar.src = url
    pemutar.onended = () => selesai()
    pemutar.onerror = () => selesai()
    pemutar.onpause = () => selesai()
    pemutar.play().catch(() => selesai())
  })
}

async function putarRekaman(id: string, g: number): Promise<void> {
  const { url } = await sumberRekaman(id)
  if (url) await putarUrlDalam(url, g)
}

/** Putar satu URL audio (mis. pratinjau rekaman yang belum disimpan). */
export function putarUrl(url: string): Promise<void> {
  hentikan()
  return putarUrlDalam(url, generasi)
}

function bicara(teks: string, g: number): Promise<void> {
  return new Promise((selesai) => {
    const suara = pilihSuara()
    if (!suara || g !== generasi) return selesai()
    const ucapan = new SpeechSynthesisUtterance(teks)
    ucapan.voice = suara
    ucapan.lang = suara.lang
    ucapan.rate = 0.85
    ucapan.onend = () => selesai()
    ucapan.onerror = () => selesai()
    window.speechSynthesis.speak(ucapan)
  })
}

/** Putar beberapa suara berurutan. Panggilan baru membatalkan urutan sebelumnya. */
export async function putar(...daftar: Suara[]): Promise<void> {
  hentikan()
  const g = generasi
  for (const s of daftar) {
    if (g !== generasi) return
    if (s.jenis === 'tts') await bicara(s.teks, g)
    else if (s.jenis === 'rekaman') await putarRekaman(s.jalur, g)
    else if (s.jenis === 'kata') {
      if (await adaRekaman(jalurKata(s.kata))) await putarRekaman(jalurKata(s.kata), g)
      else await bicara(s.kata, g)
    } else await new Promise((r) => setTimeout(r, s.ms))
  }
}
