import * as ex from 'excalibur';
import { Ground } from './ground-actor';
import { Pipe } from './pipe-actor';
import { Config } from '../configs/flappy-bird-config';
import { Level } from '../scenes/level';
export class Bird extends ex.Actor {
  playing = false;
  jumping = false;

  constructor(private level: Level) {
    super({
      pos: Config.BirdStartPos,
      radius: 8,
      color: ex.Color.Yellow,
    });
  }

  override onInitialize(): void {
    // this.acc = ex.vec(0, Config.BirdAcceleration); // pixels per second per second
    this.on('exitviewport', () => {
      this.level.triggerGameOver();
    });
  }

  override onCollisionStart(_self: ex.Collider, other: ex.Collider): void {
    if (other.owner instanceof Ground || other.owner instanceof Pipe) {
      this.level.triggerGameOver();
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
    if (!this.playing) return;
    if (!this.jumping && this.isInputActive(engine)) {
      this.vel.y += Config.BirdJumpVelocity;
      this.jumping = true;
    }
    if (!this.isInputActive(engine)) {
      this.jumping = false;
    }

    // keep velocity from getting too big
    this.vel.y = ex.clamp(
      this.vel.y,
      Config.BirdMinVelocity,
      Config.BirdMaxVelocity
    );

    // The "speed" the bird will move relative to pipes
    this.rotation = ex.vec(Config.PipeSpeed, this.vel.y).toAngle();
  }

  start() {
    this.playing = true;
    this.pos = Config.BirdStartPos;
    this.acc = ex.vec(0, Config.BirdAcceleration);
  }

  stop() {
    this.playing = false;
    this.vel = ex.vec(0, 0);
    this.acc = ex.vec(0, 0);
  }

  reset() {
    this.pos = Config.BirdStartPos;
    this.stop();
  }
}
