import 'pixi.js/math-extras'
import { Application, Assets, Text, TextureStyle } from "pixi.js";
import { Game } from "./world/game";
import { StateStackManager } from './stateStackManager';
import { assetInfo } from './data/assetInfo';
import { TitleScreen } from './titleScreen';
import { fill, size } from 'lodash';
import { loadLateConsts } from './constants';

TextureStyle.defaultOptions.scaleMode = 'nearest';

export async function initGame() {
  const app = new Application({antialias: false})
  await app.init({
    antialias: false,
    width: 320,
    height: 180,
    roundPixels: true,
    backgroundColor: '#390947',
  })

  
  const loadingText = new Text({
    text: 'Loading...',
    x: 16,
    y: 16,
    style: {
      fontSize: 16,
      fill: '#FFFFFF'
    }
  })
  document.body.appendChild(app.canvas)

  app.stage.addChild(loadingText)
  await loadLateConsts()
  await Assets.load(assetInfo)
  loadingText.text = 'Click to play...'

  app.canvas.addEventListener('click', () => {
    const stateStack = new StateStackManager(app)
  
    stateStack.pushStateEx( (container, stack) => new TitleScreen (container, stack))
  
    app.ticker.add(ticker => stateStack.update(ticker.deltaTime))

    loadingText.destroy()
  }, {once: true})
}