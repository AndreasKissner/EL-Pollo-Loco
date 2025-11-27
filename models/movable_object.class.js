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

    /**
  * Generates an X-coordinate for spawning with minimum distance to others.
  * @param {number} maxPosition - Highest current enemy X position.
  * @param {Array} enemies - List of existing enemies to compare distance.
  * @returns {number} Valid new X-spawn position.
  */
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

    /**
     * Validates that new spawn is far enough from all enemies.
     * @param {Array} enemies - Enemies to compare against.
     * @param {number} newX - Generated spawn X position.
     * @param {number} minDistance - Required spacing threshold.
     * @returns {boolean}
     */
    isValidSpawnPosition(enemies, newX, minDistance) {
        let valid = true;
        enemies.forEach(other => {
            if (this.isTooClose(other, newX, minDistance)) {
                valid = false;
            }
        });
        return valid;
    }

    /**
     * Checks whether new enemy spawns too close to another.
     * @param {Object} other - Enemy to compare against.
     * @param {number} newX - Spawn X position being tested.
     * @param {number} minDistance - Required spacing.
     * @returns {boolean}
     */
    isTooClose(other, newX, minDistance) {
        if (other === this || other instanceof Endboss) {
            return false;
        }
        return (
            newX < other.x + other.width + minDistance &&
            newX + this.width > other.x - minDistance
        );
    }

    /**
     * Iterates through enemies and checks collision with character.
     * @param {Array} enemies - All enemies currently active.
     * @param {Object} statusBar - Status UI for damage updates.
     */
    checkEnemyCollisions(enemies, statusBar) {
        enemies.forEach(enemy => {
            this.handleEnemyCollision(enemy, statusBar);
        });
    }

    /**
     * Handles collision reaction depending on enemy type & interaction.
     * @param {Object} enemy - The enemy being collided with.
     * @param {Object} statusBar - UI reference for applying hit effects.
     */
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
    /**
     * Handles damage taken from Endboss and updates status bar.
     * @param {Object} statusBar - UI energy display element.
     */
    handleEndbossHits(statusBar) {
        this.hit();
        statusBar.setPercentage(this.energy);
    }

    /**
     * Checks if character is falling downward onto an enemy.
     * @returns {boolean}
     */
    isStompingEnemy() {
        return (
            this.isAboveGround() &&
            this.speedY < 0 &&
            !this.hitBlocked
        );
    }

    /**
     * Executes stomp kill: mini chickens different sound.
     * @param {Object} enemy - Enemy being stomped.
     */
    handleStompOnEnemy(enemy) {
        if (enemy instanceof MiniChicken) {
            SoundManager.play("miniChicken", 1.4);
        } else {
            SoundManager.play("chickKill", 1);
        }

        enemy.energy = 0;
        this.speedY = 15;
    }

    /**
     * Standard enemy collision: reduce health & update HUD.
     * @param {Object} statusBar - Represents health UI.
     */
    handleEnemyHits(statusBar) {
        this.hit();
        statusBar.setPercentage(this.energy);
    }

    /**
     * Checks collision with coins and triggers collection.
     * @param {Array} coins
     * @param {Object} statusBarCoins
     * @param {Object} statusBarBottle
     * @param {Array} floatingTexts
     */
    checkCoinCollisions(coins, statusBarCoins, statusBarBottle, floatingTexts) {
        coins.forEach((coin, index) => {
            if (this.isColliding(coin)) {
                this.collectCoin(
                    index,
                    coins,
                    statusBarCoins,
                    statusBarBottle,
                    floatingTexts
                );
            }
        });
    }

    /**
     * Collects coin, updates UI and checks for bottle bonus.
     * @param {number} index
     * @param {Array} coins
     * @param {Object} statusBarCoins
     * @param {Object} statusBarBottle
     * @param {Array} floatingTexts
     */
    collectCoin(index, coins, statusBarCoins, statusBarBottle, floatingTexts) {
        SoundManager.play("coinSelect", 0.3);
        coins.splice(index, 1);
        this.coins++;
        statusBarCoins.percentage++;
        statusBarCoins.setPercentage(statusBarCoins.percentage);
        if (statusBarCoins.percentage >= 5) {
            this.handleCoinBonus(statusBarCoins, statusBarBottle, floatingTexts);
        }
    }

    /**
     * Converts 5 coins into 1 bottle; resets coin bar.
     * @param {Object} statusBarCoins
     * @param {Object} statusBarBottle
     * @param {Array} floatingTexts
     */
    handleCoinBonus(statusBarCoins, statusBarBottle, floatingTexts) {
        statusBarCoins.percentage = 0;
        statusBarCoins.setPercentage(0);
        if (this.bottles < 10) {
            this.grantExtraBottle(statusBarBottle, floatingTexts);
        }
        statusBarBottle.setPercentage(this.bottles);
    }

    /**
     * Adds bottle from coin bonus + visual floating text.
     * @param {Object} statusBarBottle
     * @param {Array} floatingTexts
     */
    grantExtraBottle(statusBarBottle, floatingTexts) {
        SoundManager.play("extraBottle", 0.4);
        floatingTexts.push(
            new FloatingText(this.x + 250, this.y + 200)
        );
        this.bottles++;
        statusBarBottle.setPercentage(this.bottles);
    }

    /**
     * Detects bottle pickup from ground.
     * @param {Array} bottles
     * @param {Object} statusBarBottle
     */
    checkGroundBottleCollisions(bottles, statusBarBottle) {
        bottles.forEach((bottle, index) => {
            if (this.isColliding(bottle)) {
                this.collectGroundBottle(index, bottles, statusBarBottle);
            }
        });
    }

    /**
     * Collects bottle from ground if below max (10).
     * @param {number} index
     * @param {Array} bottles
     * @param {Object} statusBarBottle
     */
    collectGroundBottle(index, bottles, statusBarBottle) {
        if (this.bottles >= 10) {
            return;
        }
        SoundManager.play("bottleCollect", 0.4);
        this.bottles++;
        bottles.splice(index, 1);
        statusBarBottle.setPercentage(this.bottles);
    }
}
