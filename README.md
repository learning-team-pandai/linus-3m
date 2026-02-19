# Linus 3M

Platform pembelajaran asas 3M dengan aliran ringkas: pilih track, buat lesson, dan kumpul bintang.

## Cara Guna Website

1. Buka halaman utama (Dashboard).
2. Pilih track pembelajaran:
   - BM (Bahasa Melayu)
   - MT (Matematik)
3. Dalam halaman track, pilih lesson yang sudah dibuka.
4. Dalam halaman lesson, lengkapkan 3 langkah:
   - Lihat Video
   - Pembelajaran
   - Latihan Mengira
5. Bila semua langkah selesai, lesson akan ditanda lengkap dan bintang akan dikira automatik.
6. Klik `Pelajaran Seterusnya` untuk teruskan.

## Ciri Utama

- Dashboard kemajuan keseluruhan.
- Peta lesson berasaskan checkpoint di atas gambar route.
- Sistem bintang (0 hingga 3) bagi setiap lesson.
- Notifikasi ringkas dan elemen motivasi.
- Butang `Reset Progress` untuk mula semula.

## Konfigurasi Checkpoint Map

- Fail: `data/checkpoints.json`
- Setiap track (`bm`, `mt`) ada:
  - `image.width` dan `image.height` (saiz asal gambar route)
  - `checkpoints` dalam nilai normal (`x`, `y` antara `0` hingga `1`)
- Optional: `nodeOverrides` untuk laras node tertentu ikut nombor lesson (1-based), contoh:
  - `"nodeOverrides": { "7": { "x": 0.49, "y": 0.224 }, "18": { "x": 0.57, "y": 0.515 } }`
- Optional: `uniformVerticalSpacing` (default `true`) untuk samakan jarak menegak semua node dari awal hingga akhir.
- Nota: bila `uniformVerticalSpacing: true`, override `y` dalam `nodeOverrides` diabaikan (hanya `x` dipakai) supaya jarak menegak kekal konsisten.
- Sistem akan auto-resample checkpoint ikut jumlah lesson track dan adjust untuk desktop + mobile.

## Simpanan Progress

- Progress disimpan automatik dalam browser/peranti semasa.
- Jika tukar browser/peranti atau padam data browser, progress akan hilang.

## Tip Penggunaan

- Mulakan dari lesson pertama dalam setiap track.
- Lesson seterusnya akan dibuka selepas lesson sebelumnya selesai.
- Guna `Reset Progress` jika mahu kosongkan semua pencapaian.
