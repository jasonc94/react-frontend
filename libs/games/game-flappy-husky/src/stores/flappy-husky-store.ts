import * as ex from 'excalibur';
import { create } from 'zustand';
import { Level } from '../scenes/level';
import { Resources } from '../assets/resources';
import { BBLoaderScreen } from '../configs/bb-loader-screen';

type FlappyHuskyGameState = {
  gameEngine: ex.Engine | null;
  gameOver: boolean;
};

type FlappyHuskyStateActions = {
  initGame: (canvas: HTMLCanvasElement) => void;
  startGame: () => Promise<void>;
  addActor: (actor: ex.Actor) => void;
  exitGame: () => void;
};

const initialFlappyBirdGameState: FlappyHuskyGameState = {
  gameEngine: null,
  gameOver: false,
};

export const useFlappyHuskyStore = create<
  FlappyHuskyGameState & FlappyHuskyStateActions
>((set, get) => {
  return {
    ...initialFlappyBirdGameState,
    initGame: (canvas: HTMLCanvasElement) => {
      const game = new ex.Engine({
        width: 400,
        height: 600,
        backgroundColor: ex.Color.fromHex('#54C0CA'),
        pixelArt: true,
        pixelRatio: 1,
        suppressPlayButton: true,
        displayMode: ex.DisplayMode.FitContainer,
        canvasElement: canvas,
        scenes: { Level0: Level },
      });

      set({ gameEngine: game });
    },
    addActor: (actor: ex.Actor) => {
      const { gameEngine } = get();
      if (!gameEngine) return;
      gameEngine.add(actor);
    },
    startGame: async () => {
      const { gameEngine } = get();
      if (!gameEngine) return;
      const loader = new BBLoaderScreen(Object.values(Resources));
      await gameEngine.start(loader);
      gameEngine.goToScene('Level0');
    },
    exitGame: () => {
      console.log('exiting game');
      const { gameEngine } = get();
      if (!gameEngine) return;
      gameEngine.stop();
      // gameEngine.canvas.remove();
      set(initialFlappyBirdGameState);
    },
  };
});
