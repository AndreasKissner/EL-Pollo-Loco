/** Represents a moving background cloud. */
class Cloud extends MovableObject {
  y = 20;
  width = 500;
  height = 250;

  /** Initializes the cloud, loads its image, and sets a random start position. */
  constructor() {
    super().loadImage('img/5_background/layers/4_clouds/1.png')
    this.x = Math.random() * 400
    this.animate();
  }

  /** Starts the cloud's movement animation. */
  animate() {
    this.moveLeft();
  }
}