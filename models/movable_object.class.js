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
  * Generates a new X-position with minimum spacing to others.
  * @param {number} maxPosition - Current furthest spawn point.
  * @param {Array} enemies - Existing enemies to distance from.
  */
    generateMinimumDistanceX(maxPosition, enemies) {
        const MIN_DISTANCE = 200;
        let newX, valid = false;
        while (!valid) {
            newX = maxPosition + 300 + Math.random() * 500;
            valid = this.isValidSpawnPosition(enemies, newX, MIN_DISTANCE);
        }
        return newX;
    }

    /**
     * Returns true if newX has enough distance to all enemies.
     * @param {Array} enemies - Array of active enemies.
     * @param {number} newX - Proposed spawn coordinate.
     * @param {number} minDistance - Required spacing in px.
     */
    isValidSpawnPosition(enemies, newX, minDistance) {
        let valid = true;
        enemies.forEach(other => {
            if (this.isTooClose(other, newX, minDistance)) valid = false;
        });
        return valid;
    }

    /**
     * Checks if spawn would overlap or spawn too close.
     * @param {Object} other - Another enemy instance.
     * @param {number} newX - New X-position candidate.
     * @param {number} minDistance - Minimum allowed gap.
     */
    isTooClose(other, newX, minDistance) {
        if (other === this || other instanceof Endboss) return false;
        return (
            newX < other.x + other.width + minDistance &&
            newX + this.width > other.x - minDistance
        );
    }

    /**
     * Loops through enemies and triggers collision handling.
     * @param {Array} enemies - Enemy array to evaluate.
     * @param {Object} statusBar - UI bar for health updates.
     */
    checkEnemyCollisions(enemies, statusBar) {
        enemies.forEach(enemy => this.handleEnemyCollision(enemy, statusBar));
    }

    /**
   * Handles collision outcome with a specific enemy.
   * @param {Object} enemy - Enemy instance to evaluate.
   * @param {Object} statusBar - HP UI to update on damage.
   */
    handleEnemyCollision(enemy, statusBar) {
        if (enemy.isDead() || !this.isColliding(enemy)) return;
        if (enemy instanceof Endboss) {
            this.handleEndbossHits(statusBar);
            return;
        }
        if (this.isStompingEnemy()) this.handleStompOnEnemy(enemy);
        else this.handleEnemyHits(statusBar);
    }

    /**
     * Applies damage taken from endboss and updates health bar.
     * @param {Object} statusBar - Status UI for energy display.
     */
    handleEndbossHits(statusBar) {
        this.hit();
        statusBar.setPercentage(this.energy);
    }

    /**
     * Checks if character is falling onto enemy from above.
     * @returns {boolean} True when downward stomp is valid.
     */
    isStompingEnemy() {
        return (
            this.isAboveGround() &&
            this.speedY < 0 &&
            !this.hitBlocked
        );
    }

    /**
     * Kills enemy via stomp — plays sound depending on type.
     * @param {Object} enemy - Target enemy being stomped.
     */
    handleStompOnEnemy(enemy) {
        if (enemy instanceof MiniChicken) SoundManager.play("miniChicken", 1.4);
        else SoundManager.play("chickKill", 1);

        enemy.energy = 0;
        this.speedY = 15;
    }

    /**
     * Character receives damage and updates health UI.
     * @param {Object} statusBar - Status bar showing HP.
     */
    handleEnemyHits(statusBar) {
        this.hit();
        statusBar.setPercentage(this.energy);
    }

    /**
     * Checks coin collisions and forwards collected ones.
     * @param {Array} coins - Coin objects on map.
     * @param {Object} statusBarCoins - UI bar for coin count.
     * @param {Object} statusBarBottle - UI bar for bottles.
     * @param {Array} floatingTexts - Text list for pickups.
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
 * Collects a coin and triggers bonus if threshold reached.
 * @param {number} index - Coin index to remove.
 * @param {Array} coins - List of active coin objects.
 * @param {Object} statusBarCoins - UI tracking coin amount.
 * @param {Object} statusBarBottle - UI tracking bottle count.
 * @param {Array} floatingTexts - List of floating text objects.
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
     * Resets coin bar and awards bottle if possible.
     * @param {Object} statusBarCoins - UI for coin progress.
     * @param {Object} statusBarBottle - Bottle progress bar.
     * @param {Array} floatingTexts - List for reward popup text.
     */
    handleCoinBonus(statusBarCoins, statusBarBottle, floatingTexts) {
        statusBarCoins.percentage = 0;
        statusBarCoins.setPercentage(0);
        if (this.bottles < 10) this.grantExtraBottle(statusBarBottle, floatingTexts);
        statusBarBottle.setPercentage(this.bottles);
    }

    /**
     * Grants bottle reward + text indicator.
     * @param {Object} statusBarBottle - Bottle UI display.
     * @param {Array} floatingTexts - Reward popup container.
     */
    grantExtraBottle(statusBarBottle, floatingTexts) {
        SoundManager.play("extraBottle", 0.4);
        floatingTexts.push(new FloatingText(this.x + 250, this.y + 200));
        this.bottles++;
        statusBarBottle.setPercentage(this.bottles);
    }

    /**
     * Checks if player touches bottle on ground.
     * @param {Array} bottles - Bottle objects in world.
     * @param {Object} statusBarBottle - UI showing bottle count.
     */
    checkGroundBottleCollisions(bottles, statusBarBottle) {
        bottles.forEach((bottle, index) => {
            if (this.isColliding(bottle)) {
                this.collectGroundBottle(index, bottles, statusBarBottle);
            }
        });
    }

    /**
     * Collects bottle if storage not full.
     * @param {number} index - Bottle index to remove.
     * @param {Array} bottles - Bottle objects in level.
     * @param {Object} statusBarBottle - UI percentage display.
     */
    collectGroundBottle(index, bottles, statusBarBottle) {
        if (this.bottles >= 10) return;
        SoundManager.play("bottleCollect", 0.4);
        this.bottles++;
        bottles.splice(index, 1);
        statusBarBottle.setPercentage(this.bottles);
    }
}
