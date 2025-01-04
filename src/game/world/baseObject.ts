import { Point } from "pixi.js";
import { Container, ContainerChild } from "pixi.js"

export abstract class BaseObject {

  public abstract readonly objectName: string;

  public width = 16
  public height = 16
  public isCameraAnchor = false;

  drawableContainer: Container
  bigMapPresentationContainer?: Container
  miniMapPresentationContainer?: Container

  initDrawables(): ContainerChild[]  {
    throw 'Unimplemented';
  }

  constructor(public position: Point = new Point(0,0), public velocity: Point = new Point(0,0), public rotation: number = 0) {
    const container = new Container()
    this.drawableContainer = container
  }

  beginDrawing() {
    const initialChildren = this.initDrawables()

    this.drawableContainer.position.set(this.position.x, this.position.y)
    initialChildren.forEach( child => this.drawableContainer.addChild(child))
  }

  _update(dt: number) {
    this.position.add(this.velocity, this.position)
    this.update(dt)
    if (this.drawableContainer) {
      this.drawableContainer.position.set(this.position.x, this.position.y)
      this.drawableContainer.rotation = this.rotation
    }
  }

  abstract update(dt: number): void

  _onDelete() { 
    this.onDelete()
  } 

  onDelete(): void {
    /* */
  }

}