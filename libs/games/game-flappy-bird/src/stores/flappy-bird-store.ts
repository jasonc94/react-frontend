import * as ex from 'excalibur';
import { create } from 'zustand';

type FlappyBirdGameState = {
  gameEngine: ex.Engine | null;
};

type FlappyBirdStateActions = {
  initGame: (canvas: HTMLCanvasElement) => void;
  startGame: () => void;
  addActor: (actor: ex.Actor) => void;
  exitGame: () => void;
};

const initialFlappyBirdGameState: FlappyBirdGameState = {
  gameEngine: null,
};

export const useFlappyBirdStore = create<
  FlappyBirdGameState & FlappyBirdStateActions
>((set, get) => {
  return {
    ...initialFlappyBirdGameState,
    initGame: (canvas: HTMLCanvasElement) => {
      const game = new ex.Engine({
        width: 400,
        height: 500,
        backgroundColor: ex.Color.fromHex('#54C0CA'),
        pixelArt: true,
        pixelRatio: 2,
        displayMode: ex.DisplayMode.FitContainer,
        canvasElement: canvas,
      });

      set({ gameEngine: game });
    },
    addActor: (actor: ex.Actor) => {
      const { gameEngine } = get();
      if (!gameEngine) return;
      gameEngine.add(actor);
    },
    startGame: () => {
      const { gameEngine } = get();
      if (!gameEngine) return;
      gameEngine.start();
    },
    exitGame: () => {
      const { gameEngine } = get();
      if (!gameEngine) return;
      gameEngine.stop();
      set(initialFlappyBirdGameState);
    },
  };
});
