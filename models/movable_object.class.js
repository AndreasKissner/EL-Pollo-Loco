class MovableObject extends DrawableObject {

    img;
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    speedX = 0;
    acceleration = 2.5;
    energy = 100; // Standardenergie
    lastHit = 0;
    hitBlocked = false;
    groundLevel = 190;

    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };


    applyGravity() {
        setInterval(() => {
            if (this.isFalling === false) {
                return;
            }
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
            if (!(this instanceof ThrowableObject) && (this.y + this.height) > this.groundLevel) {
                this.y = this.groundLevel - this.height;
                this.speedY = 0;
            }
        }, 1000 / 25);
    }


    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return (this.y + this.height) < this.groundLevel;
        }
    }

    isColliding(mo) {
        return (
            this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
        );
    }

    // movable-object.class.js

    // movable-object.class.js
    // ...
    hit() {
        if (this.hitBlocked) return;
        this.energy -= 20; // 20 Schaden pro Treffer

        if (this.energy < 0) {
            this.energy = 0;
        }

        // ✅ KORRIGIERTE LOGIK: Sounds nur abspielen, wenn NICHT gemutet
        if (!SoundManager.isMuted) {
            if (this instanceof Endboss) {
                SoundManager.play('hurtEndboss', 0.6);
            } else {
                SoundManager.play('hurtPepe', 1);
            }
        }

        // Die Zeilen für den Rückstoß/Kickback sind hier:
        this.lastHit = new Date().getTime();
        this.hitOutTime(); // <--- DIESE FUNKTION LÖST DEN SPRUNG AUS
    }
    // ...

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    isDead() {
        return this.energy == 0;
    }


    playAnimation(images) {
        if (!images || images.length === 0) return;
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    jump() {
        this.speedY = 25;
    }

    hitOutTime() {
        if (this.hitBlocked) return;
        this.hitBlocked = true;

        const jumpStrength = 6;
        const knockback = 1;

        if (this.otherDirection) {
            this.speedX = knockback;
        } else {
            this.speedX = -knockback;
        }

        this.speedY = jumpStrength;

        setTimeout(() => {
            this.hitBlocked = false;
            this.speedX = 0;
        }, 1300);
    }
}