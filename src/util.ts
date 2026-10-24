export function acak<T>(daftar: readonly T[]): T[] {
  const hasil = [...daftar]
  for (let i = hasil.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[hasil[i], hasil[j]] = [hasil[j], hasil[i]]
  }
  return hasil
}

export function pilihSatu<T>(daftar: readonly T[]): T {
  return daftar[Math.floor(Math.random() * daftar.length)]
}

export const PUJIAN = ['Betul!', 'Hebat, kamu teliti.', 'Ya, tepat.']
