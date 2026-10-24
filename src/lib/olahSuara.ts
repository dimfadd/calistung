// Merapikan rekaman orang tua: potong hening di awal & akhir, seragamkan volume,
// lalu simpan sebagai WAV mono agar bisa diputar di semua browser.

export class SuaraTidakTerdengar extends Error {}

const PUNCAK_TARGET = 0.89
/** Batas penguatan agar rekaman yang terlalu pelan tidak ikut menguatkan bising. */
const PENGUATAN_MAKS = 8

export async function olahRekaman(rekaman: Blob, ctx: BaseAudioContext): Promise<Blob> {
  const buf = await ctx.decodeAudioData(await rekaman.arrayBuffer())
  const sr = buf.sampleRate
  const mono = new Float32Array(buf.length)
  for (let c = 0; c < buf.numberOfChannels; c++) {
    const d = buf.getChannelData(c)
    for (let i = 0; i < d.length; i++) mono[i] += d[i] / buf.numberOfChannels
  }

  let puncak = 0
  for (const v of mono) puncak = Math.max(puncak, Math.abs(v))
  if (puncak < 0.01) throw new SuaraTidakTerdengar()

  // Cari bagian bersuara dengan RMS per jendela 10 ms.
  const jendela = Math.max(1, Math.round(sr * 0.01))
  const ambang = Math.max(0.006, puncak * 0.06)
  let pertama = -1
  let terakhir = -1
  for (let j = 0; j * jendela < mono.length; j++) {
    let jumlah = 0
    const akhirJ = Math.min(mono.length, (j + 1) * jendela)
    for (let i = j * jendela; i < akhirJ; i++) jumlah += mono[i] * mono[i]
    if (Math.sqrt(jumlah / (akhirJ - j * jendela)) > ambang) {
      if (pertama < 0) pertama = j
      terakhir = j
    }
  }
  if (pertama < 0) throw new SuaraTidakTerdengar()

  const awal = Math.max(0, pertama * jendela - Math.round(sr * 0.04))
  const akhir = Math.min(mono.length, (terakhir + 1) * jendela + Math.round(sr * 0.06))
  if (akhir - awal < sr * 0.06) throw new SuaraTidakTerdengar()

  const potong = mono.slice(awal, akhir)
  let puncakPotong = 0
  for (const v of potong) puncakPotong = Math.max(puncakPotong, Math.abs(v))
  const penguatan = Math.min(PUNCAK_TARGET / puncakPotong, PENGUATAN_MAKS)
  const lembut = Math.min(Math.round(sr * 0.008), Math.floor(potong.length / 2))
  for (let i = 0; i < potong.length; i++) {
    const naik = i < lembut ? i / lembut : 1
    const turun = i >= potong.length - lembut ? (potong.length - 1 - i) / lembut : 1
    potong[i] *= penguatan * Math.min(naik, turun)
  }
  return keWav(potong, sr)
}

function keWav(sampel: Float32Array, sr: number): Blob {
  const buf = new ArrayBuffer(44 + sampel.length * 2)
  const v = new DataView(buf)
  const tulis = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)))
  tulis(0, 'RIFF')
  v.setUint32(4, 36 + sampel.length * 2, true)
  tulis(8, 'WAVE')
  tulis(12, 'fmt ')
  v.setUint32(16, 16, true)
  v.setUint16(20, 1, true)
  v.setUint16(22, 1, true)
  v.setUint32(24, sr, true)
  v.setUint32(28, sr * 2, true)
  v.setUint16(32, 2, true)
  v.setUint16(34, 16, true)
  tulis(36, 'data')
  v.setUint32(40, sampel.length * 2, true)
  for (let i = 0; i < sampel.length; i++) {
    const s = Math.max(-1, Math.min(1, sampel[i]))
    v.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true)
  }
  return new Blob([buf], { type: 'audio/wav' })
}
