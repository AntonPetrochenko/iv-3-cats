import { ContainerChild, Graphics, Point } from "pixi.js";
import { BaseLocation } from "./baseLocation";
import { StateStackManager } from "../stateStackManager";
import { ShopMenu } from "../shop/shopMenu";
import { StoreInfo } from "../data/shops";
import { niceText } from "../helper/niceText";

export class shopLocation extends BaseLocation {

  locationType: string = 'shop';

  constructor(private shop: StoreInfo, position: Point, private stateStack: StateStackManager) {
    super(position)
    this.beginDrawing()
  }

  public use(): void {
    this.stateStack.pushStateEx((container, stateStack) => new ShopMenu(container, stateStack, this.shop))
  }

  initDrawables(): ContainerChild[] {
    const title = "STORE"
    return [
      new Graphics()
        .circle(0,0,18)
        .fill('#FFFFFF')
        .circle(0,0,16)
        .fill('#000099')
        .circle(0,0,12)
        .fill('#000044')
        .circle(0,0,8)
        .fill('#000022'),
      niceText(this.shop.name,-this.shop.name.length*4, -this.size-14),
      niceText(title,-title.length*3, -this.size-24, 6),
    ]
  }
}