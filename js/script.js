var PHOTO_EXT = {"menemen":"webp","kuymak":"webp","sucuklu-yumurta":"webp","pankek":"jpg","krep":"jpg","karniyarik":"webp","kuru-fasulye":"png","pirinc-pilavi":"jpg","mercimek-corbasi":"jpg","firin-tavuk":"avif","puf-pisi":"jpg","cilbir":"jpg","kasarli-gozleme":"webp","gevrek-simit":"jpg","boyoz":"jpg","iskender-kebap":"jpg","mantar-sote":"webp","icli-kofte":"jpg","zeytinyagli-fasulye":"jpg","manti":"jpg","ali-nazik":"jpg","et-sote":"jpg","sigara-boregi":"jpg","patatesli-omlet":"webp","zeytinli-acma":"avif","peynirli-dereotlu-pogaca":"webp","kasarli-menemen":"jpg","etli-yaprak-sarma":"jpg","firin-kofte-patates":"jpg","bezelye-yemegi":"jpg","tavuk-sote":"png","firin-makarna":"webp","kis-turlusu":"jpg","bamya-yemegi":"jpg","patlican-musakka":"jpg","sehriye-corbasi":"webp","yayla-corbasi":"jpg","soganli-menemen":"jpg","bufe-tostu":"avif","tavada-su-boregi":"jpg","tavuklu-pilav":"jpg","firinda-cipura":"jpg","zeytinyagli-kereviz":"jpg","nohut-yemegi":"jpg","meyhaneli-bulgur":"webp","tas-kebabi":"jpg","firin-kanat":"jpg","bol-kopuklu-ayran":"webp","turk-kahvesi":"webp","ev-yapimi-limonata":"jpg","reyhan-serbeti":"jpg","demleme-cay":"jpg","salgam-suyu":"webp","gercek-sahlep":"webp","visne-kompostosu":"jpg","nane-limon":"jpg","ihlamur-cayi":"jpg","elma-cayi":"jpg","taze-portakal-suyu":"webp","karadut-surubu":"jpg","kayisi-kompostosu":"jpg","ev-yapimi-kefir":"jpg","seftalili-soguk-cay":"jpg","kusburnu-cayi":"webp","sutlac":"jpg","mozaik-pasta":"jpg","irmik-helvasi":"jpg","revani":"jpg","firin-sutlac":"jpg","sekerpare":"jpg","kazandibi":"jpg","ev-baklavasi":"jpg","ekmek-kadayifi":"jpg","gullac":"jpg","gercek-supangle":"jpg","profiterol":"webp","incir-uyutmasi":"jpg","cevizli-lokum":"jpg","sutlu-irmik-tatlisi":"jpg","kadayif-dolmasi":"webp","kabak-tatlisi":"jpg","dondurmali-irmik":"jpg","ayva-tatlisi":"jpg","trilece":"jpg","keskul":"jpg","salcali-sosis":"jpg","kremali-makarna":"jpg","tavada-tavuk":"jpg","ton-balikli-salata":"jpg","lavas-pizza":"jpg","yumurtali-ekmek":"jpg","yulaf-lapasi":"jpg","kasarli-tost":"jpg","granola-kasesi":"jpg","pratik-omlet":"jpg","fincanda-yumurta":"jpg","avokadolu-tost":"jpg","pratik-krep":"jpg","milfoy-borek":"jpg","tavada-pratik-manti":"jpg","sosisli-makarna":"jpg","sebzeli-noodle":"jpg","tavuk-durum":"jpg","cop-sis":"jpg","peynirli-makarna":"jpg","biberli-lor-kavurmasi":"jpg","avokadolu-peynirli-ekmek":"jpg","tavada-peynirli-yumurta":"jpg","korili-tavuklu-makarna":"jpg","ton-balikli-sandvic":"jpg","salcali-milfoy":"jpg","tavada-lavas-tost":"jpg","firin-patates-cipsi":"jpg","yufkadan-gozleme":"webp","citir-tavuk-parcalari":"jpg","ev-yapimi-granola-bar":"jpg","kasarli-krep-tost":"jpg","bardakta-yulaf":"jpg","fistik-ezmeli-muzlu-tost":"jpg","yumurta-salatasi":"jpg","ton-balikli-lavas":"jpg","sucuklu-makarna":"jpg","tavada-tavuk-sis":"jpg","yogurtlu-semizotu":"jpg","milfoy-sosis-rulo":"jpg","soguk-kahve":"jpg","cilekli-milkshake":"jpg","detoks-suyu":"jpg","naneli-ayran":"jpg","meyveli-soda":"jpg","hizli-limonata":"jpg","muzlu-sut":"jpg","cilekli-kefir":"jpg","soguk-yesil-cay":"jpg","karpuz-frozen":"jpg","kavun-subye":"jpg","nescafeli-frappe":"jpg","pratik-atom":"jpg","mikrodalga-kek":"jpg","biskuvili-pasta":"jpg","bardak-tiramisu":"jpg","muzlu-rulo":"jpg","supangle":"jpg","biskuvili-puding":"jpg","mikrodalga-brownie":"jpg","kakaolu-sutlu-tatli":"jpg","tavada-sufle":"jpg","muzlu-rulo-krep":"jpg","cilekli-magnolia":"jpg","irmik-toplari":"jpg","izgara-somon":"jpg","tavuklu-kinoa":"jpg","lorlu-omlet":"jpg","fistik-ezmeli-bar":"jpg","haslanmis-tavuk":"webp","lorlu-salata":"webp","ton-balikli-makarna":"jpg","hindi-sote":"jpg","karabugday-pilavi":"jpg","izgara-tavuk-sis":"jpg","kinoali-avokado-salatasi":"jpg","yumurta-aki-pankeki":"jpg","firin-tatli-patates":"jpg","hindi-fume-sandvic":"jpg","kinoa-koftesi":"jpg","izgara-levrek":"jpg","firin-tavuk-sinitzel":"jpg","nohutlu-brokoli-salatasi":"jpg","protein-shake":"jpg","yesil-smoothie":"jpg","pancar-suyu":"jpg","orman-meyveli-shake":"jpg","zencefil-shot":"jpg","kakaolu-protein-sut":"jpg","bcaa-karpuz":"jpg","spirulina-smoothie":"jpg","glutamin-elma":"png","sekersiz-puding":"jpg","fit-kek":"jpg","chia-tatlisi":"jpg","ev-yapimi-protein-bar":"jpg","fistik-ezmeli-kurabiye":"jpg","yulafli-enerji-topu":"jpg","proteinli-muzlu-ekmek":"jpg","yulaf-puding":"jpg","muz-dondurmasi":"jpg","havuc-puresi":"jpg","kabak-puresi":"jpg","patates-puresi":"jpg","kabakli-pirinc-corbasi":"jpg","brokoli-puresi":"jpg","sebzeli-tarhana":"jpg","balkabagi-corbasi-bebek":"jpg","kereviz-puresi-bebek":"jpg","bebek-koftesi":"jpg","seftalili-yogurt":"jpg","elmali-muhallebi":"jpg","irmikli-armut":"jpg","muzlu-yulaf-bebek":"jpg","hurmali-bebek-biskuvisi":"jpg"};
var savedIngredients = JSON.parse(localStorage.getItem("ingredients"));
console.log(savedIngredients);

