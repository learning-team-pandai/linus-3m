# Linus 3M (Phase 1)

Projek statik PURE HTML/CSS/JS untuk dashboard pembelajaran Linus 3M.

## Cara Run Local

```bash
cd public
python3 -m http.server 8000
```

Buka: `http://localhost:8000`

## Nota

- Progress disimpan dalam `localStorage` key `linus3m_progress_v1` (ikut browser/peranti).
- Routing guna querystring:
  - `track.html?track=bm`
  - `lesson.html?track=mt&lesson=mt-01`
