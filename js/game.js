(function () {
  var firebaseConfig = {
    apiKey: "AIzaSyAII5NbG7hFd0lItCsOwnoVdYWXzc5ztyE",
    authDomain: "evdeki-restoranim-1.firebaseapp.com",
    projectId: "evdeki-restoranim-1",
    storageBucket: "evdeki-restoranim-1.firebasestorage.app",
    messagingSenderId: "238625102318",
    appId: "1:238625102318:web:449783527cdb6fcc8656ff",
    measurementId: "G-EK97FS901E"
  };

  if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  var auth = typeof firebase !== 'undefined' ? firebase.auth() : null;
  var db = typeof firebase !== 'undefined' ? firebase.firestore() : null;

  var gameArea = document.getElementById('game-area');
  var player = document.getElementById('player');
  var scoreElement = document.getElementById('score');
  var finalScoreElement = document.getElementById('final-score');
  var gameOverScreen = document.getElementById('game-over');
  var highScoreDisplay = document.getElementById('highScoreDisplay');
  var gameOverHighScore = document.getElementById('gameOverHighScore');

  var areaWidth, areaHeight, areaRect;
  var playerWidth = 60;
  var playerX, playerY;
  var velocityY = 0;
  var gravity = 0.4;
  var jumpStrength = -11;
  var score = 0;
  var isGameOver = false;
  var platforms = [];
  var animationId;
  var currentUser = null;
  var highScore = 0;

  var boostTimer = 0;

  var ITEM_TYPES = ['strawberry', 'cheese', 'bomb', 'brownie', 'cookies'];
  var ITEM_IMGS = {
    strawberry: 'çilek.png',
    cheese: 'peynir.png',
    bomb: 'bomb.png',
    brownie: 'brownie.png',
    cookies: 'cookies.png'
  };

  var pendingMoveX = null;

  function resizeGame() {
    areaWidth = gameArea.offsetWidth;
    areaHeight = gameArea.offsetHeight;
    areaRect = gameArea.getBoundingClientRect();
    if (!playerX) playerX = areaWidth / 2 - (playerWidth / 2);
  }

  window.addEventListener('resize', resizeGame);
  resizeGame();

  if (auth) {
    auth.onAuthStateChanged(function (user) {
      currentUser = user;
      if (user) {
        loadHighScore(user);
      } else {
        highScore = parseInt(localStorage.getItem('mutfakPanikHighScore') || '0', 10);
        updateHighScoreUI();
      }
    });
  } else {
    highScore = parseInt(localStorage.getItem('mutfakPanikHighScore') || '0', 10);
    updateHighScoreUI();
  }

  function loadHighScore(user) {
    db.collection('users').doc(user.uid).get()
      .then(function (doc) {
        if (doc.exists && typeof doc.data().highScore === 'number') {
          highScore = doc.data().highScore;
        }
        updateHighScoreUI();
      })
      .catch(function () {
        highScore = parseInt(localStorage.getItem('mutfakPanikHighScore') || '0', 10);
        updateHighScoreUI();
      });
  }

  function updateHighScoreUI() {
    if (highScoreDisplay) highScoreDisplay.textContent = highScore;
    if (gameOverHighScore) gameOverHighScore.textContent = highScore;
  }

  function saveHighScore(newScore) {
    var prevLocal = parseInt(localStorage.getItem('mutfakPanikHighScore') || '0', 10);
    if (newScore > prevLocal) {
      localStorage.setItem('mutfakPanikHighScore', newScore);
    }
    highScore = newScore;
    updateHighScoreUI();

    if (currentUser && db) {
      db.collection('users').doc(currentUser.uid).get()
        .then(function (doc) {
          if (doc.exists) {
            return db.collection('users').doc(currentUser.uid).update({ highScore: newScore });
          } else {
            return db.collection('users').doc(currentUser.uid).set({
              email: currentUser.email || '',
              name: currentUser.displayName || '',
              highScore: newScore
            });
          }
        })
        .catch(function (e) {
          console.error('Firestore skor kaydedilemedi:', e);
        });
    }
  }

  class Platform {
    constructor(y) {
      this.w = 80;
      this.h = 15;
      this.x = Math.random() * (areaWidth - this.w);
      this.y = y;
      this.visual = document.createElement('div');
      this.visual.className = 'platform';
      this.itemVis = null;
      this.itemType = null;
      this.hasItem = false;
      this.render();
      gameArea.appendChild(this.visual);
      this.tryAddItem();
    }
    render() {
      this.visual.style.left = this.x + 'px';
      this.visual.style.top = (areaHeight - this.y) + 'px';
      if (this.itemVis) {
        this.itemVis.style.left = (this.x + (this.w - 24) / 2) + 'px';
        this.itemVis.style.top = (areaHeight - this.y - 28) + 'px';
      }
    }
    tryAddItem() {
      if (Math.random() < 0.4) {
        var key = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];
        this.itemType = key;
        this.itemVis = document.createElement('div');
        this.itemVis.className = 'item';
        this.itemVis.style.backgroundImage = 'url(./css/assets/' + ITEM_IMGS[key] + ')';
        gameArea.appendChild(this.itemVis);
        this.hasItem = true;
        this.render();
      }
    }
    removeItem() {
      if (this.itemVis && this.itemVis.parentNode) {
        this.itemVis.parentNode.removeChild(this.itemVis);
      }
      this.itemVis = null;
      this.itemType = null;
      this.hasItem = false;
    }
  }

  function initPlatforms() {
    platforms = [];
    for (var i = 0; i < 7; i++) {
      platforms.push(new Platform(100 + i * (areaHeight / 7)));
    }
    platforms[0].x = playerX;
    platforms[0].render();
    playerY = platforms[0].y + platforms[0].h;
  }

  function update() {
    if (isGameOver) return;

    if (pendingMoveX !== null) {
      playerX = pendingMoveX;
      pendingMoveX = null;
    }

    if (boostTimer > 0) {
      boostTimer--;
      velocityY += gravity * 0.5;
      playerY -= velocityY * 1.3;
    } else {
      velocityY += gravity;
      playerY -= velocityY;
    }

    if (playerY > areaHeight / 2) {
      var diff = playerY - areaHeight / 2;
      playerY = areaHeight / 2;
      platforms.forEach(function (p) {
        p.y -= diff;
        if (p.y < 0) {
          p.removeItem();
          p.y = areaHeight;
          p.x = Math.random() * (areaWidth - p.w);
          p.tryAddItem();
          score++;
          scoreElement.textContent = score;
        }
      });
    }

    if (velocityY > 0 && boostTimer === 0) {
      platforms.forEach(function (p) {
        if (
          playerX + (playerWidth - 10) > p.x &&
          playerX + 10 < p.x + p.w &&
          playerY > p.y &&
          playerY < p.y + p.h + 10
        ) {
          velocityY = jumpStrength;
          if (p.hasItem) {
            if (p.itemType === 'bomb') {
              velocityY = 15;
              p.removeItem();
            } else {
              boostTimer = 40;
              p.removeItem();
            }
          }
        }
      });
    }

    if (playerY < -50) {
      endGame();
    }

    player.style.transform = 'translate(' + playerX + 'px, ' + (areaHeight - playerY - playerWidth) + 'px)';
    platforms.forEach(function (p) { p.render(); });
    animationId = requestAnimationFrame(update);
  }

  function handleMove(e) {
    if (isGameOver) return;
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    var newX = clientX - areaRect.left - (playerWidth / 2);
    if (newX < 0) newX = 0;
    if (newX > areaWidth - playerWidth) newX = areaWidth - playerWidth;
    pendingMoveX = newX;
  }

  gameArea.addEventListener('mousemove', handleMove);
  gameArea.addEventListener('touchmove', function (e) {
    if (isGameOver) return;
    e.preventDefault();
    handleMove(e);
  }, { passive: false });
  gameArea.addEventListener('touchstart', function (e) {
    if (isGameOver) return;
    e.preventDefault();
    handleMove(e);
  }, { passive: false });

  function endGame() {
    isGameOver = true;
    cancelAnimationFrame(animationId);
    gameOverScreen.style.display = 'flex';
    finalScoreElement.textContent = score;
    if (score > highScore) {
      saveHighScore(score);
    } else {
      updateHighScoreUI();
    }
    platforms.forEach(function (p) { p.removeItem(); });
  }

  window.resetGame = function resetGame() {
    location.reload();
  };

  initPlatforms();
  update();
})();
