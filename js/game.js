// Main Game Engine for Santa Rush

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Game objects
        this.physics = new Physics();
        this.player = null;
        this.followers = [];
        this.obstacleManager = null;
        this.collectibleManager = null;
        this.api = new GameAPI();
        
        // Game state
        this.gameState = 'menu'; // menu, ready, playing, gameover
        this.score = 0;
        this.highScore = 0;
        this.animationId = null;
        
        // UI elements
        this.startScreen = document.getElementById('startScreen');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.leaderboardModal = document.getElementById('leaderboardModal');
        
        // Background with parallax
        this.bgOffset = 0;
        this.bgSpeed = 1; // Slower than game speed for parallax effect
        
        // Load images
        this.images = {};
        this.imagesLoaded = false;
        this.loadImages();
        
        this.init();
    }

    loadImages() {
        const imageSources = {
            santa: 'pngs/santa-mc.png',
            reindeer: 'pngs/reindeer.png',
            redPillar: 'pngs/red_pillar.png',
            greenPillar: 'pngs/green_pillar.png',
            gift: 'pngs/christmas_gift.png',
            background: 'pngs/background.jpg'
        };

        let loadedCount = 0;
        const totalImages = Object.keys(imageSources).length;

        Object.keys(imageSources).forEach(key => {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    this.imagesLoaded = true;
                    console.log('All images loaded successfully!');
                }
            };
            img.onerror = () => {
                console.warn(`Failed to load ${key}, using fallback graphics`);
                loadedCount++;
                if (loadedCount === totalImages) {
                    this.imagesLoaded = true;
                }
            };
            img.src = imageSources[key];
            this.images[key] = img;
        });
    }

    resizeCanvas() {
        // Make canvas fullscreen
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        // Check backend availability
        this.api.checkBackend();
        
        // Load high score
        this.highScore = this.api.getHighScore();
        
        // Auto-start game after images load
        const checkImagesAndStart = setInterval(() => {
            if (this.imagesLoaded) {
                clearInterval(checkImagesAndStart);
                setTimeout(() => this.startGame(), 500);
            }
        }, 100);
        
        // Event listeners (minimal for compatibility)
        const startBtn = document.getElementById('startBtn');
        if (startBtn) startBtn.addEventListener('click', () => this.startGame());
        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn) restartBtn.addEventListener('click', () => this.startGame());
        document.getElementById('leaderboardBtn').addEventListener('click', () => this.showLeaderboard());
        document.getElementById('closeLeaderboard').addEventListener('click', () => this.hideLeaderboard());
        document.getElementById('backFromLeaderboard').addEventListener('click', () => this.hideLeaderboard());
        
        // Game controls - hold to fly (Jetpack Joyride style)
        this.isHolding = false;
        
        // Mouse/touch controls
        this.canvas.addEventListener('mousedown', () => this.startHolding());
        this.canvas.addEventListener('mouseup', () => this.stopHolding());
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startHolding();
        });
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopHolding();
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                this.startHolding();
            }
        });
        document.addEventListener('keyup', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                this.stopHolding();
            }
        });
        
        // Start animation loop
        this.animate();
    }

    startHolding() {
        this.isHolding = true;
    }

    stopHolding() {
        this.isHolding = false;
    }

    handleInput() {
        // Legacy method for compatibility
        if (this.gameState === 'ready') {
            this.gameState = 'playing';
        } else if (this.gameState === 'playing' && this.player.alive) {
            this.player.jump(this.physics);
        }
    }

    startGame() {
        // Start game immediately in playing mode
        this.gameState = 'playing';
        this.score = 0;
        this.followers = [];
        this.isHolding = false;
        this.invincibilityTimer = 0;
        
        // Initialize game objects
        this.player = new Player(100, this.canvas.height / 2);
        this.obstacleManager = new ObstacleManager(this.canvas);
        this.collectibleManager = new CollectibleManager(this.canvas);
    }

    updateScore() {
        // Score is now drawn directly on canvas
    }

    gameOver() {
        this.gameState = 'gameover';
        
        // Update high score
        const isNewHigh = this.api.saveHighScore(this.score);
        if (isNewHigh) {
            this.highScore = this.score;
        }
        
        // Submit score to backend
        this.api.submitScore('Player', this.score, this.followers.length);
        
        // Auto-restart after 2 seconds
        setTimeout(() => this.startGame(), 2000);
    }

    async showLeaderboard() {
        this.leaderboardModal.classList.remove('hidden');
        this.leaderboardModal.classList.add('flex');
        
        const leaderboardContent = document.getElementById('leaderboardContent');
        leaderboardContent.innerHTML = '<div class="text-center py-4"><div class="loading mx-auto"></div></div>';
        
        const scores = await this.api.getLeaderboard(10);
        
        if (scores.length === 0) {
            leaderboardContent.innerHTML = '<p class="text-center text-gray-500 py-8">No scores yet. Be the first!</p>';
        } else {
            leaderboardContent.innerHTML = scores.map((entry, index) => {
                let rankClass = '';
                let medal = '';
                if (index === 0) {
                    rankClass = 'top-1';
                    medal = '🥇';
                } else if (index === 1) {
                    rankClass = 'top-2';
                    medal = '🥈';
                } else if (index === 2) {
                    rankClass = 'top-3';
                    medal = '🥉';
                }
                
                return `
                    <div class="leaderboard-entry ${rankClass}">
                        <div class="flex items-center gap-3">
                            <span class="text-2xl font-bold text-gray-600">${medal || (index + 1)}</span>
                            <span class="font-semibold text-gray-800">${entry.playerName || 'Anonymous'}</span>
                        </div>
                        <div class="flex gap-4">
                            <span class="font-bold text-blue-600">${entry.score} pts</span>
                            <span class="text-purple-600">${entry.followers || 0} 👥</span>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    hideLeaderboard() {
        this.leaderboardModal.classList.remove('flex');
        this.leaderboardModal.classList.add('hidden');
    }

    update() {
        if (this.gameState !== 'playing') return;
        
        // Update player boosting state
        this.player.isBoosting = this.isHolding;
        
        // Update player
        this.player.update(this.physics, this.canvas);
        
        // Check if player is alive
        if (!this.player.alive) {
            this.gameOver();
            return;
        }
        
        // Update obstacles
        this.obstacleManager.update(this.score);
        
        // Initialize invincibility timer if not exists
        if (this.invincibilityTimer === undefined) {
            this.invincibilityTimer = 0;
        }
        const scoreGained = this.obstacleManager.checkScore(this.player);
        if (scoreGained > 0) {
            this.score += scoreGained;
            this.updateScore();
        }
        
        // Check collision with obstacles (skip during invincibility)
        if (this.invincibilityTimer === 0 && this.obstacleManager.checkCollisions(this.player)) {
            // Lose followers on collision
            if (this.followers.length > 0) {
                // Remove last 2 followers (or all if less than 2)
                const loseCount = Math.min(2, this.followers.length);
                this.followers.splice(this.followers.length - loseCount, loseCount);
                this.updateScore();
                
                // Add brief invincibility to prevent instant re-collision
                this.invincibilityTimer = 30; // 30 frames
            } else {
                // No followers left, game over
                this.player.alive = false;
                this.gameOver();
                return;
            }
        }
        
        // Decrease invincibility timer
        if (this.invincibilityTimer > 0) {
            this.invincibilityTimer--;
        }
        
        // Update collectibles and check for gift collection
        const giftCollected = this.collectibleManager.update(this.physics, this.player, this.followers, this.score);
        if (giftCollected) {
            // Gift gives 5 bonus points!
            this.score += 5;
            this.showBonusText('+5 BONUS!');
        }
        if (this.followers.length > 0) {
            this.updateScore();
        }
        
        // Update followers
        if (this.followers.length > 0) {
            let leader = this.player;
            this.followers.forEach((follower, index) => {
                if (index === 0) {
                    follower.update(this.player);
                } else {
                    follower.update(this.followers[index - 1]);
                }
            });
        }
        
        // Update background scroll with parallax (slower than game speed)
        this.bgOffset -= this.bgSpeed;
        if (this.bgOffset <= -50) {
            this.bgOffset = 0;
        }
    }

    showBonusText(text) {
        // Create floating bonus text element
        const bonusDiv = document.createElement('div');
        bonusDiv.textContent = text;
        bonusDiv.style.position = 'fixed';
        bonusDiv.style.left = '50%';
        bonusDiv.style.top = '30%';
        bonusDiv.style.transform = 'translateX(-50%)';
        bonusDiv.style.fontSize = '32px';
        bonusDiv.style.fontWeight = 'bold';
        bonusDiv.style.color = '#FFD700';
        bonusDiv.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
        bonusDiv.style.zIndex = '100';
        bonusDiv.style.pointerEvents = 'none';
        bonusDiv.className = 'score-popup';
        
        document.body.appendChild(bonusDiv);
        
        setTimeout(() => {
            document.body.removeChild(bonusDiv);
        }, 1000);
    }

    drawBackground() {
        const bgImg = this.images.background;
        
        if (bgImg && bgImg.complete && bgImg.naturalHeight !== 0) {
            // Draw background with parallax scrolling
            const bgWidth = this.canvas.width;
            const bgHeight = this.canvas.height;
            
            // Draw two copies for seamless scrolling
            this.ctx.drawImage(bgImg, this.bgOffset, 0, bgWidth, bgHeight);
            this.ctx.drawImage(bgImg, this.bgOffset + bgWidth, 0, bgWidth, bgHeight);
            
            // Reset offset when it scrolls off screen
            if (this.bgOffset <= -bgWidth) {
                this.bgOffset = 0;
            }
        } else {
            // Fallback gradient if image not loaded
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            gradient.addColorStop(0, '#87CEEB');
            gradient.addColorStop(0.5, '#E0F6FF');
            gradient.addColorStop(0.5, '#90EE90');
            gradient.addColorStop(1, '#7CB342');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    drawCloud(x, y) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 0, Math.PI * 2);
        this.ctx.arc(x + 25, y, 30, 0, Math.PI * 2);
        this.ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawUI() {
        // Draw score in top-left
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(`Score: ${this.score}`, 20, 20);
        
        // Draw reindeer count
        this.ctx.fillText(`🦌 ${this.followers.length}`, 20, 60);
        
        // Draw high score in top-right
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`High: ${this.highScore}`, this.canvas.width - 20, 20);
    }

    drawGameOver() {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Game Over text
        this.ctx.fillStyle = '#FF0000';
        this.ctx.font = 'bold 72px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.ctx.fillText('GAME OVER', centerX, centerY - 50);
        
        // Final score
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.fillText(`Score: ${this.score}`, centerX, centerY + 20);
        this.ctx.fillText(`Reindeers: ${this.followers.length}`, centerX, centerY + 60);
        
        // Restart message
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillText('Restarting...', centerX, centerY + 110);
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.drawBackground();
        
        if (this.gameState === 'playing') {
            // Draw collectibles with images
            this.collectibleManager.draw(this.ctx, this.images.reindeer, this.images.gift);
            
            // Draw obstacles with images
            this.obstacleManager.draw(this.ctx, this.images.redPillar, this.images.greenPillar);
            
            // Draw followers with reindeer image
            this.followers.forEach(follower => follower.draw(this.ctx, this.images.reindeer));
            
            // Draw player with invincibility flash effect
            if (this.invincibilityTimer > 0 && Math.floor(Date.now() / 100) % 2 === 0) {
                this.ctx.globalAlpha = 0.5; // Flash effect during invincibility
            }
            this.player.draw(this.ctx, this.images.santa);
            this.ctx.globalAlpha = 1.0;
            
            // Draw UI on canvas
            this.drawUI();
        }
        
        if (this.gameState === 'gameover') {
            this.drawGameOver();
        }
    }

    animate() {
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Initialize game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});
