// Physics Engine for Santa Rush

class Physics {
    constructor() {
        this.gravity = 0.25; // Reduced for slower falling
        this.thrust = -0.5; // Jetpack thrust when holding
        this.maxVelocityUp = -7;
        this.maxVelocityDown = 8; // Lower max fall speed
        this.friction = 0.95;
    }

    applyGravity(entity) {
        entity.velocityY += this.gravity;
        
        // Cap velocity
        if (entity.velocityY > this.maxVelocityDown) {
            entity.velocityY = this.maxVelocityDown;
        }
        
        entity.y += entity.velocityY;
    }

    applyThrust(entity) {
        entity.velocityY += this.thrust;
        
        // Cap upward velocity
        if (entity.velocityY < this.maxVelocityUp) {
            entity.velocityY = this.maxVelocityUp;
        }
    }

    jump(entity) {
        // Legacy method for compatibility
        entity.velocityY = -9;
    }

    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    checkCircleCollision(circle1, circle2) {
        const dx = circle1.x - circle2.x;
        const dy = circle1.y - circle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < circle1.radius + circle2.radius;
    }

    checkBounds(entity, canvas) {
        // Check top boundary
        if (entity.y < 0) {
            entity.y = 0;
            entity.velocityY = 0;
        }
        
        // Check bottom boundary
        if (entity.y + entity.height > canvas.height) {
            entity.y = canvas.height - entity.height;
            entity.velocityY = 0;
            return true; // Hit ground
        }
        
        return false;
    }
}
