# Rekaman Suara

Bunyi huruf (fonem) dan suku kata **wajib direkam manusia**, tidak boleh memakai TTS
(lihat `SPEK-MVP-FONIK.md` §3.4 dan §6). Selama file belum ada, app menampilkan petunjuk
agar orang tua yang mengucapkan bunyinya.

## Yang dibutuhkan Tahap 1 (15 file)

```
fonem/a.mp3  fonem/i.mp3  fonem/u.mp3  fonem/m.mp3  fonem/b.mp3  fonem/p.mp3
suku/ma.mp3  suku/mi.mp3  suku/mu.mp3
suku/ba.mp3  suku/bi.mp3  suku/bu.mp3
suku/pa.mp3  suku/pi.mp3  suku/pu.mp3
```

Tahap 2 (sisa dari 27 file MVP): `fonem/s.mp3`, `fonem/t.mp3`, `fonem/n.mp3`, dan
`suku/{s,t,n}{a,i,u}.mp3`.

## Opsional: rekaman kata

`kata/<kata>.mp3` (misalnya `kata/mama.mp3`). Bila ada, app memakai rekaman ini.
Bila tidak ada, app memakai suara TTS Bahasa Indonesia dari perangkat.

## Standar rekaman

- Satu penutur yang sama untuk semua fonem dan suku kata.
- Ruang senyap, mono, volume dinormalisasi.
- Tanpa jeda kosong di awal dan akhir file.
- Bunyi konsonan tanpa vokal tambahan: `b` dibaca /b/ pendek, **bukan** "be" atau "beh".
