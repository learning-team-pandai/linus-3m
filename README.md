# Linus 3M (Phase 1)

Projek statik HTML/CSS/JS untuk dashboard pembelajaran Linus 3M.

## Struktur Repo

```
.
├── index.html
├── track.html
├── lesson.html
├── app.js
├── styles.css
├── assets/
└── data/
```

Repo ini guna `root` sebagai sumber laman (bukan `public/`).

## Cara Run Local

```bash
python3 -m http.server 8000
```

Buka: `http://localhost:8000`

## Deploy GitHub Pages

1. GitHub repo `Settings` -> `Pages`.
2. `Build and deployment`:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - `Folder`: `/ (root)`
3. Simpan, tunggu deploy siap.

## Flow Sync Ke GitHub

```bash
git add -A
git commit -m "update content"
git push
```

## Nota

- Progress disimpan dalam `localStorage` key `linus3m_progress_v1` (ikut browser/peranti).
- Routing guna querystring:
  - `track.html?track=bm`
  - `lesson.html?track=mt&lesson=mt-01`