const sidebar         = document.getElementById('sidebar');
const heroCard        = document.getElementById('heroCard');
const container       = document.getElementById('floating-items');
const profileSidebar  = document.getElementById('profileSidebar');
const sidebarOverlay  = document.getElementById('sidebarOverlay');

function toggleSidebar(event) {
    if (event) event.stopPropagation();
    const isOpen = sidebar.classList.contains('open');
    if (isOpen) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    } else {
        if (profileSidebar) profileSidebar.classList.remove('open');
        sidebar.classList.add('open');
        sidebarOverlay.classList.add('active');
    }
}

function toggleCat(element) {
    element.parentElement.classList.toggle('active');
}

function toggleProfileSidebar(event) {
    if (event) event.stopPropagation();
    if (!profileSidebar) return;
    const isOpen = profileSidebar.classList.contains('open');
    if (isOpen) {
        profileSidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    } else {
        sidebar.classList.remove('open');
        profileSidebar.classList.add('open');
        sidebarOverlay.classList.add('active');
    }
}

sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    if (profileSidebar) profileSidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
});

document.addEventListener('click', (e) => {
    if (sidebar && !sidebar.contains(e.target) && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    }
});

function goCategory(category) {
    localStorage.setItem("selectedCategory", category);
    window.location.href = "selection.html";
}

