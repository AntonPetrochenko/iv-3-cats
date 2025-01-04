import { ContainerChild, Graphics, Point, Text } from "pixi.js";
import { BaseObject } from "../world/baseObject";

export class ShopItemDisplayObject extends BaseObject {
  public objectName: string = 'shopItemDisplay';

  private textNormal: Text;
  private textHighlighted: Text;
  private highlight: Graphics

  constructor(position: Point, private labelText: string) {
    super(position)

    this.textNormal = new Text({
      text: this.labelText,
      style: {
        fontSize: 8,
        fill: '#ffffff'
      }
    })
    this.textHighlighted = new Text({
      text: this.labelText,
      style: {
        fontSize: 8,
        fill: '#000000'
      }
    })

    this.highlight = new Graphics()
      .rect(0,0,this.labelText.length*8,8)
      .fill('#ffffff')

    this.beginDrawing()
    this.deactivate()
  }

  update(dt: number): void {
    /** */
  }

  changeText(t: string) {
    this.textHighlighted.text = t
    this.textNormal.text = t
  }

  activate() {
    this.highlight.visible = true
    this.textHighlighted.visible = true
    this.textNormal.visible = false
  }

  deactivate() {
    this.highlight.visible = false
    this.textHighlighted.visible = false
    this.textNormal.visible = true
  }

  initDrawables(): ContainerChild[] {
    return [
      this.highlight,
      this.textNormal,
      this.textHighlighted
    ]
  }
}