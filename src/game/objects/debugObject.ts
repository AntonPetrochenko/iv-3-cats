import { ContainerChild, Graphics, Point } from "pixi.js";
import { BaseObject } from "../world/baseObject";

export class DebugObject extends BaseObject {

  public objectName = 'debug';

  constructor(position: Point) {
    super(position)
    this.beginDrawing()
  }

  initDrawables(): ContainerChild[] {
    return [
      new Graphics()
        .circle(0,0,5)
        .fill('#ffffff')
    ]
  }

  update(_: number): void {
    /** */
  }
}