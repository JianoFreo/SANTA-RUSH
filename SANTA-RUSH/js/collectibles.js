// Collectibles (followers) for Santa Rush

class Collectible {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.collected = false;
        this.color = '#FFD700';
        this.pulseSize = 0;
        this.speed = 2.5; // Match obstacle speed
    }

    draw(ctx, reindeerImage) {
        if (this.collected) return;

        ctx.save();
        
        // Pulse effect
        this.pulseSize = Math.sin(Date.now() / 200) * 2;
        const size = this.radius + this.pulseSize;
        
        // Try to draw reindeer image
        if (reindeerImage && reindeerImage.complete && reindeerImage.naturalHeight !== 0) {
            const imgSize = size * 2;
            ctx.drawImage(reindeerImage, this.x - imgSize / 2, this.y - imgSize / 2, imgSize, imgSize);
        } else {
            // Fallback: Outer glow
            ctx.fillStyle = 'rgba(139, 69, 19, 0.3)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, size + 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Reindeer silhouette
            // Body (circle)
            ctx.fillStyle = '#8B4513';
            ctx.beginPath();
            ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
            ctx.fill();
            
            // Head (smaller circle)
            ctx.fillStyle = '#A0522D';
            ctx.beginPath();
            ctx.arc(this.x + size * 0.5, this.y - size * 0.3, size * 0.6, 0, Math.PI * 2);
            ctx.fill();
            
            // Antlers
            ctx.strokeStyle = '#654321';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x + size * 0.3, this.y - size * 0.7);
            ctx.lineTo(this.x + size * 0.2, this.y - size * 1.2);
            ctx.moveTo(this.x + size * 0.7, this.y - size * 0.7);
            ctx.lineTo(this.x + size * 0.8, this.y - size * 1.2);
            ctx.stroke();
            
            // Red nose
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.arc(this.x + size * 0.8, this.y - size * 0.2, size * 0.2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }

    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
    }

    update() {
        this.x -= this.speed;
    }

    isOffScreen() {
        return this.x + this.radius < 0;
    }

    checkCollection(player, physics) {
        if (this.collected) return false;

        const hitboxWidth = player.hitboxWidth || player.width;
        const hitboxHeight = player.hitboxHeight || player.height;
        const hitboxOffsetX = player.hitboxOffsetX || 0;
        const hitboxOffsetY = player.hitboxOffsetY || 0;

        const playerCenter = {
            x: player.x + hitboxOffsetX + hitboxWidth / 2,
            y: player.y + hitboxOffsetY + hitboxHeight / 2,
            radius: Math.max(hitboxWidth, hitboxHeight) / 2
        };

        const collectibleCircle = {
            x: this.x,
            y: this.y,
            radius: this.radius
        };

        if (physics.checkCircleCollision(playerCenter, collectibleCircle)) {
            this.collected = true;
            return true;
        }
        return false;
    }
}

// Christmas Gift Collectible - gives bonus points
class Gift {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.collected = false;
        this.speed = 2.5;
        this.rotation = 0;
        this.type = 'gift';
    }

    draw(ctx, giftImage) {
        if (this.collected) return;

        ctx.save();
        
        // Rotate for visual effect
        this.rotation += 0.05;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Try to draw gift image
        if (giftImage && giftImage.complete && giftImage.naturalHeight !== 0) {
            ctx.drawImage(giftImage, -this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            // Fallback: Outer glow
            ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
            ctx.fillRect(-this.width / 2 - 5, -this.height / 2 - 5, this.width + 10, this.height + 10);
            
            // Gift box
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            
            // Ribbon (horizontal)
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(-this.width / 2, -3, this.width, 6);
            
            // Ribbon (vertical)
            ctx.fillRect(-3, -this.height / 2, 6, this.height);
            
            // Bow
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(-8, -this.height / 2, 5, 0, Math.PI * 2);
            ctx.arc(8, -this.height / 2, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }

    update() {
        this.x -= this.speed;
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    checkCollection(player, physics) {
        if (this.collected) return false;

        const giftRect = {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height
        };

        const hitboxWidth = player.hitboxWidth || player.width;
        const hitboxHeight = player.hitboxHeight || player.height;
        const hitboxOffsetX = player.hitboxOffsetX || 0;
        const hitboxOffsetY = player.hitboxOffsetY || 0;

        const playerRect = {
            x: player.x + hitboxOffsetX,
            y: player.y + hitboxOffsetY,
            width: hitboxWidth,
            height: hitboxHeight
        };

        if (physics.checkCollision(giftRect, playerRect)) {
            this.collected = true;
            return true;
        }
        return false;
    }
}

class CollectibleManager {
    constructor(canvas) {
        this.collectibles = [];
        this.canvas = canvas;
        this.spawnTimer = 0;
        this.spawnInterval = 100; // More frequent spawns (was 150)
        this.giftSpawnTimer = 0;
        this.giftSpawnInterval = 300; // Gifts spawn less frequently
    }

    reset() {
        this.collectibles = [];
        this.spawnTimer = 0;
        this.giftSpawnTimer = 0;
    }

    update(physics, player, followers, score) {
        this.spawnTimer++;
        this.giftSpawnTimer++;
        
        // Spawn new reindeer collectibles periodically (more frequently!)
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawn();
            this.spawnTimer = 0;
            
            // Much more frequent spawning
            this.spawnInterval = Math.max(60, 120 - Math.floor(score / 3));
        }

        // Spawn Christmas gifts periodically
        if (this.giftSpawnTimer >= this.giftSpawnInterval) {
            this.spawnGift();
            this.giftSpawnTimer = 0;
            
            // Gradually increase gift spawn rate
            this.giftSpawnInterval = Math.max(200, 300 - Math.floor(score / 5));
        }

        // Update existing collectibles
        this.collectibles.forEach(collectible => {
            collectible.update();
            
            // Check collection
            if (collectible.checkCollection(player, physics)) {
                if (collectible.type === 'gift') {
                    // Gift collected - return bonus points
                    return 'gift';
                } else {
                    // Add a new reindeer follower
                    const newFollower = new Follower(
                        player.x - followers.length * 50,
                        player.y,
                        followers.length
                    );
                    followers.push(newFollower);
                }
            }
        });

        // Remove off-screen collectibles
        this.collectibles = this.collectibles.filter(c => !c.isOffScreen() && !c.collected);
        
        // Return if gift was collected
        return this.collectibles.some(c => c.collected && c.type === 'gift');
    }

    spawn() {
        const x = this.canvas.width + 50;
        const y = Math.random() * (this.canvas.height - 200) + 100;
        this.collectibles.push(new Collectible(x, y));
    }

    spawnGift() {
        const x = this.canvas.width + 50;
        const y = Math.random() * (this.canvas.height - 200) + 100;
        this.collectibles.push(new Gift(x, y));
    }

    draw(ctx, reindeerImage, giftImage) {
        this.collectibles.forEach(collectible => {
            if (collectible.type === 'gift') {
                collectible.draw(ctx, giftImage);
            } else {
                collectible.draw(ctx, reindeerImage);
            }
        });
    }
}
