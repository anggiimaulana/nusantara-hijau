# 🌿 NusantaraHijau

<p align="center">
  <img src="public/images/logo.png" alt="NusantaraHijau Logo" width="120" />
</p>

<p align="center">
  <strong>Atlas Digital Keanekaragaman Hayati Indonesia</strong><br/>
  Jelajahi dan kenali flora fauna endemik Nusantara yang luar biasa
</p>

<p align="center">
  <a href="https://nusantara-hijau.vercel.app" target="_blank">🌐 Live Demo</a> •
  <a href="#features">✨ Features</a> •
  <a href="#tech-stack">🛠 Tech Stack</a> •
  <a href="#data-sources">📚 Data Sources</a>
</p>

---

## 📖 Tentang

**NusantaraHijau** adalah platform edukasi digital yang didedikasikan untuk memperkenalkan, mencintai, dan melestarikan keanekaragaman hayati Indonesia. Dengan visualisasi interaktif dan data yang akurat, platform ini menjembatani kesenjangan antara data konservasi kompleks dengan pemahaman publik.

> *"Kita tidak akan mau menjaga apa yang tidak kita kenal."*

### Mengapa NusantaraHijau?

- 🏝️ **17.000+ pulau** di Indonesia dengan keanekaragaman hayati tertinggi dunia
- 🔴 **Ratusan spesies** dalam status konservasi Kritis, Terancam, dan Rentan
- 📊 Data dari sumber terpercaya: IUCN Red List, WWF Indonesia, KLHK

---

## ✨ Features

### 🗺️ Peta Interaktif 3D
- Peta Indonesia dengan efek 3D tilt dan hover
- Filter spesies berdasarkan 6 wilayah: Sumatera, Jawa, Kalimantan, Sulawesi, Papua, Bali & Nusa Tenggara
- Navigasi intuitif dengan animasi smooth

### 🔍 Direktori Spesies
- **40+ spesies endemik** Indonesia dengan data lengkap
- Status konservasi IUCN (Kritis CR, Terancam EN, Rentan VU)
- Informasi habitat, populasi, ancaman, dan tindakan konservasi
- Pencarian real-time dan filter multi-kriteria

### 🎨 Desain Premium
- **Glassmorphism UI** dengan backdrop-filter effects
- **Responsive design**: Mobile (320px) hingga 4K Desktop (2560px)
- **Light nature theme**: Warna hijau-lembut yang nyaman di mata
- **Framer Motion** animations untuk pengalaman yang halus

### 📱 Teknologi Modern
- Next.js 16 dengan App Router
- React Server Components untuk performa optimal
- Tailwind CSS v4 dengan custom design system
- TypeScript untuk type safety

---

## 🛠 Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Fonts** | Inter, Playfair Display (Google Fonts) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
# Clone repository
git clone https://github.com/anggiimaulana/nusantara-hijau.git
cd nusantara-hijau

# Install dependencies
npm install

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
nusantara-hijau/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage
│   ├── species/           # Species directory & detail pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── not-found.tsx      # 404 page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles & CSS variables
├── components/            # React components
│   ├── Navbar.tsx
│   ├── InteractiveMap.tsx
│   └── ui/               # Reusable UI components
│       ├── ImageWithFallback.tsx
│       └── motion.tsx
├── data/                 # Static data
│   ├── species.json      # Species data (40+ entries)
│   └── species.schema.json # JSON Schema validation
├── public/               # Static assets
│   └── images/           # Species images
├── lib/                  # Utility functions
└── types/                # TypeScript types
```

---

## 📚 Data Sources

Semua data spesies bersumber dari lembaga terpercaya:

| Sumber | Deskripsi |
|--------|-----------|
| **IUCN Red List** | Database status konservasi global |
| **WWF Indonesia** | Program konservasi satwa & habitat |
| **KLHK** | Kementerian Lingkungan Hidup dan Kehutanan RI |
| **BRIN** | Badan Riset dan Inovasi Nasional |
| **Wikimedia Commons** | Foto-foto berlisensi Creative Commons |
| **iNaturalist** | Platform citizen science |

---

## 🎯 Status Konservasi IUCN

Platform ini menggunakan klasifikasi IUCN Red List:

| Kode | Status | Deskripsi |
|------|--------|-----------|
| **CR** | Kritis | Risiko kepunahan sangat tinggi |
| **EN** | Terancam | Risiko kepunahan tinggi |
| **VU** | Rentan | Risiko kepunahan cukup tinggi |

---

## 🤝 Contributing

Kontribusi selalu diterima! Untuk melaporkan bug atau request fitur:

1. Buka [Issues](https://github.com/anggiimaulana/nusantara-hijau/issues)
2. Pilih template yang sesuai
3. Jelaskan secara detail

---

## 📝 License

Proyek ini dibuat untuk keperluan edukasi dan kompetisi **TECHSOFT 2026**.

---

## 👨‍💻 Authors

**Anggi Maulana**
- GitHub: [@anggiimaulana](https://github.com/anggiimaulana)
- Email: nusantarahijau@example.com
- Instagram: [@nusantarahijau](https://instagram.com/nusantarahijau)

**Rifqy Saputra**
- GitHub: [@muris11](https://github.com/muris11)
- Email: rifqysaputra1102@gmail.com

---

<p align="center">
  <sub>Dibuat dengan ❤️ di Indonesia untuk dunia</sub>
</p>
