# 🍽️ Evdeki Restoranım

Türk mutfağının en sevilen tariflerini, sporcu ve bebek öğünlerini kapsayan, modern ve kullanıcı dostu bir yemek tarifi web uygulaması.

## Özellikler

- **200+ Tarif** — Gündelik, pratik, sporcu beslenmesi ve bebek öğünleri kategorilerinde geniş tarif arşivi
- **Kategori Sayfaları** — Her kategoriye özel alt sayfalar (yiyecek, içecek, tatlı)
- **Fotoğraflı Kartlar** — Her tarif kendi özgün fotoğrafıyla görüntülenir
- **Canlı Arama** — Tarif adına, alt kategoriye veya malzemeye göre anlık filtreleme
- **Malzeme ile Ara** — Sahip olduğun malzemelerle yapabileceğin tarifleri bul
- **Adım Adım Tarif** — Modal içinde fotoğraflı, adım adım tarif anlatımı
- **Kullanıcı Girişi** — Firebase Authentication ile e-posta/kayıt ve Google ile giriş
- **Mini Oyun** — "Mutfakta Panik" arcade oyunu (en yüksek puan kaydı)
- **Tamamen Mobil Uyumlu** — Responsive tasarım, sidebar navigasyon
- **file:// Uyumlu** — Herhangi bir sunucu gerektirmeden yerel dosya sistemi üzerinden çalışır

## Kategoriler

| Kategori | Yiyecek | İçecek | Tatlı |
|----------|---------|--------|-------|
| 🏠 Gündelik | ✅ | ✅ | ✅ |
| ⚡ Pratik Tarifler | ✅ | ✅ | ✅ |
| 💪 Sporcu Beslenmesi | ✅ | ✅ | ✅ (Fit) |
| 👶 Bebek Öğünleri | ✅ | — | ✅ |

## Kullanılan Teknolojiler

- HTML5, CSS3, Vanilla JavaScript (ES5/ES6+)
- Firebase Authentication (Google & e-posta ile giriş)
- Firebase Firestore (kullanıcı verileri ve oyun skorları)
- JSON tabanlı tarif veritabanı
- Google Fonts (Marcellus, Poppins)
- Boxicons

## Proje Yapısı

```
├── index.html              
├── Yemekler5.json          
├── girisKayit.html         
├── malzeme-ara.html        
├── game.html               
├── js/
│   ├── script.js           
│   ├── recipe-cards.js     
│   ├── category-recipes.js 
│   ├── girisKayit.js       
│   ├── firebase.js         
│   ├── game.js             
│   └── malzeme-ara.js      
├── css/
│   ├── style.css           
│   ├── girisKayit.css      
│   ├── game.css            
│   └── assets/tarifler/    
├── yemekler/               
├── içecekler/              
└── tatlılar/               
```

## Geliştiriciler

- **[SumTix](https://github.com/SumTix)**
- **[lightlymoon](https://github.com/lightlymoon)**

