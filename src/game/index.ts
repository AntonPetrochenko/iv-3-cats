import 'pixi.js/math-extras'
import { Application, TextureStyle } from "pixi.js";
import { Game } from "./world/game";
import { StateStackManager } from './stateStackManager';

TextureStyle.defaultOptions.scaleMode = 'nearest';

export async function initGame() {
  const app = new Application()
  await app.init({
    antialias: false,
    width: 320,
    height: 180,
    roundPixels: true,
    backgroundColor: '#390947'
  })

  const stateStack = new StateStackManager(app)

  stateStack.pushStateEx( (container, stack) => new Game (container, stack))

  // inputManager.evt.on('button-pressed-select', () => stateStack.popState())

  app.ticker.add(ticker => stateStack.update(ticker.deltaTime))

  document.body.appendChild(app.canvas)
}