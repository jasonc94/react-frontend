import * as ex from 'excalibur';
import huskyImage from './images/dog_medium_run.png';
import birdImage from './images/bird.png';
import pipeImage from './images/pipe.png';
import groundImage from './images/ground.png';

import flapSound from './sounds/flap.wav';
import failSound from './sounds/fail.wav';
import scoreSound from './sounds/score.wav';
import backgroundMusic from './sounds/two_left_socks.ogg';

export const Resources = {
  huskyImage: new ex.ImageSource(huskyImage),
  BirdImage: new ex.ImageSource(birdImage),
  PipeImage: new ex.ImageSource(pipeImage, {
    wrapping: ex.ImageWrapping.Clamp,
  }),
  GroundImage: new ex.ImageSource(groundImage, {
    wrapping: ex.ImageWrapping.Repeat,
  }),

  // Sounds
  FailSound: new ex.Sound(failSound),
  FlapSound: new ex.Sound(flapSound),
  ScoreSound: new ex.Sound(scoreSound),
  // Music
  BackgroundMusic: new ex.Sound(backgroundMusic),
} as const;
