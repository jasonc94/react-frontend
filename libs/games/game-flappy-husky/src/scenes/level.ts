import * as ex from 'excalibur';
import { Husky } from '../actors/husky-actor';
import { Ground } from '../actors/ground-actor';
import { Pipe } from '../actors/pipe-actor';
import { useFlappyHuskyStore } from '../stores/flappy-husky-store';
import { PipeFactory } from '../util/pipe-factory';
import { Config } from '../configs/flappy-bird-config';
import { Resources } from '../assets/resources';

export class Level extends ex.Scene {
  random = new ex.Random();
  pipeFactory = new PipeFactory(this, this.random, Config.PipeInterval);
  score = 0;
  best = 0;
  husky = new Husky(this);
  ground!: Ground;

  scoreLabel = new ex.Label({
    text: 'Score: 0',
    x: 0,
    y: 0,
    z: 1,
    font: new ex.Font({
      size: 20,
      color: ex.Color.White,
    }),
  });

  bestLabel = new ex.Label({
    text: 'Best: 0',
    x: 400,
    y: 0,
    z: 1,
    font: new ex.Font({
      size: 20,
      color: ex.Color.White,
      textAlign: ex.TextAlign.End,
    }),
  });

  startGameLabel = new ex.Label({
    text: 'Tap to Start',
    x: 200,
    y: 200,
    z: 2,
    font: new ex.Font({
      size: 30,
      color: ex.Color.White,
      textAlign: ex.TextAlign.Center,
    }),
  });

  showStartInstructions() {
    this.startGameLabel.graphics.isVisible = true;
    this.engine.input.pointers.once('down', () => {
      this.reset();
      this.startGameLabel.graphics.isVisible = false;
      this.husky.start();
      this.pipeFactory.start();
      this.ground.start();
    });
  }

  override onActivate(): void {
    this.playBackgroundMusic();
  }

  override onInitialize(engine: ex.Engine): void {
    const addActor = useFlappyHuskyStore.getState().addActor;
    addActor(this.husky);
    this.ground = new Ground(ex.vec(0, engine.screen.drawHeight - 64));
    addActor(this.ground);

    // this.pipeFactory.start();
    this.add(this.startGameLabel);
    this.add(this.scoreLabel);
    this.add(this.bestLabel);

    const bestScore = localStorage.getItem('bestScore');
    if (bestScore) {
      this.best = +bestScore;
      this.setBestScore(this.best);
    } else {
      this.setBestScore(0);
    }

    this.showStartInstructions();
  }

  incrementScore() {
    this.scoreLabel.text = `Score: ${++this.score}`;
    this.setBestScore(this.score);
  }

  setBestScore(score: number) {
    if (score > this.best) {
      localStorage.setItem('bestScore', this.score.toString());
      this.best = score;
    }
    this.bestLabel.text = `Best: ${this.best}`;
  }

  reset() {
    this.husky.reset();
    this.pipeFactory.reset();
    this.score = 0;
    this.scoreLabel.text = `Score: ${this.score}`;
  }

  triggerGameOver() {
    this.pipeFactory.stop();
    this.husky.stop();
    this.ground.stop();
    this.showStartInstructions();
    Resources.FailSound.play();
  }

  playBackgroundMusic() {
    const backgroundPlaying = Resources.BackgroundMusic.isPlaying();
    console.log('backgroundPlaying', backgroundPlaying);
    if (!backgroundPlaying) {
      Resources.BackgroundMusic.loop = true;
      Resources.BackgroundMusic.play();
    }
  }
}
