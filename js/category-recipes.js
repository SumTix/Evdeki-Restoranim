(function () {
  var config = window.CATEGORY_CONFIG || {};
  var kategoriId = config.kategoriId;
  var altKategoriAd = config.altKategoriAd;
  var jsonPath = config.jsonPath || '../../Yemekler5.json';
  var photoBasePath = jsonPath.replace(/Yemekler5\.json$/, 'css/assets/tarifler/');

  if (!kategoriId || !altKategoriAd) {
    console.warn('Kategori sayfası: CATEGORY_CONFIG eksik');
    return;
  }

  async function loadAndRender() {
    try {
      var res = await fetch(jsonPath);
      if (!res.ok) throw new Error('Yüklenemedi');
      var data = await res.json();

      var kat = (data.kategoriler || []).find(function (k) { return k.id === kategoriId; });
      if (!kat) { console.warn('Kategori bulunamadı:', kategoriId); return; }
      var altKat = (kat.alt_kategoriler || []).find(function (a) { return a.ad === altKategoriAd; });
      if (!altKat) { console.warn('Alt kategori bulunamadı:', altKategoriAd); return; }

      var recipes = altKat.tarifler || [];
      renderRecipes(recipes);
    } catch (e) {
      console.error('Tarifler yüklenirken hata:', e);
    }
  }

  function renderRecipes(recipes) {
    var section = document.querySelector('.recipe-grid-section');
    if (!section) return;

    section.innerHTML =
      '<div class="rgs-header">' +
        '<h2 class="rgs-title">' + (config.baslik || 'Tarifler') + ' <span class="rgs-count" id="recipeCount"></span></h2>' +
        '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
          '<button class="rgs-fav-btn" id="favFilterBtn" style="display:none">\u2661 Favoriler</button>' +
        '</div>' +
      '</div>' +
      '<div class="recipe-grid" id="recipeGrid"></div>';

    var grid = section.querySelector('#recipeGrid');
    var countEl = section.querySelector('#recipeCount');
    var favBtn = section.querySelector('#favFilterBtn');

    var showFavOnly = false;

    function updateFavBtn() {
      var isLoggedIn = typeof Favorites !== 'undefined' && Favorites.getAll().length > 0;
      if (favBtn) {
        favBtn.style.display = isLoggedIn ? '' : 'none';
        favBtn.className = 'rgs-fav-btn' + (showFavOnly ? ' rgs-fav-btn--active' : '');
        favBtn.textContent = showFavOnly ? '\u2665 Favoriler' : '\u2661 Favoriler';
      }
    }

    function getFiltered() {
      var list = recipes;
      if (showFavOnly && typeof Favorites !== 'undefined') {
        list = recipes.filter(function (r) { return Favorites.is(r.id); });
      }
      return list;
    }

    function render(list) {
      grid.innerHTML = '';
      countEl.textContent = list.length ? '(' + list.length + ')' : '';
      if (!list.length) {
        grid.innerHTML = '<p class="rgs-empty">Tarif bulunamadı.</p>';
        return;
      }
      list.forEach(function (r, i) {
        var card = createCard(r, i);
        card.style.animationDelay = Math.min(i, 14) * 50 + 'ms';
        grid.appendChild(card);
      });
    }

    function reRender() { render(getFiltered()); }

    reRender();

    if (favBtn) {
      favBtn.addEventListener('click', function () {
        showFavOnly = !showFavOnly;
        updateFavBtn();
        reRender();
      });
    }

    if (typeof Favorites !== 'undefined') {
      Favorites.onChange(function () {
        if (showFavOnly && Favorites.getAll().length === 0) {
          showFavOnly = false;
          updateFavBtn();
          reRender();
        } else if (showFavOnly) {
          reRender();
        }
      });
    }

    updateFavBtn();

    var searchInput = document.getElementById('recipeSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        var q = this.value.toLowerCase().trim();
        if (!q) { render(recipes); return; }
        render(recipes.filter(function (r) {
          return (r.ad || '').toLowerCase().includes(q) ||
            (r.malzemeler || []).some(function (m) { return (m.ad || '').toLowerCase().includes(q); });
        }));
      });
    }
  }

  function createCard(recipe, index) {
    var card = document.createElement('div');
    card.className = 'recipe-card';
    card.dataset.index = index;

    var stepCount = (recipe.adimlar || []).length;
    var ingCount = (recipe.malzemeler || []).length;
    var emoji = recipe.emoji || '🍽️';
    var photoPath = photoBasePath + recipe.id + '.' + (PHOTO_EXT[recipe.id] || 'jpg');

    card.innerHTML =
      '<div class="rc-inner">' +
        '<div class="rc-photo">' +
          '<div class="rc-photo-emoji">' + emoji + '</div>' +
        '</div>' +
        '<div class="rc-badges">' +
          '<span class="rc-badge">' + stepCount + ' Adım</span>' +
          (recipe.sure ? '<span class="rc-badge rc-badge--dim">⏱ ' + recipe.sure + '</span>' : '') +
          (recipe.porsiyon ? '<span class="rc-badge rc-badge--dim">👤 ' + recipe.porsiyon + ' kişilik</span>' : '') +
        '</div>' +
        '<h3 class="rc-title">' + (recipe.ad || 'İsimsiz Tarif') + '</h3>' +
        '<p class="rc-meta">' + ingCount + ' malzeme</p>' +
        '<button class="rc-open-btn" aria-label="Tarifi Aç">' +
          '<span>Tarifi Gör</span>' +
          '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
        '</button>' +
      '</div>';

    var photoDiv = card.querySelector('.rc-photo');
    var img = document.createElement('img');
    img.alt = recipe.ad || '';
    img.onerror = function () { img.style.display = 'none'; };
    img.onload = function () { photoDiv.classList.add('rc-photo--loaded'); };
    img.src = photoPath;
    photoDiv.insertBefore(img, photoDiv.firstChild);

    if (typeof Favorites !== 'undefined') {
      var favBtn = document.createElement('button');
      favBtn.className = 'rc-fav';
      favBtn.setAttribute('aria-label', 'Favorilere Ekle');
      favBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
      function updateFav() { favBtn.classList.toggle('rc-fav--active', Favorites.is(recipe.id)); }
      updateFav();
      Favorites.onChange(function () { updateFav(); });
      favBtn.addEventListener('click', function (e) { e.stopPropagation(); Favorites.toggle(recipe.id).then(function () { updateFav(); }); });
      photoDiv.appendChild(favBtn);
    }

    var open = function (e) { if (e) e.stopPropagation(); openModalFull(recipe); };
    card.querySelector('.rc-open-btn').addEventListener('click', open);
    card.addEventListener('click', open);
    return card;
  }

  var overlayEl = null;
  var modalEl = null;
  var currentStep = 0;
  var steps = [];

  var PHOTO_EXT = {"menemen":"webp","kuymak":"webp","sucuklu-yumurta":"webp","pankek":"jpg","krep":"jpg","karniyarik":"webp","kuru-fasulye":"png","pirinc-pilavi":"jpg","mercimek-corbasi":"jpg","firin-tavuk":"avif","puf-pisi":"jpg","cilbir":"jpg","kasarli-gozleme":"webp","gevrek-simit":"jpg","boyoz":"jpg","iskender-kebap":"jpg","mantar-sote":"webp","icli-kofte":"jpg","zeytinyagli-fasulye":"jpg","manti":"jpg","ali-nazik":"jpg","et-sote":"jpg","sigara-boregi":"jpg","patatesli-omlet":"webp","zeytinli-acma":"avif","peynirli-dereotlu-pogaca":"webp","kasarli-menemen":"jpg","etli-yaprak-sarma":"jpg","firin-kofte-patates":"jpg","bezelye-yemegi":"jpg","tavuk-sote":"png","firin-makarna":"webp","kis-turlusu":"jpg","bamya-yemegi":"jpg","patlican-musakka":"jpg","sehriye-corbasi":"webp","yayla-corbasi":"jpg","soganli-menemen":"jpg","bufe-tostu":"avif","tavada-su-boregi":"jpg","tavuklu-pilav":"jpg","firinda-cipura":"jpg","zeytinyagli-kereviz":"jpg","nohut-yemegi":"jpg","meyhaneli-bulgur":"webp","tas-kebabi":"jpg","firin-kanat":"jpg","bol-kopuklu-ayran":"webp","turk-kahvesi":"webp","ev-yapimi-limonata":"jpg","reyhan-serbeti":"jpg","demleme-cay":"jpg","salgam-suyu":"webp","gercek-sahlep":"webp","visne-kompostosu":"jpg","nane-limon":"jpg","ihlamur-cayi":"jpg","elma-cayi":"jpg","taze-portakal-suyu":"webp","karadut-surubu":"jpg","kayisi-kompostosu":"jpg","ev-yapimi-kefir":"jpg","seftalili-soguk-cay":"jpg","kusburnu-cayi":"webp","sutlac":"jpg","mozaik-pasta":"jpg","irmik-helvasi":"jpg","revani":"jpg","firin-sutlac":"jpg","sekerpare":"jpg","kazandibi":"jpg","ev-baklavasi":"jpg","ekmek-kadayifi":"jpg","gullac":"jpg","gercek-supangle":"jpg","profiterol":"webp","incir-uyutmasi":"jpg","cevizli-lokum":"jpg","sutlu-irmik-tatlisi":"jpg","kadayif-dolmasi":"webp","kabak-tatlisi":"jpg","dondurmali-irmik":"jpg","ayva-tatlisi":"jpg","trilece":"jpg","salcali-sosis":"jpg","kremali-makarna":"jpg","tavada-tavuk":"jpg","ton-balikli-salata":"jpg","lavas-pizza":"jpg","yumurtali-ekmek":"jpg","yulaf-lapasi":"jpg","kasarli-tost":"jpg","granola-kasesi":"jpg","pratik-omlet":"jpg","fincanda-yumurta":"jpg","avokadolu-tost":"jpg","pratik-krep":"jpg","milfoy-borek":"jpg","tavada-pratik-manti":"jpg","sosisli-makarna":"jpg","sebzeli-noodle":"jpg","tavuk-durum":"jpg","cop-sis":"jpg","peynirli-makarna":"jpg","biberli-lor-kavurmasi":"jpg","avokadolu-peynirli-ekmek":"jpg","tavada-peynirli-yumurta":"jpg","korili-tavuklu-makarna":"jpg","ton-balikli-sandvic":"jpg","salcali-milfoy":"jpg","tavada-lavas-tost":"jpg","firin-patates-cipsi":"jpg","yufkadan-gozleme":"webp","citir-tavuk-parcalari":"jpg","ev-yapimi-granola-bar":"jpg","kasarli-krep-tost":"jpg","bardakta-yulaf":"jpg","fistik-ezmeli-muzlu-tost":"jpg","yumurta-salatasi":"jpg","ton-balikli-lavas":"jpg","sucuklu-makarna":"jpg","tavada-tavuk-sis":"jpg","yogurtlu-semizotu":"jpg","milfoy-sosis-rulo":"jpg","soguk-kahve":"jpg","cilekli-milkshake":"jpg","detoks-suyu":"jpg","naneli-ayran":"jpg","meyveli-soda":"jpg","hizli-limonata":"jpg","muzlu-sut":"jpg","cilekli-kefir":"jpg","soguk-yesil-cay":"jpg","karpuz-frozen":"jpg","kavun-subye":"jpg","nescafeli-frappe":"jpg","pratik-atom":"jpg","mikrodalga-kek":"jpg","biskuvili-pasta":"jpg","bardak-tiramisu":"jpg","muzlu-rulo":"jpg","supangle":"jpg","biskuvili-puding":"jpg","mikrodalga-brownie":"jpg","kakaolu-sutlu-tatli":"jpg","tavada-sufle":"jpg","muzlu-rulo-krep":"jpg","cilekli-magnolia":"jpg","irmik-toplari":"jpg","izgara-somon":"jpg","tavuklu-kinoa":"jpg","lorlu-omlet":"jpg","fistik-ezmeli-bar":"jpg","haslanmis-tavuk":"webp","lorlu-salata":"webp","ton-balikli-makarna":"jpg","hindi-sote":"jpg","karabugday-pilavi":"jpg","izgara-tavuk-sis":"jpg","kinoali-avokado-salatasi":"jpg","yumurta-aki-pankeki":"jpg","firin-tatli-patates":"jpg","hindi-fume-sandvic":"jpg","kinoa-koftesi":"jpg","izgara-levrek":"jpg","firin-tavuk-sinitzel":"jpg","nohutlu-brokoli-salatasi":"jpg","protein-shake":"jpg","yesil-smoothie":"jpg","pancar-suyu":"jpg","orman-meyveli-shake":"jpg","zencefil-shot":"jpg","kakaolu-protein-sut":"jpg","bcaa-karpuz":"jpg","spirulina-smoothie":"jpg","glutamin-elma":"png","sekersiz-puding":"jpg","fit-kek":"jpg","chia-tatlisi":"jpg","ev-yapimi-protein-bar":"jpg","fistik-ezmeli-kurabiye":"jpg","yulafli-enerji-topu":"jpg","proteinli-muzlu-ekmek":"jpg","yulaf-puding":"jpg","muz-dondurmasi":"jpg","havuc-puresi":"jpg","kabak-puresi":"jpg","patates-puresi":"jpg","kabakli-pirinc-corbasi":"jpg","brokoli-puresi":"jpg","sebzeli-tarhana":"jpg","balkabagi-corbasi-bebek":"jpg","kereviz-puresi-bebek":"jpg","bebek-koftesi":"jpg","seftalili-yogurt":"jpg","elmali-muhallebi":"jpg","irmikli-armut":"jpg","muzlu-yulaf-bebek":"jpg","hurmali-bebek-biskuvisi":"jpg"};
  window.openModalFull = openModalFull;
  function openModalFull(recipe) {
    steps = (recipe.adimlar || []).map(function (text, i) { return { num: i + 1, text: text }; });
    currentStep = 0;

    if (!modalEl) buildModal();

    modalEl.querySelector('.rm-title').textContent =
      (recipe.emoji ? recipe.emoji + '  ' : '') + (recipe.ad || 'Tarif');

    var modalPhoto = modalEl.querySelector('.rm-modal-photo');
    var modalImg = modalPhoto.querySelector('img');
    var modalEmoji = modalPhoto.querySelector('.rm-modal-photo-emoji');
    modalPhoto.classList.remove('rm-modal-photo--loaded');
    modalImg.style.display = 'none';
    modalImg.src = photoBasePath + recipe.id + '.' + (PHOTO_EXT[recipe.id] || 'jpg');
    modalImg.onload = function () {
      modalPhoto.classList.add('rm-modal-photo--loaded');
      modalImg.style.display = 'block';
    };
    modalImg.onerror = function () {
      modalImg.style.display = 'none';
    };
    modalEmoji.textContent = recipe.emoji || '🍽️';

    modalEl.querySelector('.rm-meta-row').innerHTML = [
      recipe.sure ? '<span class="rm-chip">⏱ ' + recipe.sure + '</span>' : '',
      recipe.porsiyon ? '<span class="rm-chip">👤 ' + recipe.porsiyon + ' kişilik</span>' : '',
      steps.length ? '<span class="rm-chip">📋 ' + steps.length + ' adım</span>' : ''
    ].join('');

    var ul = modalEl.querySelector('.rm-ingredients-list');
    ul.innerHTML = (recipe.malzemeler || []).map(function (m) {
      return '<li class="rm-ingredient">' +
        '<span class="rm-ing-name">' + m.ad + '</span>' +
        '<span class="rm-ing-amount">' + m.miktar + ' ' + m.birim + '</span>' +
      '</li>';
    }).join('');

    syncStep(); syncNav(); syncDots();
    overlayEl.classList.add('rm-visible');
    document.body.classList.add('rm-open');
  }

  function closeModal() {
    overlayEl && overlayEl.classList.remove('rm-visible');
    document.body.classList.remove('rm-open');
  }

  function go(dir) {
    var n = currentStep + dir;
    if (n < 0 || n >= steps.length) return;
    currentStep = n;
    syncStep(); syncNav(); syncDots();
  }

  function syncStep() {
    var s = steps[currentStep];
    var txt = modalEl.querySelector('.rm-step-text');
    txt.classList.remove('rm-slide-in');
    void txt.offsetWidth;
    txt.classList.add('rm-slide-in');
    modalEl.querySelector('.rm-step-num').textContent = 'Adım ' + s.num;
    txt.textContent = s.text;
    var pct = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 100;
    modalEl.querySelector('.rm-progress-fill').style.width = pct + '%';
    modalEl.querySelector('.rm-step-counter').textContent = (currentStep + 1) + ' / ' + steps.length;
  }

  function syncNav() {
    modalEl.querySelector('.rm-prev').disabled = currentStep === 0;
    modalEl.querySelector('.rm-next').disabled = currentStep === steps.length - 1;
  }

  function syncDots() {
    var el = modalEl.querySelector('.rm-dots');
    el.innerHTML = '';
    steps.forEach(function (_, i) {
      var b = document.createElement('button');
      b.className = 'rm-dot-btn' + (i === currentStep ? ' active' : '');
      b.setAttribute('aria-label', 'Adım ' + (i + 1));
      b.addEventListener('click', function () { currentStep = i; syncStep(); syncNav(); syncDots(); });
      el.appendChild(b);
    });
  }

  function buildModal() {
    overlayEl = document.createElement('div');
    overlayEl.className = 'rm-overlay';
    overlayEl.addEventListener('click', function (e) { if (e.target === overlayEl) closeModal(); });

    modalEl = document.createElement('div');
    modalEl.className = 'rm-modal';
    modalEl.setAttribute('role', 'dialog');
    modalEl.setAttribute('aria-modal', 'true');
    modalEl.innerHTML =
      '<button class="rm-close" aria-label="Kapat">✕</button>' +
      '<div class="rm-layout">' +
        '<aside class="rm-ingredients-panel">' +
          '<div class="rm-panel-label">Malzemeler</div>' +
          '<ul class="rm-ingredients-list"></ul>' +
        '</aside>' +
        '<div class="rm-steps-panel">' +
          '<div class="rm-modal-photo"><img alt=""><div class="rm-modal-photo-emoji"></div></div>' +
          '<h2 class="rm-title"></h2>' +
          '<div class="rm-meta-row"></div>' +
          '<div class="rm-progress-bar"><div class="rm-progress-fill"></div></div>' +
          '<div class="rm-step-area">' +
            '<div class="rm-step-num"></div>' +
            '<p class="rm-step-text"></p>' +
          '</div>' +
          '<div class="rm-step-counter-row"><span class="rm-step-counter"></span></div>' +
          '<div class="rm-nav">' +
            '<button class="rm-prev rm-nav-btn">' +
              '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>' +
              ' Önceki' +
            '</button>' +
            '<button class="rm-next rm-nav-btn">' +
              'Sonraki ' +
              '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
            '</button>' +
          '</div>' +
          '<div class="rm-dots"></div>' +
        '</div>' +
      '</div>';

    overlayEl.appendChild(modalEl);
    document.body.appendChild(overlayEl);

    modalEl.querySelector('.rm-close').addEventListener('click', closeModal);
    modalEl.querySelector('.rm-prev').addEventListener('click', function () { go(-1); });
    modalEl.querySelector('.rm-next').addEventListener('click', function () { go(1); });

    document.addEventListener('keydown', function (e) {
      if (!overlayEl.classList.contains('rm-visible')) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') go(1);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') go(-1);
    });

    var tx = 0;
    modalEl.addEventListener('touchstart', function (e) { tx = e.changedTouches[0].clientX; }, { passive: true });
    modalEl.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    });
  }

  function injectStyles() {
    var s = document.createElement('style');
    s.textContent =
'.recipe-grid-section{padding:48px 40px 80px;max-width:1400px;margin:0 auto;width:100%}' +
'.rgs-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;gap:16px;flex-wrap:wrap}' +
'.rgs-title{font-family:\'Marcellus\',serif;font-size:clamp(1.5rem,3vw,2.2rem);color:var(--olive-branch,#8a8550);margin:0;display:flex;align-items:baseline;gap:8px}' +
'.rgs-count{font-family:\'Poppins\',sans-serif;font-size:.75rem;font-weight:400;color:rgba(255,255,255,.3)}' +
'.rgs-empty{grid-column:1/-1;text-align:center;color:rgba(255,255,255,.3);font-family:\'Poppins\',sans-serif;font-size:14px;padding:48px 0}' +
'.rgs-fav-btn{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:30px;padding:9px 18px;color:rgba(255,255,255,.6);font-family:\'Poppins\',sans-serif;font-size:13px;cursor:pointer;transition:all .2s;white-space:nowrap}' +
'.rgs-fav-btn:hover{border-color:rgba(255,71,87,.5);color:#ff4757}' +
'.rgs-fav-btn--active{background:rgba(255,71,87,.15)!important;border-color:#ff4757!important;color:#ff4757!important}' +
'.recipe-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:20px}' +
'.recipe-card{border-radius:18px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);cursor:pointer;transition:transform .28s cubic-bezier(.34,1.56,.64,1),box-shadow .28s ease,border-color .2s;animation:rcUp .38s ease both;overflow:hidden}' +
'@keyframes rcUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}' +
'.recipe-card:hover{transform:translateY(-6px) scale(1.015);box-shadow:0 20px 40px rgba(0,0,0,.32);border-color:rgba(138,133,80,.45)}' +
'.rc-inner{padding:22px 20px 20px;display:flex;flex-direction:column;gap:6px;min-height:200px}' +
'.rc-emoji{font-size:2rem;line-height:1;margin-bottom:4px}' +
'.rc-photo{width:100%;height:150px;border-radius:14px;overflow:hidden;position:relative;background:rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;margin-bottom:8px;flex-shrink:0}' +
'.rc-photo img{width:100%;height:100%;object-fit:cover;display:none;position:absolute;inset:0}' +
'.rc-photo.rc-photo--loaded img{display:block}' +
'.rc-photo-emoji{font-size:2.8rem;line-height:1;opacity:.6;transition:opacity .25s}' +
'.rc-photo.rc-photo--loaded .rc-photo-emoji{opacity:0;pointer-events:none}' +
'.rc-fav{position:absolute;top:8px;right:8px;z-index:2;width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,.5);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.7);transition:all .22s;padding:0;backdrop-filter:blur(4px)}' +
'.rc-fav:hover{background:rgba(0,0,0,.7);color:#ff4757;transform:scale(1.1)}' +
'.rc-fav--active{color:#ff4757!important;background:rgba(255,71,87,.25)!important}' +
'.rc-badges{display:flex;gap:5px;flex-wrap:wrap}' +
'.rc-badge{display:inline-flex;align-items:center;background:rgba(138,133,80,.16);color:var(--olive-branch,#a09858);font-family:\'Poppins\',sans-serif;font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:20px}' +
'.rc-badge--dim{background:rgba(255,255,255,.06);color:rgba(255,255,255,.45)}' +
'.rc-title{font-family:\'Marcellus\',serif;font-size:1.05rem;color:#f0ece0;margin:4px 0 0;line-height:1.35}' +
'.rc-meta{font-family:\'Poppins\',sans-serif;font-size:11px;color:rgba(255,255,255,.3);margin:0}' +
'.rc-open-btn{margin-top:auto;display:inline-flex;align-items:center;gap:7px;background:none;border:1px solid rgba(255,255,255,.1);border-radius:24px;color:var(--olive-branch,#a09858);font-family:\'Poppins\',sans-serif;font-size:12px;font-weight:500;padding:7px 14px;cursor:pointer;width:fit-content;transition:background .2s,border-color .2s,gap .2s}' +
'.rc-open-btn:hover{background:rgba(138,133,80,.15);border-color:var(--olive-branch,#a09858);gap:11px}' +
'.rm-overlay{position:fixed;inset:0;background:rgba(0,0,0,.78);backdrop-filter:blur(10px);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;pointer-events:none;transition:opacity .3s ease}' +
'.rm-overlay.rm-visible{opacity:1;pointer-events:auto}' +
'body.rm-open{overflow:hidden}' +
'.rm-modal{position:relative;background:#1a1a14;border:1px solid rgba(138,133,80,.22);border-radius:22px;width:100%;max-width:860px;max-height:88vh;overflow:hidden;opacity:0;transform:translateY(28px) scale(.97);transition:opacity .34s cubic-bezier(.16,1,.3,1),transform .34s cubic-bezier(.16,1,.3,1);box-shadow:0 40px 80px rgba(0,0,0,.6)}' +
'.rm-overlay.rm-visible .rm-modal{opacity:1;transform:none}' +
'.rm-close{position:absolute;top:16px;right:16px;z-index:10;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.55);width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s}' +
'.rm-close:hover{background:rgba(255,255,255,.12);color:#fff}' +
'.rm-layout{display:flex;height:100%;max-height:88vh;overflow:hidden}' +
'.rm-ingredients-panel{width:220px;min-width:220px;background:rgba(0,0,0,.22);border-right:1px solid rgba(255,255,255,.06);padding:36px 18px 28px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(138,133,80,.3) transparent}' +
'.rm-panel-label{font-family:\'Poppins\',sans-serif;font-size:9px;font-weight:600;letter-spacing:.13em;text-transform:uppercase;color:var(--olive-branch,#8a8550);margin-bottom:14px}' +
'.rm-ingredients-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0}' +
'.rm-ingredient{display:flex;justify-content:space-between;align-items:baseline;gap:8px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05)}' +
'.rm-ingredient:last-child{border-bottom:none}' +
'.rm-ing-name{font-family:\'Poppins\',sans-serif;font-size:12px;color:rgba(255,255,255,.65);line-height:1.4}' +
'.rm-ing-amount{font-family:\'Poppins\',sans-serif;font-size:11px;color:var(--olive-branch,#8a8550);white-space:nowrap;flex-shrink:0}' +
'.rm-steps-panel{flex:1;padding:38px 38px 28px;overflow-y:auto;display:flex;flex-direction:column;gap:15px}' +
'.rm-title{font-family:\'Marcellus\',serif;font-size:clamp(1.25rem,3vw,1.8rem);color:#f0ece0;margin:0;line-height:1.25;padding-right:36px}' +
'.rm-meta-row{display:flex;gap:7px;flex-wrap:wrap}' +
'.rm-chip{font-family:\'Poppins\',sans-serif;font-size:11px;color:rgba(255,255,255,.42);background:rgba(255,255,255,.05);padding:3px 10px;border-radius:20px}' +
'.rm-progress-bar{height:3px;background:rgba(255,255,255,.08);border-radius:2px;overflow:hidden}' +
'.rm-progress-fill{height:100%;background:var(--olive-branch,#8a8550);border-radius:2px;transition:width .4s cubic-bezier(.34,1.56,.64,1)}' +
'.rm-step-area{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:14px;padding:22px 24px;min-height:130px;display:flex;flex-direction:column;gap:10px}' +
'.rm-step-num{font-family:\'Poppins\',sans-serif;font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--olive-branch,#8a8550)}' +
'.rm-step-text{font-family:\'Poppins\',sans-serif;font-size:14px;font-weight:300;line-height:1.75;color:rgba(255,255,255,.8);margin:0}' +
'@keyframes rmSlide{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}' +
'.rm-slide-in{animation:rmSlide .26s cubic-bezier(.16,1,.3,1) both}' +
'.rm-step-counter-row{display:flex;justify-content:flex-end}' +
'.rm-step-counter{font-family:\'Poppins\',sans-serif;font-size:11px;color:rgba(255,255,255,.25)}' +
'.rm-nav{display:flex;gap:10px}' +
'.rm-nav-btn{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:26px;font-family:\'Poppins\',sans-serif;font-size:12px;font-weight:500;cursor:pointer;transition:all .2s;border:1px solid rgba(138,133,80,.32);background:rgba(138,133,80,.1);color:var(--olive-branch,#a09858)}' +
'.rm-nav-btn:hover:not(:disabled){background:rgba(138,133,80,.22);border-color:var(--olive-branch,#a09858)}' +
'.rm-nav-btn:disabled{opacity:.22;cursor:not-allowed}' +
'.rm-dots{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px}' +
'.rm-dot-btn{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.14);border:none;cursor:pointer;padding:0;transition:background .2s,transform .2s}' +
'.rm-dot-btn.active{background:var(--olive-branch,#8a8550);transform:scale(1.4)}' +
'.rm-dot-btn:hover:not(.active){background:rgba(255,255,255,.28)}' +
'.rm-modal-photo{width:100%;height:200px;border-radius:14px;overflow:hidden;position:relative;background:rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;margin-bottom:12px;flex-shrink:0}' +
'.rm-modal-photo img{width:100%;height:100%;object-fit:cover;display:none;position:absolute;inset:0}' +
'.rm-modal-photo.rm-modal-photo--loaded img{display:block}' +
'.rm-modal-photo-emoji{font-size:3.2rem;line-height:1;opacity:.6;transition:opacity .25s}' +
'.rm-modal-photo.rm-modal-photo--loaded .rm-modal-photo-emoji{opacity:0;pointer-events:none}' +
'';
    document.head.appendChild(s);
  }

  injectStyles();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadAndRender);
  else loadAndRender();
})();
