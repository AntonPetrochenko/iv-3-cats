import { ContainerChild, Graphics, Point } from "pixi.js";
import { BaseObject } from "../world/baseObject";

export class Explosion extends BaseObject {
  public objectName = 'explo';

  explosionGraphics = new Graphics().circle(0,0,4).fill('#FFFFFF')
  scale = 0

  constructor(position: Point) {
    super(position)
    this.beginDrawing()
  }
  update(dt: number): void {
    this.scale += dt
    this.explosionGraphics.scale.set(this.scale)
  }

  initDrawables(): ContainerChild[] {
    return [
      this.explosionGraphics
    ]
  }

  
}