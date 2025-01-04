import { ContainerChild, Graphics, Point } from "pixi.js";
import { BaseLocation } from "./baseLocation";
import { StateStackManager } from "../stateStackManager";

export class DropOffLocation extends BaseLocation {

  locationType: string = 'dropoff'
  
  public use(): void {
    alert('Это Хрущёвка')
  }

  constructor(position: Point, private stateStack: StateStackManager) {
    super(position)
    this.beginDrawing()
  }

  initDrawables(): ContainerChild[] {
    return [
      new Graphics()
        .circle(0,0,18)
        .fill('#FFFFFF')
        .circle(0,0,16)
        .fill('#AAAAAA')
    ]
  }
}