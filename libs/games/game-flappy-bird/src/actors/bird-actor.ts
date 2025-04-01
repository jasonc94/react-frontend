import * as ex from 'excalibur';
import { Ground } from './ground-actor';
export class Bird extends ex.Actor {
  jumping = false;

  constructor() {
    super({
      pos: ex.vec(200, 300),
      width: 16,
      height: 16,
      color: ex.Color.Yellow,
    });
  }

  override onInitialize(): void {
    this.acc = ex.vec(0, 1200); // pixels per second per second
  }

  override onCollisionStart(_self: ex.Collider, other: ex.Collider): void {
    if (other.owner instanceof Ground) {
      this.stop();
    }
  }

  private isInputActive(engine: ex.Engine) {
    // space or click
    return (
      engine.input.keyboard.isHeld(ex.Keys.Space) ||
      engine.input.pointers.isDown(0)
    );
  }

  override onPostUpdate(engine: ex.Engine): void {
    if (!this.jumping && this.isInputActive(engine)) {
      this.vel.y += -800;
      this.jumping = true;
    }
    if (!this.isInputActive(engine)) {
      this.jumping = false;
    }

    // keep velocity from getting too big
    this.vel.y = ex.clamp(this.vel.y, -500, 500);

    // The "speed" the bird will move relative to pipes
    this.rotation = ex.vec(200, this.vel.y).toAngle();
  }

  start() {
    // later we'll use this to start our bird after game over
  }

  stop() {
    this.vel = ex.vec(0, 0);
    this.acc = ex.vec(0, 0);
  }
}
