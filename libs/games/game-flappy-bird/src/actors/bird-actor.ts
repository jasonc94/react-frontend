import * as ex from 'excalibur';
export class Bird extends ex.Actor {
  constructor() {
    super({
      pos: ex.vec(200, 300),
      width: 16,
      height: 16,
      color: ex.Color.Yellow,
    });
  }
}