function flattenAllRecipes(data) {
    const list = [];
    (data.kategoriler || []).forEach(kat => {
        (kat.alt_kategoriler || []).forEach(altKat => {
            (altKat.tarifler || []).forEach(t => list.push(t));
        });
    });
    return list;
}

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function renderFloatingItems(foods) {
    if (!container) return;
    container.innerHTML = '';
    foods.forEach((food, index) => {
        const div = document.createElement('div');
        div.className = `side-item pos-${index + 1}`;
        div.setAttribute('data-depth', (index + 1) * 0.1);
        div.style.cursor = 'pointer';
        const emoji = food.emoji ? food.emoji + ' ' : '';
        const meta  = food.sure  ? `<span style="color:var(--olive-branch);font-size:12px;font-weight:600;">${food.sure}</span>` : '';
        div.innerHTML = `${emoji}${food.ad} ${meta}`;
        div.addEventListener('click', () => {
            if (typeof openModalFull === 'function') openModalFull(food);
        });
        container.appendChild(div);
    });
}

var heroRecipe = null;

fetch('/Yemekler5.json')
    .then(r => r.json())
    .then(data => {
        const all    = flattenAllRecipes(data);
        const picked = shuffle(all).slice(0, 8);
        renderFloatingItems(picked);

        heroRecipe     = all[Math.floor(Math.random() * all.length)];
        const heroName = document.getElementById('main-dish-name');
        if (heroName) {
            heroName.textContent = (heroRecipe.emoji ? heroRecipe.emoji + '  ' : '') + heroRecipe.ad;
        }
        const heroBg = document.querySelector('.hero-card-bg');
        if (heroBg) {
            heroBg.style.backgroundImage = `url('./css/assets/tarifler/${heroRecipe.id}.${PHOTO_EXT[heroRecipe.id] || 'jpg'}')`;
        }
        heroCard.style.cursor = 'pointer';
        heroCard.addEventListener('click', function () {
            if (typeof openModalFull === 'function' && heroRecipe) openModalFull(heroRecipe);
        });
    })
    .catch(() => {
        const fallback = [
            { ad: 'Menemen',         emoji: '🍳', sure: '15 dk' },
            { ad: 'Mercimek Çorbası',emoji: '🍲', sure: '40 dk' },
            { ad: 'Tavuk Sote',      emoji: '🍗', sure: '35 dk' },
            { ad: 'Izgara Köfte',    emoji: '🥩', sure: '30 dk' },
            { ad: 'Türk Çayı',       emoji: '🍵', sure: '20 dk' },
            { ad: 'Sütlaç',          emoji: '🍮', sure: '45 dk' },
            { ad: 'Havuç Püresi',    emoji: '🥕', sure: '25 dk' },
            { ad: 'Avokadolu Ekmek', emoji: '🥑', sure: '10 dk' },
        ];
        renderFloatingItems(fallback);
    });

document.addEventListener('mousemove', (e) => {
    document.querySelectorAll('.side-item').forEach(item => {
        const depth = item.getAttribute('data-depth');
        const moveX = (window.innerWidth  / 2 - e.pageX) * depth / 5;
        const moveY = (window.innerHeight / 2 - e.pageY) * depth / 5;
        item.style.translate = `${moveX}px ${moveY}px`;
    });
});

document.addEventListener('mouseleave', () => {
    document.querySelectorAll('.side-item').forEach(item => {
        item.style.translate = '0px 0px';
    });
});

