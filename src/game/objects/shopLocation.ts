import { ContainerChild, Graphics, Point } from "pixi.js";
import { BaseLocation } from "./baseLocation";
import { StateStackManager } from "../stateStackManager";
import { ShopMenu } from "../shop/shopMenu";
import { IInventoryItem } from "../inventory/inventoryItem";

export class shopLocation extends BaseLocation {

  locationType: string = 'shop';

  constructor(private items: IInventoryItem[], position: Point, private stateStack: StateStackManager) {
    super(position)
    this.beginDrawing()
  }

  public use(): void {
    this.stateStack.pushStateEx((container, stateStack) => new ShopMenu(container, stateStack, this.items))
  }

  initDrawables(): ContainerChild[] {
    return [
      new Graphics()
        .circle(0,0,18)
        .fill('#FFFFFF')
        .circle(0,0,16)
        .fill('#0000AA')
    ]
  }
}