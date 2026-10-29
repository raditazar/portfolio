# DESIGN SPECIFICATION & UI/UX BRIEF
## Raditazar Portfolio: Hero-Anchored Plum Noir & Editorial Craft

> **Dokumen Panduan Desain Otoritatif**  
> *Versi*: 3.0 (Hero-Anchored Unified Aesthetic)  
> *Status*: Approved & Fully Implemented  
> *Ruang Lingkup*: Seluruh antarmuka website (Homepage, About, Projects, Admin, dan Komponen Global).

---

## 1. Visi & Filosofi Desain

Portofolio ini berakar dari estetika sinematik **Hero Landing Page** yang menampilkan pencahayaan studio aubergine pada potret Raditya Azhar Ananta, berpadu dengan tipografi berbobot *"Quietly Building"*.

### Prinsip Utama:
1. **Hero-Anchored Chromatic DNA**:
   Seluruh warna gelap website diturunkan secara organik dari warna Hero (**`#120820` Aubergine Velvet** dan **`#0E0717` Deep Obsidian Plum**). Mengeliminasi ketidaksinkronan warna abu-abu/navy lama (`#0B0F14`) sehingga peralihan antar-section terasa mengalir alami tanpa tabrakan nada warna.
2. **Expansive Edge-to-Edge Typography**:
   Tipografi tidak dibatasi di tengah layar secara sempit. Teks sosial (*"GITHUB LINKEDIN EMAIL"*) membentang gagah dengan font size `lg:text-3xl` dan `gap-12`, serta judul besar menggapai sudut layar dengan kontras tajam putih murni (`text-white`).
3. **Editorial Linen Interlude**:
   Section About Me bertindak sebagai lembaran jeda editorial (*art catalog*) berwarna **Warm Linen (`#F4EFE7`)** dengan tipografi tinta gelap `#120820`, memberi kontras yang menyegarkan mata sebelum kembali ke showcase proyek gelap.
4. **Buttery-Smooth Motion (Lenis + GSAP)**:
   Didukung mesin gulir **Lenis** yang tersinkronisasi dengan **GSAP ScrollTrigger**, memberikan pengalaman scroll berbobot (*inertia scrolling*) bebas getaran (*jitter-free*).

---

## 2. Sistem Warna Hero-Anchored

```
┌────────────────────────────────────────────────────────────────────────┐
│  #120820  │  Aubergine Velvet   │  Hero Background & Ambient Overlay   │
├────────────────────────────────────────────────────────────────────────┤
│  #0E0717  │  Obsidian Plum      │  Global Base Canvas, Work & Footer   │
├────────────────────────────────────────────────────────────────────────┤
│  #170C28  │  Lifted Plum        │  Card & Bento Surface                │
├────────────────────────────────────────────────────────────────────────┤
│  #FFFFFF  │  Crisp Pure White   │  Primary Typography & Hero Accents   │
├────────────────────────────────────────────────────────────────────────┤
│  #F4EFE7  │  Warm Linen Cream   │  About Me Sheet & Preloader Curtain  │
└────────────────────────────────────────────────────────────────────────┘
```

### Matriks Peran Warna

| Warna | HEX / Nilai | Peran & Penggunaan |
| :--- | :--- | :--- |
| **Hero Base** | `#120820` | Latar belakang Hero Section dan strip putar tengah GSAP. Menyatu sempurna dengan rim-light foto potret. |
| **Canvas Base** | `#0E0717` | Latar belakang root seluruh halaman, section Work Bento, dan Footer. |
| **Card Surface** | `#170C28` | Bidang permukaan kartu bento, drawer menu melayang, dan tab. |
| **Border Tone** | `rgba(255, 255, 255, 0.08)` | Garis batas tipis 1px yang bersih pada kartu dan tombol. |
| **Text Primary** | `#FFFFFF` | Tipografi tajam, judul display, dan teks sosial links. |
| **Editorial Sheet** | `#F4EFE7` | Lembaran panel About Me dan tirai preloader pembuka. |
| **Editorial Ink** | `#120820` | Teks judul pada panel cream (menggantikan hitam mati). |
| **Functional Accent**| `#34D399` / `#A855F7` | Titik status *Available for work* (emerald) dan spotlight glow violet. |

---

## 3. Integrasi Arsitektur Smooth Scroll (Lenis + GSAP)

* **Pustaka**: `lenis` versi 1.3.27
* **Komponen**: `src/components/SmoothScrollProvider.tsx`
* **Mekanisme**:
  * Gulir roda mouse (*smooth wheel*) dengan kurva redaman eksponensial `duration: 1.2`.
  * Sinkronisasi mutlak via `lenis.on('scroll', ScrollTrigger.update)` dan `gsap.ticker.add((time) => lenis.raf(time * 1000))`.
  * Aksesibilitas: otomatis nonaktif jika pengguna mengaktifkan `prefers-reduced-motion`.

---

## 4. Standar Komponen & Tipografi Hero

1. **Social Links**:
   * Posisi: `absolute left-6 md:left-8 lg:left-16 top-1/3`.
   * Skala: `text-xl font-extrabold uppercase tracking-[0.2em] text-white/78 md:flex lg:text-3xl lg:gap-12`.
2. **Title "Quietly Building"**:
   * Font: Serif Display berukuran besar `text-[clamp(3.2rem,12vw,12rem)] font-black text-white drop-shadow-[0_24px_50px_rgba(0,0,0,0.4)]`.
3. **Foto Potret**:
   * Latar: `bg-[#120820]`.
   * Overlay gradasi asli dipertahankan:
     * Radial: `rgba(18,8,32,0.08)_34%,rgba(18,8,32,0.72)_100%`
     * Linear horizontal: `from-[#120820]/90 via-[#120820]/28 to-transparent`
     * Linear vertikal: `from-[#120820]/95 via-[#120820]/30 to-transparent`
4. **Custom Cursor**:
   * Dot dan Ring dengan `mix-blend-mode: difference` berbasis warna putih murni.

---

## 5. Sinkronisasi Section Bawah (Work Bento & About)

* **About Me Panels**:
  * Menggunakan kanvas Warm Linen (`#F4EFE7`) dengan teks judul `#120820` dan teks tubuh `text-zinc-700`.
  * Kontainer teks kiri dilebarkan ke `max-w-xl` agar mengisi ruang dengan elegan tanpa kekosongan di layar desktop.
* **Work Bento Grid**:
  * Latar belakang: Deep Obsidian Plum (`#0E0717`).
  * Permukaan kartu: Lifted Plum (`#170C28`) dengan border `border-white/10`.
* **Footer & Contact**:
  * Latar belakang: `#0E0717` dengan tipografi putih dan garis batas `border-white/10`.

---

*Dokumen ini merupakan spesifikasi acuan resmi portofolio Raditazar.*
