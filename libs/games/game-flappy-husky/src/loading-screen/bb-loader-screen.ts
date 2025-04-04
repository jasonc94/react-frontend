import * as ex from 'excalibur';
import { Resources } from '../assets/resources';

export class BBLoaderScreen extends ex.Loader {
  private angle = 0; // Rotation angle
  private spinner!: ex.Sprite;

  override onDraw(ctx: CanvasRenderingContext2D) {
    this.spinner = ex.Sprite.from(Resources.huskySitImage);
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    // Clear the screen
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw background
    ctx.fillStyle = '#54C0CA';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    if (this.spinner) {
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2 - 30;
      const spriteSize = 50;

      ctx.save();

      ctx.translate(centerX, centerY);
      ctx.rotate(this.angle);
      ctx.scale(-1, 1);
      const image = this.spinner.image.image;
      ctx.drawImage(
        image,
        -spriteSize / 2,
        -spriteSize / 2,
        spriteSize,
        spriteSize
      );

      ctx.restore();

      this.angle += 0.05;
    }

    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      "Loading BB's adventure...",
      canvasWidth / 2,
      canvasHeight / 2 + 80
    );
  }
}
