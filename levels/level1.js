const level1 = new Level(
    [

        new Chicken(1000),
        new Chicken(1457),
        new Chicken(1914),
        new Chicken(2829),
        new Chicken(3743),
        new Chicken(4200),

        new MiniChicken(800),
        new MiniChicken(1257),
        new MiniChicken(1714),
        new MiniChicken(2629),
        new MiniChicken(3086),
        new MiniChicken(4000),

        new Endboss()
    ],


    [
        new Cloud()
    ],

    [
        new Platform(500, 280),
        new Platform(800, 220),
        new Platform(1300, 280),
        new Platform(2400, 280),
        new Platform(2700, 220),
        new Platform(3100, 200)
    ],

    [
        new BackgroundObject('img/5_background/layers/air.png', -719),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),

        new BackgroundObject('img/5_background/layers/air.png', 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),

        new BackgroundObject('img/5_background/layers/air.png', 719),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),

        new BackgroundObject('img/5_background/layers/air.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 2),

        new BackgroundObject('img/5_background/layers/air.png', 719 * 3),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719 * 3),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719 * 3),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719 * 3),

        new BackgroundObject('img/5_background/layers/air.png', 719 * 4),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 4),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 4),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 4),

        new BackgroundObject('img/5_background/layers/air.png', 719 * 5),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719 * 5),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719 * 5),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719 * 5),

        new BackgroundObject('img/5_background/layers/air.png', 719 * 6),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 6),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 6),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 6),
    ],

    [
        new Coin(430, 180),
        new Coin(510, 130),
        new Coin(600, 180),

        new Coin(1230, 180),
        new Coin(1370, 180),
        new Coin(1310, 110),

        new Coin(1800, 200),
        new Coin(1900, 150),
        new Coin(2000, 150),
        new Coin(2100, 200),

        new Coin(2635, 120),
        new Coin(2710, 90),
        new Coin(2770, 120),

        new Coin(3200, 50),
        new Coin(3300, 20),
        new Coin(3400, 50),
        new Coin(3500, 100),
    ],

    [
        new Bottle(800, 180),
        new Bottle(900, 180),

        new Bottle(1310, 240),
        new Bottle(1410, 240),

        new Bottle(1635, 100),
        new Bottle(1735, 100),

        new Bottle(2405, 230),
        new Bottle(2505, 230)
    ],

);
