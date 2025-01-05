import { Assets, Container, Graphics, NineSliceSprite, Point, Text } from "pixi.js";
import { StateStackManager } from "../stateStackManager";
import { BaseState } from "../states/baseState"; 
import { ShopItemDisplayObject } from "../shop/shopItemDisplayObject";
import { globalGameState } from "../globalGameState";
import { FONT_FAMILY } from "../constants";
import { clamp } from "lodash";
import { lerp } from "../helper/math";
import { box9Patch } from "../helper/box9Patch";
import { niceText } from "../helper/niceText";

export class PauseScreen extends BaseState {

  public displayedInventoryItems: ShopItemDisplayObject[] = []
  public displayedQuestItems: ShopItemDisplayObject[] = []
  public cursorIndex = 0;
  public tabOffset = 0;
  public currentTabPosition = 0;
  public fadeInTimer = 0;

  public moneyLabel = new Text({
    text: '',
    style: {
      fill: '#ffffff',
      fontSize: 8,
      fontFamily: FONT_FAMILY
    },
    x: 30,
    y: 54-12
  })

  constructor(container: Container, private stateStack: StateStackManager, private myBigMap: Container) {
    super(container, stateStack)

    container.alpha = 0

    this.updateMoneyLabel()
    this.container.addChild(new Graphics().rect(-1000,-1000,2000,2000).fill('#00000066'))


    this.container.addChild(box9Patch(10,10, 320-20, 180-20))
    this.container.addChild(box9Patch(10-320,10, 320-20, 180-20))
    this.container.addChild(box9Patch(320,0, 320, 180))

    this.container.addChild(this.moneyLabel)

    this.container.addChild(niceText('<< ЗАКАЗ     [ИНВЕНТАРЬ]   КАРТА >>', 20, 24))
    this.container.addChild(niceText('<< [ЗАКАЗ]     ИНВЕНТАРЬ   КАРТА >>', 20-320, 24))
    this.container.addChild(niceText('<< ЗАКАЗ     ИНВЕНТАРЬ   [КАРТА] >>', 20+320, 10))

    this.container.addChild(myBigMap)
    myBigMap.position.set(320+320/2, 180/2)
    const inventoryItems = globalGameState.inventory.items
    inventoryItems.forEach( (item, idx) => {
      const displayObject = new ShopItemDisplayObject(new Point(30,54+10*idx), `${item.name} x ${item.quantity}`)
      this.displayedInventoryItems.push(displayObject)
      this.container.addChild(displayObject.drawableContainer)
      if (idx == 0) {
        // displayObject.activate()
      }
    })

    Object.keys(globalGameState.qm.currentQuestItems).forEach( (itemName, idx) => {
      const itemQuantity = globalGameState.qm.currentQuestItems[itemName]
      const displayObject = new ShopItemDisplayObject(new Point(-320+30,54+9*idx), `${itemName} x ${itemQuantity}шт`)
      this.displayedInventoryItems.push(displayObject)
      this.container.addChild(displayObject.drawableContainer)
    })

    this.localInputs.on('direction-vertical', (d: number) => {
      this.cursorIndex += d
      this.displayedInventoryItems.forEach( i => i.deactivate() )
      
      if (this.cursorIndex < 0) {
        this.cursorIndex = inventoryItems.length - 1
      }
      if (this.cursorIndex >= inventoryItems.length) {
        this.cursorIndex = 0
      }
      
      // this.displayedInventoryItems[this.cursorIndex]?.activate()
      console.log(this.cursorIndex)
    })

    this.localInputs.on('direction-horizontal', (d: number) => {
      this.tabOffset -= d
      if (this.tabOffset < -1) this.tabOffset = 1
      if (this.tabOffset > 1) this.tabOffset = -1
    })

    this.localInputs.on('button-pressed-b', () => {
      this.stateStack.popState()
    })

    this.localInputs.on('button-pressed-select', () => {
      this.stateStack.popState()
    })

    this.localInputs.on('button-pressed-start', () => {
      this.stateStack.popState()
    })

    this.localInputs.on('button-pressed-a', () => {
      
    })
  }

  destructor(): void {
    this.displayedInventoryItems.forEach( i => {
      this.container.removeChild(i.drawableContainer)
    })
    this.container.removeChild(this.moneyLabel)
  }

  updateMoneyLabel() {
    this.moneyLabel.text = `Деньги: ${globalGameState.money}$`
  }

  update(dt: number): void {
    this.displayedInventoryItems.forEach( o => o.update(dt) )
    this.displayedQuestItems.forEach( o => o.update(dt) )

    this.fadeInTimer += (1/60*dt)*3
    this.fadeInTimer = clamp(this.fadeInTimer,0,1)
    this.container.alpha = this.fadeInTimer

    this.currentTabPosition = lerp(this.currentTabPosition, this.tabOffset, 1/60*dt*10)


    this.container.position.set(this.currentTabPosition*320, 0)
  }
}
