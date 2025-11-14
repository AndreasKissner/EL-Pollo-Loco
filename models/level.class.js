class Level {
    enemies;
    clouds;
    platforms;
    backgroundObjects;
    coins;
    bottles;   // ✨ Array, auch wenn nur eine Flasche drin ist

    level_end_x = 4300;

    constructor(enemies, clouds, platforms, backgroundObjects, coins, bottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.platforms = platforms;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;   // Übergabe
    }
}
