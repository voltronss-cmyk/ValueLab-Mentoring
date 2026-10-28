# ValueLab — Prototipe Platform Mentoring Karir Berbasis AI (DEMO)

Prototipe situs statis (HTML + CSS + JavaScript murni). **Tidak perlu build**, sehingga langsung bisa di-deploy ke Vercel.

> ⚠️ **Status demo:** AI belum terintegrasi. Semua grafik, profil radar, dan hasil adalah data contoh. Login hanya simulasi di sisi browser dan **tidak aman** untuk data nyata.

## Struktur
```
index.html
css/styles.css
js/app.js
assets/logo-valuelab.jpg
```

## Akun demo
| Username | Password |
|---|---|
| demo1 | valuelab123 |
| demo2 | valuelab456 |

Nomor customer service demo: +62 853-3322-0052

## Menjalankan lokal
Buka `index.html` di browser, atau jalankan `npx serve .`.

## Deploy ke Vercel
1. Buat repositori GitHub, lalu push seluruh isi folder ini.
2. Di Vercel: **Add New → Project → Import** repositori tersebut.
3. Framework Preset: **Other**. Biarkan Build Command dan Output Directory kosong. Klik **Deploy**.

## Langkah berikutnya (saat AI diintegrasikan)
- Pindahkan autentikasi ke backend (mis. Supabase Auth / NextAuth); jangan simpan password di JavaScript.
- Panggil API AI lewat *serverless function* (folder `api/` di Vercel) agar API key tidak terekspos.
- Ganti data contoh grafik dengan data pengguna dari database.
