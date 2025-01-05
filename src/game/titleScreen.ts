import { Container } from "pixi.js";
import { buySfx, titleMusic } from "./helper/audio";
import { BaseState } from "./states/baseState";
import { StateStackManager } from "./stateStackManager";
import { Game } from "./world/game";
import { niceText } from "./helper/niceText";

export class TitleScreen extends BaseState {

  textContainer: Container = new Container()
  constructor(container: Container, stateStack: StateStackManager) {

    
    super(container, stateStack)
    titleMusic.seek(0)
    titleMusic.fade(0,1,200).play()

    this.localInputs.on('button-pressed-start', () => {
      buySfx.play()
      this.container.removeChild(this.textContainer)
      stateStack.pushStateEx( (container, stack) => new Game(container, stack))
      titleMusic.fade(1,0,200)
    })

    this.textContainer.addChild(niceText('WUNKUS\nDELIVERY\nCOMPANY', 16, 8, 12))

    this.textContainer.addChild(niceText('2025 (C) team cardboard box', 16, 180-16,))
    this.textContainer.addChild(niceText(`  / minijam 175`,100,9), )

    this.textContainer.addChild(niceText('Wunkiest delivery company ever!!1',16,64))
    this.textContainer.addChild(niceText('Buy ordered products in stores',16,64+16))
    this.textContainer.addChild(niceText('haul them to various planets!',16,64+24))

    this.textContainer.addChild(niceText('Be sure to bring ALL the ordered',16,64+24+16))
    this.textContainer.addChild(niceText(`items, or the customer's gonna GET U`,16,64+24+24))

    this.textContainer.addChild(niceText('Press (ENTER)',16,64+24+24+24))

    this.container.addChild(this.textContainer)
  }

  destructor(): void {
    
  }

  update(dt: number): void {
    
  }
}