// Player class for Santa Rush

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 80;
        // Hitbox is smaller than visual size for better gameplay
        this.hitboxWidth = 50;
        this.hitboxHeight = 50;
        this.hitboxOffsetX = 15;
        this.hitboxOffsetY = 15;
        this.velocityY = 0;
        this.rotation = 0;
        this.color = '#FF0000';
        this.alive = true;
        this.isBoosting = false;
    }

    draw(ctx, santaImage) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        
        // Rotate based on velocity (jetpack style - less rotation)
        this.rotation = Math.min(Math.max(this.velocityY * 1.5, -20), 60);
        ctx.rotate(this.rotation * Math.PI / 180);
        
        // Try to draw santa image, fallback to drawn santa
        if (santaImage && santaImage.complete && santaImage.naturalHeight !== 0) {
            ctx.drawImage(santaImage, -this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            // Fallback: Draw player character (simple santa)
            // Body
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height * 0.7);
            
            // Head
            ctx.fillStyle = '#FFD4A3';
            ctx.beginPath();
            ctx.arc(0, -this.height / 2, this.width / 2.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Hat
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.arc(0, -this.height / 2, this.width / 2.5, Math.PI, Math.PI * 2);
            ctx.fill();
            
            // Eyes
            ctx.fillStyle = '#000000';
            ctx.fillRect(-8, -this.height / 2 - 2, 4, 4);
            ctx.fillRect(4, -this.height / 2 - 2, 4, 4);
        }
        
        ctx.restore();
    }

    update(physics, canvas) {
        // Apply thrust if boosting, otherwise gravity
        if (this.isBoosting) {
            physics.applyThrust(this);
        }
        physics.applyGravity(this);
        
        // Check if hit ground or ceiling
        if (physics.checkBounds(this, canvas)) {
            this.alive = false;
        }
        
        if (this.y < 0) {
            this.alive = false;
        }
    }

    jump(physics) {
        physics.jump(this);
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocityY = 0;
        this.rotation = 0;
        this.alive = true;
    }
}

// Follower class (collected zombies/characters)
class Follower {
    constructor(x, y, index) {
        this.x = x;
        this.y = y;
        this.width = 80; // Match player size for better lineup
        this.height = 80;
        // Hitbox is smaller than visual size for better gameplay
        this.hitboxWidth = 50;
        this.hitboxHeight = 50;
        this.hitboxOffsetX = 15;
        this.hitboxOffsetY = 15;
        this.index = index;
        this.targetX = x;
        this.targetY = y;
        this.color = this.getRandomColor();
    }

    getRandomColor() {
        const colors = ['#9C27B0', '#E91E63', '#FF9800', '#4CAF50', '#2196F3', '#00BCD4'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    draw(ctx, reindeerImage) {
        ctx.save();
        
        // Try to draw reindeer image, fallback to drawn reindeer
        if (reindeerImage && reindeerImage.complete && reindeerImage.naturalHeight !== 0) {
            ctx.drawImage(reindeerImage, this.x, this.y, this.width, this.height);
        } else {
            // Fallback: Draw reindeer body
            ctx.fillStyle = '#8B4513'; // Brown
            ctx.fillRect(this.x, this.y, this.width, this.height * 0.7);
            
            // Head
            ctx.fillStyle = '#A0522D';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 3, this.width / 2.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Antlers
            ctx.strokeStyle = '#654321';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x + 8, this.y + 5);
            ctx.lineTo(this.x + 5, this.y - 5);
            ctx.moveTo(this.x + this.width - 8, this.y + 5);
            ctx.lineTo(this.x + this.width - 5, this.y - 5);
            ctx.stroke();
            
            // Eyes
            ctx.fillStyle = '#000000';
            ctx.fillRect(this.x + 10, this.y + 10, 3, 3);
            ctx.fillRect(this.x + this.width - 13, this.y + 10, 3, 3);
            
            // Red nose
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 3 + 5, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }

    update(leader) {
        // Follow the leader horizontally (Zombie Tsunami style)
        const smoothing = 0.2;
        // Line up IN FRONT of immediate leader horizontally with overlap so spacing is constant
        const gap = 48; // overlap amount in pixels (higher = more overlap)
        // Anchor to the immediate leader's right edge so each follower stays a constant distance from the one before it
        this.targetX = leader.x + leader.width - gap;
        // Match leader's Y position closely for horizontal lineup
        this.targetY = leader.y;
        
        this.x += (this.targetX - this.x) * smoothing;
        this.y += (this.targetY - this.y) * smoothing;
    }
}
