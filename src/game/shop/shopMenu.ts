import { Container, Point, Text } from "pixi.js";
import { StateStackManager } from "../stateStackManager";
import { BaseState as Game } from "../states/baseState";
import { IInventoryItem } from "../inventory/inventoryItem";
import { ShopItemDisplayObject } from "./shopItemDisplayObject";
import { globalGameState } from "../globalGameState";


export class ShopMenu extends Game {

  public displayedShopItems: ShopItemDisplayObject[] = []
  public cursorIndex = 0;

  public moneyLabel = new Text({
    text: '',
    style: {
      fill: '#ffffff',
      fontSize: 8,
    }
  })

  constructor(container: Container, private stateStack: StateStackManager, private shopItems: IInventoryItem[]) {
    super(container, stateStack)

    this.updateMoneyLabel()
    shopItems.forEach( (item, idx) => {
      const displayObject = new ShopItemDisplayObject(new Point(30,30+9*idx), `${item.name} => ${item.price}¥`)
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
        this.cursorIndex = shopItems.length - 1
      }
      if (this.cursorIndex >= shopItems.length) {
        this.cursorIndex = 0
      }
      
      this.displayedShopItems[this.cursorIndex]?.activate()
      console.log(this.cursorIndex)
    })

    this.localInputs.on('button-pressed-b', () => {
      this.stateStack.popState()
    })

    this.localInputs.on('button-pressed-a', () => {
      const shopItem = this.shopItems[this.cursorIndex]
      if (globalGameState.money >= shopItem.price) {
        globalGameState.money -= shopItem.price
        globalGameState.inventory.insertItem(shopItem)
        console.log(globalGameState.inventory)
      } else {
        console.log('Деньги кончелися')
      }
    })
  }

  destructor(): void {
    this.displayedShopItems.forEach( i => {
      this.container.removeChild(i.drawableContainer)
    })
  }

  updateMoneyLabel() {
    this.moneyLabel.text = `${globalGameState.money}¥`
  }

  update(dt: number): void {
    
  }
}