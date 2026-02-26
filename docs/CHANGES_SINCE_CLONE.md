# Perubahan Sejak Clone

Dokumen ini merumuskan perubahan yang dibuat dalam sesi ini sejak repo di-clone ke `C:\Users\Faiz Ismail\Desktop\Test3M\linus-3m`.

## 1) Setup dan dev workflow

- Betulkan script dev supaya serasi di Windows/PowerShell.
- Tambah `concurrently` sebagai `devDependency`.
- Kemas kini script:
  - `dev`: jalankan `content:watch` + `vite --host`
  - `dev:mobile`: jalankan `content:watch` + `vite --host --open`
- Fail terlibat:
  - `package.json`
  - `package-lock.json`

## 2) Pathway map berasaskan imej

- Path SVG yang dilukis oleh kod dibuang dari UI path.
- Map kini guna imej background:
  - `public/images/pathway-bg.png.webp`
- Node pembelajaran dikekalkan dan diposisikan atas laluan imej melalui anchor tersuai.
- Tambah konfigurasi posisi node:
  - `PATHWAY_MAP_HEIGHT`
  - `PATHWAY_ANCHORS`
- Fail terlibat:
  - `src/components/path/PathMap.jsx`
  - `src/utils/path.js`
  - `public/images/pathway-bg.png.webp` (fail baharu dalam folder `public/images`)

## 3) Buang overlay/translucent pada map

- Kelas `path-forest` dibuang dari container map untuk hilangkan patch translucent/overlay.
- Fail terlibat:
  - `src/components/path/PathMap.jsx`

## 4) Penukaran tajuk aplikasi

- Tajuk utama ditukar daripada `Linus 3M` kepada `Kuasai Kemahiran 3M` untuk BM dan EN.
- Fail terlibat:
  - `src/data/strings.js`

## 5) Penambahbaikan kad dashboard modul

- Tambah metrik pada kad modul:
  - progress bar
  - bilangan selesai / jumlah
  - bilangan bintang terkumpul
  - bilangan belum selesai
- Kad modul kekal klik ke halaman path (map).
- Butang `Mulakan/Sambung` sempat ditambah, kemudian dibuang semula mengikut arahan.
- Fail terlibat:
  - `src/pages/Home.jsx`
  - `src/data/strings.js` (label UI tambahan; label CTA dibuang semula)

## 6) Terminologi "lessons" ke "pembelajaran"

- Teks deskripsi kategori modul dikemas kini:
  - `Bahasa Melayu - 24 pembelajaran`
  - `Matematik - 23 pembelajaran`
- Fail terlibat:
  - `src/data/index.js`

## 7) Kawalan hover animation

- Hover animation untuk `.card-hover` dihadkan kepada elemen interaktif sahaja:
  - `button`, `a`, `[role="button"]`, `[role="link"]`
- Container statik tidak lagi animate bila hover.
- Fail terlibat:
  - `src/index.css`

## 8) Audit responsif (mobile/tablet/desktop)

Perubahan responsif dilakukan pada beberapa halaman/komponen:

- `Home`
  - saiz teks dan padding kad modul lebih adaptif untuk mobile
- `CategoryPath`
  - header dan sticky progress panel jadi lebih fleksibel pada skrin kecil
- `PathMap` + `LessonNode`
  - node dan label dikecilkan pada mobile supaya kurang overlap
  - padding map dikecilkan pada mobile
- `Lesson`
  - header lebih selamat untuk tajuk panjang
  - butang tindakan bawah jadi full-width pada mobile
- `Settings`
  - setiap row setting stack pada mobile, kembali horizontal pada desktop
- `ResourceLinks`
  - tajuk section + butang status stack pada mobile

Fail terlibat:

- `src/pages/Home.jsx`
- `src/pages/CategoryPath.jsx`
- `src/pages/Lesson.jsx`
- `src/pages/Settings.jsx`
- `src/components/path/PathMap.jsx`
- `src/components/path/LessonNode.jsx`
- `src/components/lesson/ResourceLinks.jsx`

## 9) Fail auto-generated

- `src/data/content-map.json` dikemaskini oleh watcher/script semasa dev.

## 10) Senarai fail berubah (working tree semasa)

