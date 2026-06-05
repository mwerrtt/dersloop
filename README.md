# DersLoop

**Kaydır, öğren, geç.**

Ders notlarını AI ile 15–40 saniyelik Reels tarzı öğrenme kartlarına ve podcast scriptine dönüştüren modern öğrenme uygulaması.

## Özellikler

- 📱 Mobil uyumlu web uygulaması + PWA
- 🖥️ Electron masaüstü uygulaması (macOS / Windows)
- 🤖 AI destekli özet, video kartları ve podcast üretimi
- 📄 PDF, DOCX, PPTX dosya yükleme
- 🎬 TikTok/Reels tarzı dikey kaydırmalı ders feed'i
- 🎧 Podcast modu (tarayıcı ses sentezi)
- 🔐 Kullanıcı kayıt/giriş + admin paneli
- 🐳 Docker ile tek komutta çalıştırma

## Hızlı Başlangıç

### Gereksinimler

- Node.js 18+
- Docker & Docker Compose (önerilen)
- veya yerel PostgreSQL

### Docker ile (Önerilen)

```bash
git clone https://github.com/mwerrtt/dersloop.git
cd dersloop
cp .env.example .env

# PostgreSQL + Web uygulamasını başlat
docker compose up --build
```

Uygulama: http://localhost:3000 (Docker) veya http://localhost:3001 (yerel dev)

### Yerel Geliştirme

```bash
# Bağımlılıkları kur
npm install

# PostgreSQL'i başlat (Docker)
docker compose up postgres -d

# Ortam değişkenlerini ayarla
cp .env.example .env

# Veritabanını hazırla
npm run db:push
npm run db:seed

# Web uygulamasını başlat
npm run dev
```

### Demo Admin Hesabı

```
Email: admin@dersloop.app
Şifre: DersLoop123!
```

> ⚠️ Sadece local demo için. Canlıya çıkmadan değiştirin.

## Masaüstü Uygulama (Electron)

```bash
# Önce web uygulamasını çalıştırın
npm run dev

# Ayrı terminalde Electron'u başlat
npm run dev:desktop
```

### Masaüstü Build

```bash
npm run build:desktop
# veya
cd apps/desktop && npm run build:mac
cd apps/desktop && npm run build:win
```

## Proje Yapısı

```
dersloop/
├── apps/
│   ├── web/          # Next.js web uygulaması
│   └── desktop/      # Electron masaüstü paketi
├── packages/
│   ├── database/     # Prisma + PostgreSQL
│   └── shared/       # Ortak tipler
├── docker-compose.yml
└── Dockerfile
```

## Demo Akışı

1. Kayıt ol veya giriş yap
2. Ders notu yükle (PDF önerilir)
3. AI analiz ekranını izle
4. Reels tarzı kartları kaydırarak çalış
5. Podcast moduna geç
6. Admin panelden sistemi kontrol et

## AI Yapılandırması

Varsayılan olarak `mock` modu kullanılır (API key gerekmez).

Gerçek AI için `.env` dosyasında:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

## Teknolojiler

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL + Prisma
- **Desktop:** Electron + Electron Builder
- **Auth:** JWT (httpOnly cookie)
- **AI:** OpenAI (mock fallback dahil)

## Lisans

MIT
