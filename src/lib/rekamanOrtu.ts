import { createStore, del, get, keys, set } from 'idb-keyval'

// Rekaman suara orang tua untuk fonem & suku kata. Disimpan hanya di perangkat ini
// (UU PDP: suara termasuk data pribadi). Disimpan sebagai ArrayBuffer, bukan Blob,
// karena Safari lama tidak andal menyimpan Blob di IndexedDB.

const toko = createStore('calistung-suara', 'rekaman')

interface DataRekaman {
  data: ArrayBuffer
  tipe: string
  dibuat: string
}

const urlAktif = new Map<string, string>()

/** URL objek untuk rekaman orang tua dengan id ini (mis. "fonem/m"), atau null bila belum ada. */
export async function urlRekamanOrtu(id: string): Promise<string | null> {
  const ada = urlAktif.get(id)
  if (ada) return ada
  try {
    const r = await get<DataRekaman>(id, toko)
    if (!r) return null
    const url = URL.createObjectURL(new Blob([r.data], { type: r.tipe }))
    urlAktif.set(id, url)
    return url
  } catch {
    return null
  }
}

function lupakanUrl(id: string) {
  const url = urlAktif.get(id)
  if (url) URL.revokeObjectURL(url)
  urlAktif.delete(id)
}

export async function simpanRekamanOrtu(id: string, blob: Blob): Promise<void> {
  await set(id, { data: await blob.arrayBuffer(), tipe: blob.type, dibuat: new Date().toISOString() }, toko)
  lupakanUrl(id)
}

export async function hapusRekamanOrtu(id: string): Promise<void> {
  await del(id, toko)
  lupakanUrl(id)
}

export async function daftarRekamanOrtu(): Promise<Set<string>> {
  try {
    return new Set((await keys(toko)).map(String))
  } catch {
    return new Set()
  }
}
