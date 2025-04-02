import * as ex from 'excalibur';
import { create } from 'zustand';
import { Level } from '../scenes/level';

type FlappyBirdGameState = {
  gameEngine: ex.Engine | null;
  level: 'Level';
};

type FlappyBirdStateActions = {
  initGame: (canvas: HTMLCanvasElement) => void;
  startGame: () => Promise<void>;
  addActor: (actor: ex.Actor) => void;
  exitGame: () => void;
};

const initialFlappyBirdGameState: FlappyBirdGameState = {
  gameEngine: null,
  level: 'Level',
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
        scenes: { Level: Level },
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
      await gameEngine.start();
      gameEngine.goToScene('Level');
    },
    exitGame: () => {
      const { gameEngine } = get();
      if (!gameEngine) return;
      gameEngine.stop();
      set(initialFlappyBirdGameState);
    },
  };
});
