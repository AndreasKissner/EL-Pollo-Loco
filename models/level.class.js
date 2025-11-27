/**
 * Holds all game objects for a single level.
 */
class Level {

    enemies;
    clouds;
    platforms;
    backgroundObjects;
    coins;
    bottles;

    level_end_x = 4300;

    /**
     * Creates a new level with all object lists.
     * @param {Array} enemies
     * @param {Array} clouds
     * @param {Array} platforms
     * @param {Array} backgroundObjects
     * @param {Array} coins
     * @param {Array} bottles
     */
    constructor(enemies, clouds, platforms, backgroundObjects, coins, bottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.platforms = platforms;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}
