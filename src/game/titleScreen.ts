import { Container } from "pixi.js";
import { buySfx, titleMusic } from "./helper/audio";
import { BaseState } from "./states/baseState";
import { StateStackManager } from "./stateStackManager";
import { Game } from "./world/game";
import { niceText } from "./helper/niceText";

export class TitleScreen extends BaseState {

  highScore: number
  highScoreOwner: string

  textContainer: Container = new Container()
  constructor(container: Container, stateStack: StateStackManager) {

    
    super(container, stateStack)
    this.highScore = parseInt(localStorage.getItem('highscore') ?? '0')
    this.highScoreOwner = localStorage.getItem('highscoreOwner') ?? ''
    titleMusic.play()

    this.localInputs.on('button-pressed-start', () => {
      buySfx.play()
      this.container.removeChild(this.textContainer)
      stateStack.pushStateEx( (container, stack) => new Game(container, stack))
      titleMusic.fade(1,0,200)
    })

    this.textContainer.addChild(niceText('WUNKUS\nDELIVERY\nCOMPANY', 16, 8, 12))

    this.textContainer.addChild(niceText('2025 (C) cardboard box', 16, 180-16,))
    this.textContainer.addChild(niceText(`Рекорд: ${this.highScore} (${this.highScoreOwner})`,100,9), )

    this.textContainer.addChild(niceText('РаботаЙ котиком-курьером в космосе!!!',16,64))
    this.textContainer.addChild(niceText('Покупай продукты в магазинах',16,64+16))
    this.textContainer.addChild(niceText('отвози их на планеты получателей!',16,64+24))

    this.textContainer.addChild(niceText('Не забудь привезти весь заказ,',16,64+24+16))
    this.textContainer.addChild(niceText('а то заказчик разозлится...',16,64+24+24))

    this.textContainer.addChild(niceText('Жми (СТАРТ)',16,64+24+24+24))

    this.container.addChild(this.textContainer)
  }

  destructor(): void {
    
  }

  update(dt: number): void {
    
  }
}