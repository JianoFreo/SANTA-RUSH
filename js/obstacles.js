// Obstacles for Santa Rush

class Obstacle {
    constructor(x, canvas, gapSize = 180) {
        this.x = x;
        this.width = 60;
        this.gapSize = gapSize;
        
        // Random gap position
        const minGapY = 100;
        const maxGapY = canvas.height - gapSize - 100;
        this.gapY = Math.random() * (maxGapY - minGapY) + minGapY;
        
        this.speed = 3;
        this.passed = false;
        this.color = '#8B4513';
    }

    draw(ctx, canvas) {
        // Draw top obstacle
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, 0, this.width, this.gapY);
        
        // Top cap
        ctx.fillStyle = '#654321';
        ctx.fillRect(this.x - 5, this.gapY - 20, this.width + 10, 20);
        
        // Draw bottom obstacle
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.gapY + this.gapSize, this.width, canvas.height - (this.gapY + this.gapSize));
        
        // Bottom cap
        ctx.fillStyle = '#654321';
        ctx.fillRect(this.x - 5, this.gapY + this.gapSize, this.width + 10, 20);
    }

    update() {
        this.x -= this.speed;
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    checkCollision(player) {
        // Check if player is in the x range of the obstacle
        if (player.x + player.width > this.x && player.x < this.x + this.width) {
            // Check if player is NOT in the gap
            if (player.y < this.gapY || player.y + player.height > this.gapY + this.gapSize) {
                return true;
            }
        }
        return false;
    }

    hasPassed(player) {
        if (!this.passed && this.x + this.width < player.x) {
            this.passed = true;
            return true;
        }
        return false;
    }
}

class ObstacleManager {
    constructor(canvas) {
        this.obstacles = [];
        this.canvas = canvas;
        this.spawnDistance = 400;
        this.lastSpawnX = canvas.width;
        this.difficultyLevel = 1;
    }

    reset() {
        this.obstacles = [];
        this.lastSpawnX = this.canvas.width;
        this.difficultyLevel = 1;
    }

    update(score) {
        // Update difficulty based on score
        this.difficultyLevel = 1 + Math.floor(score / 15);
        const gapSize = Math.max(150, 200 - this.difficultyLevel * 3);
        
        // Spawn new obstacles
        if (this.obstacles.length === 0 || this.lastSpawnX - this.obstacles[this.obstacles.length - 1].x > this.spawnDistance) {
            this.obstacles.push(new Obstacle(this.lastSpawnX, this.canvas, gapSize));
            this.lastSpawnX += this.spawnDistance;
        }

        // Update existing obstacles
        this.obstacles.forEach(obstacle => {
            obstacle.update();
            obstacle.speed = 2.5 + this.difficultyLevel * 0.15;
        });

        // Remove off-screen obstacles
        this.obstacles = this.obstacles.filter(obstacle => !obstacle.isOffScreen());
    }

    draw(ctx) {
        this.obstacles.forEach(obstacle => obstacle.draw(ctx, this.canvas));
    }

    checkCollisions(player) {
        for (let obstacle of this.obstacles) {
            if (obstacle.checkCollision(player)) {
                return true;
            }
        }
        return false;
    }

    checkScore(player) {
        let scoreGained = 0;
        this.obstacles.forEach(obstacle => {
            if (obstacle.hasPassed(player)) {
                scoreGained++;
            }
        });
        return scoreGained;
    }
}
