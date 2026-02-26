# Ringkasan Perubahan (Stakeholder)

Dokumen ini ialah versi ringkas, fokus impak produk dan pengalaman pengguna.

## Apa yang telah siap

1. Tajuk aplikasi dikemas kini
- Daripada `Linus 3M` kepada `Kuasai Kemahiran 3M`.

2. Laluan pembelajaran guna imej sebenar
- Laluan yang dilukis dengan kod telah diganti dengan latar imej.
- Node pembelajaran masih kekal dan disusun mengikut laluan dalam imej.

3. Maklumat kemajuan dipertingkat pada dashboard
- Setiap kad modul kini memaparkan:
  - progress bar,
  - jumlah pembelajaran selesai / jumlah keseluruhan,
  - jumlah bintang terkumpul,
  - baki pembelajaran belum selesai.

4. Aliran pengguna dikekalkan ikut keperluan
- Tiada lagi butang `Mulakan/Sambung` di dashboard.
- Pengguna klik kad modul untuk masuk ke map/laluan terlebih dahulu.

5. Bahasa dan istilah diperkemas
- Istilah `lessons` ditukar kepada `pembelajaran` pada paparan kategori modul.

6. Interaksi hover diperhalusi
- Animasi hover hanya berlaku pada elemen yang boleh diklik.
- Kotak/container statik tidak lagi bergerak apabila kursor melintas.

7. Responsif untuk pelbagai peranti diperkukuh
- Penyesuaian dibuat pada halaman utama, path, lesson, settings, serta komponen sokongan supaya lebih kemas di skrin mobile/tablet/desktop.

8. Ujian pada telefon dipermudah
- Script dev kini menyokong akses dari telefon dalam rangkaian yang sama (`--host`).

## Impak kepada pengguna

- Navigasi lebih jelas: dari dashboard terus ke map modul.
- Bacaan maklumat kemajuan lebih cepat dan mudah difahami.
- Pengalaman mobile lebih stabil, terutama pada elemen padat (node map, action buttons, settings rows).
- UI terasa lebih konsisten kerana hover hanya pada elemen interaktif.

## Nota

- Terdapat beberapa isu lint legacy dalam kod asal projek yang tidak semestinya berkait perubahan UI ini.
- Fungsi teras pembelajaran kekal sama; perubahan utama adalah pada aliran UI/UX, visual map, dan responsif.