let auth = null;
if (typeof firebase !== 'undefined') {
    const firebaseConfig = {
        apiKey:            "AIzaSyAII5NbG7hFd0lItCsOwnoVdYWXzc5ztyE",
        authDomain:        "evdeki-restoranim-1.firebaseapp.com",
        projectId:         "evdeki-restoranim-1",
        storageBucket:     "evdeki-restoranim-1.firebasestorage.app",
        messagingSenderId: "238625102318",
        appId:             "1:238625102318:web:449783527cdb6fcc8656ff",
        measurementId:     "G-EK97FS901E",
    };
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    if (typeof Favorites !== 'undefined') Favorites.init(auth);

    function refreshHighScore() {
        var el = document.getElementById('psHighScore');
        if (!el) return;
        if (auth && auth.currentUser && typeof firebase !== 'undefined') {
            firebase.firestore().collection('users').doc(auth.currentUser.uid).get()
                .then(function (doc) {
                    if (doc.exists && typeof doc.data().highScore === 'number') {
                        el.textContent = 'En Yüksek Puan: ' + doc.data().highScore;
                        localStorage.setItem('mutfakPanikHighScore', doc.data().highScore);
                    } else {
                        el.textContent = 'En Yüksek Puan: ' + (localStorage.getItem('mutfakPanikHighScore') || '0');
                    }
                })
                .catch(function () {
                    el.textContent = 'En Yüksek Puan: ' + (localStorage.getItem('mutfakPanikHighScore') || '0');
                });
        } else {
            el.textContent = 'En Yüksek Puan: ' + (localStorage.getItem('mutfakPanikHighScore') || '0');
        }
    }

    auth.onAuthStateChanged((user) => {
        const loginWrapper   = document.getElementById('loginBtnWrapper');
        const profileIconBtn = document.getElementById('profileIconBtn');
        const psName         = document.getElementById('psName');
        const psEmail        = document.getElementById('psEmail');
        const psAvatar       = document.getElementById('psAvatar');
        const psFavBtn       = document.getElementById('psFavBtn');

        if (user) {
            if (loginWrapper) loginWrapper.style.display = 'none';
            if (profileIconBtn) {
                profileIconBtn.style.cursor = 'pointer';
                if (user.photoURL) {
                    profileIconBtn.style.backgroundImage = `url('${user.photoURL}')`;
                    if (psAvatar) psAvatar.src = user.photoURL;
                }
            }
            if (psName)  psName.textContent  = user.displayName || 'Kullanıcı';
            if (psEmail) psEmail.textContent = user.email || '';
            if (psFavBtn) psFavBtn.style.display = '';
            refreshHighScore();
            updateFavCount();
        } else {
            if (loginWrapper) loginWrapper.style.display = '';
            if (profileIconBtn) {
                profileIconBtn.style.cursor = 'default';
                profileIconBtn.onclick = null;
            }
            if (psFavBtn) psFavBtn.style.display = 'none';
        }
    });

    const profileIconBtn = document.getElementById('profileIconBtn');
    if (profileIconBtn) {
        profileIconBtn.addEventListener('click', () => refreshHighScore());
    }

    const pslogoutBtn = document.getElementById('psLogoutBtn');
    if (pslogoutBtn) {
        pslogoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await auth.signOut();
                window.location.href = 'girisKayit.html';
            } catch (error) {
                console.error("Çıkış sırasında hata:", error);
            }
        });
    }

    function updateFavCount() {
      var el = document.getElementById('psFavCount');
      if (!el || typeof Favorites === 'undefined') return;
      var n = Favorites.getAll().length;
      el.textContent = n + ' tarif';
    }

    if (typeof Favorites !== 'undefined') {
      Favorites.onChange(function () { updateFavCount(); });
    }

    var psFavBtn = document.getElementById('psFavBtn');
    if (psFavBtn) {
      psFavBtn.addEventListener('click', function () {
        var toggleBtn = document.getElementById('favFilterBtn');
        if (toggleBtn) {
          document.getElementById('profileSidebar').classList.remove('open');
          document.querySelector('.sidebar-overlay').classList.remove('active');
          var section = document.querySelector('.recipe-grid-section');
          if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (!toggleBtn.classList.contains('rgs-fav-btn--active')) toggleBtn.click();
        } else {
          window.location.href = '/';
        }
      });
    }
}