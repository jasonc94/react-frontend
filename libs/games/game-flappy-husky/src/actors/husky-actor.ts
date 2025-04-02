import * as ex from 'excalibur';
import { Ground } from './ground-actor';
import { Pipe } from './pipe-actor';
import { Config } from '../configs/flappy-bird-config';
import { Level } from '../scenes/level';
import { Resources } from '../assets/resources';
export class Husky extends ex.Actor {
  playing = false;
  jumping = false;
  startSprite!: ex.Sprite;

  upAnimation!: ex.Animation;
  downAnimation!: ex.Animation;

  constructor(private level: Level) {
    super({
      pos: Config.BirdStartPos,
      radius: 8,
      color: ex.Color.Yellow,
    });
  }

  override onInitialize(): void {
    this.scale.x = -1;
    const spriteSheet = ex.SpriteSheet.fromImageSource({
      image: Resources.huskyImage,
      grid: {
        rows: 1,
        columns: 5,
        spriteWidth: 60,
        spriteHeight: 38,
      },
    });
    this.startSprite = spriteSheet.getSprite(1, 0);

    this.upAnimation = ex.Animation.fromSpriteSheet(
      spriteSheet,
      [0, 1, 2, 3, 4], // 3rd frame, then 2nd, then first
      150, // 150ms for each frame
      ex.AnimationStrategy.Loop
    );
    // Animation to play going down
    this.downAnimation = ex.Animation.fromSpriteSheet(
      spriteSheet,
      [0, 1, 2],
      150,
      ex.AnimationStrategy.Freeze
    );

    this.graphics.add('down', this.downAnimation);
    this.graphics.add('up', this.upAnimation);
    this.graphics.add('start', this.startSprite);
    this.graphics.use('up');

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
      Resources.FlapSound.play();
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
    this.rotation = ex
      .vec(Config.PipeSpeed, this.vel.y > 0 ? -100 : 100)
      .toAngle();
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
