const savedIngredients = JSON.parse(localStorage.getItem("ingredients"));
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
        const emoji = food.emoji ? food.emoji + ' ' : '';
        const meta  = food.sure  ? `<span style="color:var(--olive-branch);font-size:12px;font-weight:600;">${food.sure}</span>` : '';
        div.innerHTML = `${emoji}${food.ad} ${meta}`;
        container.appendChild(div);
    });
}

fetch('/Yemekler5.json')
    .then(r => r.json())
    .then(data => {
        const all    = flattenAllRecipes(data);
        const picked = shuffle(all).slice(0, 8);
        renderFloatingItems(picked);

        const hero     = all[Math.floor(Math.random() * all.length)];
        const heroName = document.getElementById('main-dish-name');
        if (heroName) {
            heroName.textContent = (hero.emoji ? hero.emoji + '  ' : '') + hero.ad;
        }
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
        apiKey:            "AIzaSyA1mrPoDxYnOQzT_jY5sViGApEovIiWe_E",
        authDomain:        "evdeki-restoranim.firebaseapp.com",
        projectId:         "evdeki-restoranim",
        storageBucket:     "evdeki-restoranim.firebasestorage.app",
        messagingSenderId: "319407352503",
        appId:             "1:319407352503:web:1e5582dddca28b3662fb32",
        measurementId:     "G-NY6V7L1E8H",
    };
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();

    function refreshHighScore() {
        const score = localStorage.getItem('final-score') || '0';
        const el = document.getElementById('psHighScore');
        if (el) el.textContent = `En Yüksek Puan: ${score}`;
    }

    auth.onAuthStateChanged((user) => {
        const loginWrapper   = document.getElementById('loginBtnWrapper');
        const profileIconBtn = document.getElementById('profileIconBtn');
        const psName         = document.getElementById('psName');
        const psEmail        = document.getElementById('psEmail');
        const psAvatar       = document.getElementById('psAvatar');

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
            refreshHighScore();
        } else {
            if (loginWrapper) loginWrapper.style.display = '';
            if (profileIconBtn) {
                profileIconBtn.style.cursor = 'default';
                profileIconBtn.onclick = null;
            }
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
}