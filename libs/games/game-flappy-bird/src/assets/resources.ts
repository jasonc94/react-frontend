import * as ex from 'excalibur';
import birdImage from './images/bird.png';
import pipeImage from './images/pipe.png';
import groundImage from './images/ground.png';

export const Resources = {
  BirdImage: new ex.ImageSource(birdImage),
  PipeImage: new ex.ImageSource(pipeImage, {
    wrapping: ex.ImageWrapping.Clamp,
  }),
  GroundImage: new ex.ImageSource(groundImage, {
    wrapping: ex.ImageWrapping.Repeat,
  }),
} as const;
