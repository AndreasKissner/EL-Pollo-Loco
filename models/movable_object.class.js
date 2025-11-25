class MovableObject extends DrawableObject {

    img;
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    speedX = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    hitBlocked = false;
    groundLevel = 190;

    offset = { top: 0, left: 0, right: 0, bottom: 0 };

    /**
     * Applies gravity on every frame.
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.applyGravityMovement();
            }
            this.preventGroundPenetration();
        }, 1000 / 25);
    }

    /**
     * Vertical movement when jumping/falling.
     */
    applyGravityMovement() {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
    }

    /**
     * Prevents sinking below ground level.
     */
    preventGroundPenetration() {
        const bottom = this.y + this.height;
        if (!(this instanceof ThrowableObject) && bottom > this.groundLevel) {
            this.y = this.groundLevel - this.height;
            this.speedY = 0;
        }
    }

    /**
     * Returns true if above the ground level.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) return true;
        return (this.y + this.height) < this.groundLevel;
    }

    /**
     * Checks if this object collides with another movable object.
     * @param {MovableObject} mo - The other object to check against.
     * @returns {boolean} True if a collision is detected.
     */
    isColliding(mo) {
        return (
            this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
        );
    }

    /**
     * Applies damage to the object and triggers knockback.
     */
    hit() {
        if (this.hitBlocked) return;
        this.energy -= 20;
        if (this.energy < 0) this.energy = 0;
        if (!SoundManager.isMuted) {
            if (this instanceof Endboss) {
                SoundManager.play('hurtEndboss', 0.6);
            } else {
                SoundManager.play('hurtPepe', 1);
            }
        }
        this.lastHit = Date.now();
        this.hitOutTime();
    }

    /**
    * Returns true if the object was hit within the last second.
    */
    isHurt() {
        return (Date.now() - this.lastHit) / 1000 < 1;
    }

    /**
     * Returns true if the object's energy has reached zero.
     */
    isDead() {
        return this.energy === 0;
    }

    /**
     * Plays animation frames from an image array.
     * @param {string[]} images
     */
    playAnimation(images) {
        if (!images || images.length === 0) return;
        let i = this.currentImage % images.length;
        this.img = this.imageCache[images[i]];
        this.currentImage++;
    }

    /**
     * Moves the object to the right.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Makes the object jump upward.
     */
    jump() {
        this.speedY = 25;
    }

    /**
  * Applies knockback and a short jump after the object is hit.
  */
    hitOutTime() {
        if (this.hitBlocked) return;
        this.hitBlocked = true;
        const jumpStrength = 6;
        const knockback = this.otherDirection ? 1 : -1;
        this.speedX = knockback;
        this.speedY = jumpStrength;
        setTimeout(() => {
            this.hitBlocked = false;
            this.speedX = 0;
        }, 1300);
    }

    static handleSingleCharacterEnemyCollision(character, enemy, statusBar) {
        if (enemy.isDead() || !character.isColliding(enemy)) {
            return;
        }
        if (enemy instanceof Endboss) {
            MovableObject.characterHitByEndboss(character, statusBar);
            return;
        }
        if (character.isAboveGround() && character.speedY < 0 && !character.hitBlocked) {
            MovableObject.characterStompsEnemy(character, enemy);
        } else {
            MovableObject.enemyHitsCharacter(character, statusBar);
        }
    }

    static characterHitByEndboss(character, statusBar) {
        character.hit();
        statusBar.setPercentage(character.energy);
    }

    static characterStompsEnemy(character, enemy) {
        SoundManager.play("chickKill", 1);
        enemy.energy = 0;
        character.speedY = 15;
    }

    static enemyHitsCharacter(character, statusBar) {
        character.hit();
        statusBar.setPercentage(character.energy);
    }

    generateMinimumDistanceX(maxPosition, enemies) {
    const MIN_DISTANCE = 200;
    let newX;
    let valid = false;
    while (!valid) {
        newX = maxPosition + 300 + Math.random() * 500;
        valid = this.isValidSpawnPosition(enemies, newX, MIN_DISTANCE);
    }
    return newX;
}

isValidSpawnPosition(enemies, newX, minDistance) {
    let valid = true;
    enemies.forEach(other => {
        if (this.isTooClose(other, newX, minDistance)) {
            valid = false;
        }
    });
    return valid;
}

isTooClose(other, newX, minDistance) {
    if (other === this || other instanceof Endboss) {
        return false;
    }
    return (
        newX < other.x + other.width + minDistance &&
        newX + this.width > other.x - minDistance
    );
}

checkEnemyCollisions(enemies, statusBar) {
    enemies.forEach(enemy => {
        this.handleEnemyCollision(enemy, statusBar);
    });
}

handleEnemyCollision(enemy, statusBar) {
    if (enemy.isDead() || !this.isColliding(enemy)) {
        return;
    }
    if (enemy instanceof Endboss) {
        this.handleEndbossHits(statusBar);
        return;
    }
    if (this.isStompingEnemy()) {
        this.handleStompOnEnemy(enemy);
    } else {
        this.handleEnemyHits(statusBar);
    }
}

handleEndbossHits(statusBar) {
    this.hit();
    statusBar.setPercentage(this.energy);
}

isStompingEnemy() {
    return (
        this.isAboveGround() &&
        this.speedY < 0 &&
        !this.hitBlocked
    );
}

handleStompOnEnemy(enemy) {
    SoundManager.play("chickKill", 1);
    enemy.energy = 0;
    this.speedY = 15;
}

handleEnemyHits(statusBar) {
    this.hit();
    statusBar.setPercentage(this.energy);
}

}
