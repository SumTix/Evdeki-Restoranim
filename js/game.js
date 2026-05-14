        const gameArea = document.getElementById('game-area');
        const player = document.getElementById('player');
        const scoreElement = document.getElementById('score');
        const finalScoreElement = document.getElementById('final-score');
        const gameOverScreen = document.getElementById('game-over');

        let areaWidth = gameArea.offsetWidth;
        let areaHeight = gameArea.offsetHeight;
        let playerWidth = 60;
        let playerX = areaWidth / 2 - (playerWidth / 2);
        let playerY = 150; 
        let velocityY = 0;
        let gravity = 0.4;
        let jumpStrength = -11;
        let score = 0;
        let isGameOver = false;
        let platforms = [];
        let animationId;

        window.addEventListener('resize', () => {
            areaWidth = gameArea.offsetWidth;
            areaHeight = gameArea.offsetHeight;
        });

        class Platform {
            constructor(y) {
                this.w = 80;
                this.h = 15;
                this.x = Math.random() * (areaWidth - this.w);
                this.y = y;
                this.visual = document.createElement('div');
                this.visual.className = 'platform';
                this.render();
                gameArea.appendChild(this.visual);
            }

            render() {
                this.visual.style.left = this.x + 'px';
                this.visual.style.top = (areaHeight - this.y) + 'px';
            }
        }

        function initPlatforms() {
            platforms = [];
            for (let i = 0; i < 7; i++) {
                platforms.push(new Platform(100 + i * (areaHeight / 7)));
            }
        }

        function update() {
            if (isGameOver) return;

            velocityY += gravity;
            playerY -= velocityY;

            if (playerY > areaHeight / 2) {
                let diff = playerY - areaHeight / 2;
                playerY = areaHeight / 2;
                
                platforms.forEach(p => {
                    p.y -= diff;
                    if (p.y < 0) {
                        p.y = areaHeight;
                        p.x = Math.random() * (areaWidth - p.w);
                        score++;
                        scoreElement.innerText = score;
                    }
                });
            }

            if (velocityY > 0) {
                platforms.forEach(p => {
                    if (
                        playerX + (playerWidth - 10) > p.x && 
                        playerX + 10 < p.x + p.w &&
                        playerY > p.y && 
                        playerY < p.y + p.h + 10
                    ) {
                        velocityY = jumpStrength;
                    }
                });
            }

            if (playerY < -50) {
                endGame();
            }

            player.style.transform = `translate(${playerX}px, ${areaHeight - playerY - playerWidth}px)`;
            platforms.forEach(p => p.render());

            animationId = requestAnimationFrame(update);
        }

        function handleMove(e) {
            if (isGameOver) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const rect = gameArea.getBoundingClientRect();
            let newX = clientX - rect.left - (playerWidth / 2);

            if (newX < 0) newX = 0;
            if (newX > areaWidth - playerWidth) newX = areaWidth - playerWidth;
            playerX = newX;
        }

        gameArea.addEventListener('mousemove', handleMove);
        gameArea.addEventListener('touchmove', (e) => {
            e.preventDefault();
            handleMove(e);
        }, { passive: false });

       function endGame() {
    isGameOver = true;
    cancelAnimationFrame(animationId);
    gameOverScreen.style.display = 'flex';
    finalScoreElement.innerText = score;

    // ✅ Bu iki satırı ekle:
    const prevHigh = parseInt(localStorage.getItem('mutfakPanikHighScore') || '0');
    if (score > prevHigh) {
        localStorage.setItem('mutfakPanikHighScore', score);
    }
}

        function resetGame() {
            // Sayfayı yenilemek yerine değerleri sıfırlayarak daha akıcı geçiş yapabilirsin
            // Ancak mevcut yapını korumak için reload bırakıyorum.
            location.reload();
        }

        initPlatforms();
        update();
