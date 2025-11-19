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

    hit() {
        if (this.hitBlocked) return;
        this.energy -= 20; // 20 Schaden pro Treffer

        if (this.energy < 0) {
            this.energy = 0;
        }

        // 🔥 KORREKTUR: hitOutTime() WIRD IMMER bei Treffer aufgerufen, 
        // auch wenn Energie auf 0 fällt. Dadurch macht Pepe den finalen Sprung/Rückstoß.
        this.lastHit = new Date().getTime();
        this.hitOutTime();
        
        // Wichtig: Jetzt muss in der Character-Klasse der Todes-Loop die isHurt()-Animation überschreiben!
        // Das ist aber in der Endboss-Logik (höchste Priorität) schon erledigt.
    }

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
        this.speedY = 30;
    }

    hitOutTime() {
        if (this.hitBlocked) return;
        this.hitBlocked = true;

        const jumpStrength = 10;
        const knockback = 2;

        if (this.otherDirection) {
            this.speedX = knockback;
        } else {
            this.speedX = -knockback;
        }

        this.speedY = jumpStrength;

        setTimeout(() => {
            this.hitBlocked = false;
            this.speedX = 0;
        }, 1000);
    }
}