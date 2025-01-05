import { Assets, Container, Graphics, Point, Sprite, Text } from "pixi.js";
import { StateStackManager } from "../stateStackManager";
import { BaseState } from "../states/baseState";
import { ShopItemDisplayObject } from "./shopItemDisplayObject";
import { globalGameState } from "../globalGameState";
import { FONT_FAMILY } from "../constants";
import { box9Patch } from "../helper/box9Patch";
import _, { clamp } from "lodash";
import { StoreInfo } from "../data/shops";
import { niceText } from "../helper/niceText";
import { beepSfx, buySfx, gameMusic, shopMusic } from "../helper/audio";


export class ShopMenu extends BaseState {

  public displayedShopItems: ShopItemDisplayObject[] = []
  public cursorIndex = 0;

  private fadeInTimer = 0;
  private staticTimer = 0;

  private typerBuffer = '';
  private typerSource = 'Добро пожаловать!';

  private updateTyper() {
    const typerBufferArray = Array.from(this.typerBuffer);
    const typerSourceArray = Array.from(this.typerSource);

    const borrowedLetter = typerSourceArray.shift()
    if (borrowedLetter) {
      typerBufferArray.push(borrowedLetter);
    }
    this.typerBuffer = typerBufferArray.join('')
    this.typerSource = typerSourceArray.join('')
  }

  public moneyLabel = new Text({
    text: '',
    style: {
      fill: '#ffffff',
      fontSize: 8,
      fontFamily: FONT_FAMILY
    },
    x: 20,
    y: 29
  })

  private shopKeeper = new Sprite({
    texture: Assets.get(_.sample([
      'wunk1',
      'wunk2',
      'wunk3',
      'wunk4',
      'wunk5',
      'wunk6',
      'wunk7',
    ])),
    x: 216,
    y: 14
  })

  private static = new Sprite({
    texture: Assets.get('static'),
    x: 216,
    y: 14
  })

  constructor(container: Container, private stateStack: StateStackManager, private shop: StoreInfo) {
    super(container, stateStack)

    this.container.alpha = 0;

    this.container.addChild(new Graphics().rect(-1000,-1000,2000,2000).fill('#00000066'))
    this.container.addChild(box9Patch(10,5, 200, 170))
    this.container.addChild(box9Patch(210,5, 100, 170))

    this.container.addChild(this.shopKeeper)
    this.container.addChild(this.static)

    this.updateMoneyLabel()
    this.container.addChild(this.moneyLabel)
    this.container.addChild(niceText(`[${this.shop.name}]`, 20,20))
    shop.items.forEach( (item, idx) => {
      const displayObject = new ShopItemDisplayObject(new Point(20,42+9*idx), `${item.name} => ${item.price}$`)
      this.displayedShopItems.push(displayObject)
      this.container.addChild(displayObject.drawableContainer)
      if (idx == 0) {
        displayObject.activate()
      }
    })

    this.localInputs.on('direction-vertical', (d: number) => {
      this.cursorIndex += d
      this.displayedShopItems.forEach( i => i.deactivate() )
      
      if (this.cursorIndex < 0) {
        this.cursorIndex = shop.items.length - 1
      }
      if (this.cursorIndex >= shop.items.length) {
        this.cursorIndex = 0
      }

      beepSfx.play()
      
      this.displayedShopItems[this.cursorIndex]?.activate()
      console.log(this.cursorIndex)
    })

    this.localInputs.on('button-pressed-b', () => {
      this.stateStack.popState()
    })

    this.localInputs.on('button-pressed-a', () => {
      const shopItem = this.shop.items[this.cursorIndex]
      if (globalGameState.money >= shopItem.price) {
        globalGameState.money -= shopItem.price
        globalGameState.inventory.insertItem(shopItem)
        console.log(globalGameState.inventory)
        buySfx.play()
      } else {
        console.log('Деньги кончелися')
      }
      this.updateMoneyLabel()
    })

    gameMusic.fade(1,0,200).once('fade', () => {shopMusic.fade(0,1,0.5).play()})
  }

  destructor(): void {
    this.displayedShopItems.forEach( i => {
      this.container.removeChild(i.drawableContainer)
    })
    this.container.removeChild(this.moneyLabel)
    shopMusic.fade(1,0,200).once('fade', () => { gameMusic.fade(0,1,200) ;shopMusic.stop() }) 
  }

  updateMoneyLabel() {
    this.moneyLabel.text = `ДЕНЬГИ: ${globalGameState.money}$`
  }

  update(dt: number): void {

    this.staticTimer += 1/60*dt
    this.fadeInTimer += (1/60*dt)*3
    this.fadeInTimer = clamp(this.fadeInTimer,0,1)
    this.container.alpha = this.fadeInTimer


    if (Math.random() < 0.5) {
      this.static.scale.set(1,1)
      this.static.position.set(216,14)
    }
    else {
      this.static.scale.set(-1,1)
      this.static.position.set(216+88,14)
    }   

    if (this.staticTimer > 1) {
      this.shopKeeper.visible = true
      this.static.alpha = Math.max(2 - this.staticTimer, 0)
    }

    this.displayedShopItems.forEach( o => o.update(dt) )
  }
}