- `package-lock.json`
- `package.json`
- `src/components/lesson/ResourceLinks.jsx`
- `src/components/path/LessonNode.jsx`
- `src/components/path/PathMap.jsx`
- `src/data/content-map.json`
- `src/data/index.js`
- `src/data/strings.js`
- `src/index.css`
- `src/pages/CategoryPath.jsx`
- `src/pages/Home.jsx`
- `src/pages/Lesson.jsx`
- `src/pages/Settings.jsx`
- `src/utils/path.js`
- `public/images/pathway-bg.png.webp` (baru)

## 11) Kemaskini terbaru: progress ikut aktiviti level (bukan unlock)

- Definisi `level selesai` ditukar:
  - level dikira selesai hanya bila SEMUA aktiviti dalam level tersebut selesai
  - bukan sekadar status unlock
- Progress dashboard/path kini guna kiraan resource completion sebenar.
- Fail terlibat:
  - `src/utils/progress.js` (baharu)
  - `src/pages/Home.jsx`
  - `src/pages/CategoryPath.jsx`
  - `src/pages/Lesson.jsx`

## 12) Kemaskini terbaru: lesson actions dan flow

- UI aktiviti dalam lesson ditukar kepada satu butang `...` (menu status).
- Status aktiviti guna `Belum Mula` / `Selesai` (boleh toggle selesai/belum selesai).
- Butang `Selesai` di footer lesson dibuang.
- Butang `Pelajaran Seterusnya` kini dikunci sehingga semua aktiviti level semasa selesai.
- Header lesson kini ada nombor level besar.
- Fail terlibat:
  - `src/components/lesson/ResourceLinks.jsx`
  - `src/pages/Lesson.jsx`
  - `src/utils/storage.js`
  - `src/data/strings.js`

## 13) Kemaskini terbaru: kandungan BM & Mengira lengkap 31/31

- `Membaca & Menulis` ditetapkan kepada 31 pembelajaran.
- `Mengira` ditetapkan kepada 31 pembelajaran.
- Jumlah keseluruhan kini 62.
- Data link dalam `content-map.json` telah lengkap untuk BM/Mengira hingga level 31.
- Fail terlibat:
  - `src/data/index.js`
  - `src/data/content-map.json`

## 14) Kemaskini terbaru: map scrolling dan sambungan background

- Isu node berkumpul pada hujung map dibaiki (y clamp dibuang).
- Background map kini boleh sambung menegak (`repeat-y`) apabila level melebihi panjang satu imej.
- Fail terlibat:
  - `src/components/path/PathMap.jsx`
  - `src/utils/path.js`

## 15) Kemaskini terbaru: tuning posisi node atas jalan

- Algoritma posisi node diubah beberapa kali untuk padanan atas jalan tanah:
  - dari anchor statik
  - ke curve dinamik ikut tile image
  - ke pattern zigzag-corner
  - kemudian fine-tune bermula node 5 dan offset khusus node 5/6
- Matlamat: node berada dekat center/corner pathway imej dengan aliran S yang lebih semula jadi.
- Fail terlibat:
  - `src/utils/path.js`

## 16) Nota status semasa

- Dokumen ini telah dikemaskini semula atas permintaan terkini pengguna.
- Perubahan terbaru direkodkan, tetapi masih mungkin perlu fine-tuning visual akhir berdasarkan screenshot tambahan.

## 17) Kemaskini terbaru: warna node ikut modul + current node ungu

- Warna node `completed` kini ikut modul:
  - BM (`Membaca & Menulis`) = biru
  - Mengira = hijau
- Warna node `current/existing` ditukar kepada ungu untuk kedua-dua modul.
- Warna node `locked` dikekalkan tanpa perubahan.
- Fail terlibat:
  - `src/components/path/LessonNode.jsx`
  - `src/index.css`

## 18) Kemaskini terbaru: animasi glow current node

- Gaya visual node semasa ditambah:
  - radial gradient di tengah
  - glow berlapis yang lebih besar
  - animasi breathing/core-shift untuk kesan hidup
- Pelarasan kontras teks nombor node juga dibuat supaya nombor kekal jelas.
- Fail terlibat:
  - `src/index.css`

## 19) Kemaskini terbaru: tuning zigzag horizontal & Y node

- Corak zigzag node BM diperlebar pada paksi X supaya bentuk kiri-kanan lebih ketara dan bersih atas pathway.
- Tuning bermula node 5 ke atas diterapkan melalui pattern khusus.
- Offset Y khusus ditambah untuk node 5 dan node 6 bagi menolak kedudukan ke bawah mengikut maklum balas pengguna.
- Fail terlibat:
  - `src/utils/path.js`
