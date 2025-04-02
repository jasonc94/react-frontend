import * as ex from 'excalibur';
import { create } from 'zustand';
import { Level } from '../scenes/level';
import { Resources } from '../assets/resources';

type FlappyHuskyGameState = {
  gameEngine: ex.Engine | null;
  level: 'Level';
};

type FlappyHuskyStateActions = {
  initGame: (canvas: HTMLCanvasElement) => void;
  startGame: () => Promise<void>;
  addActor: (actor: ex.Actor) => void;
  exitGame: () => void;
};

const initialFlappyBirdGameState: FlappyHuskyGameState = {
  gameEngine: null,
  level: 'Level',
};

export const useFlappyHuskyStore = create<
  FlappyHuskyGameState & FlappyHuskyStateActions
>((set, get) => {
  return {
    ...initialFlappyBirdGameState,
    initGame: (canvas: HTMLCanvasElement) => {
      const game = new ex.Engine({
        width: 400,
        height: 500,
        backgroundColor: ex.Color.fromHex('#54C0CA'),
        pixelArt: true,
        pixelRatio: 1,
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
      const loader = new ex.Loader(Object.values(Resources));
      await gameEngine.start(loader);
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
