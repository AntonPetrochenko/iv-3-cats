import { ContainerChild, Graphics, Point, Text } from "pixi.js";
import { BaseObject } from "../world/baseObject";
import { clamp } from "lodash";
import { lateConsts } from "../constants";

export class ShopItemDisplayObject extends BaseObject {
  public objectName: string = 'shopItemDisplay';

  private textNormal: Text;
  private textHighlighted: Text;
  private highlight: Graphics

  private switchTimer = 0;
  private switchDirection = -1;

  constructor(position: Point, private labelText: string) {
    super(position)

    this.textNormal = new Text({
      text: this.labelText,
      style: {
        fontSize: 8,
        fill: '#ffffff',
        fontFamily: lateConsts.FONT_FAMILY
      }
    })
    this.textHighlighted = new Text({
      text: this.labelText,
      style: {
        fontSize: 8,
        fill: '#4e187c ',
        fontFamily: lateConsts.FONT_FAMILY
      }
    })

    this.highlight = new Graphics()
      .rect(-1,-1,this.labelText.length*8+1,8+1)
      .fill('#ffffff')

    this.beginDrawing()
    this.deactivate()
  }

  update(dt: number): void {
    this.switchTimer += (1/60*dt)*this.switchDirection*5
    this.switchTimer = clamp(this.switchTimer, 0, 1)
    
    this.highlight.scale.set(this.switchTimer,1)
  }

  changeText(t: string) {
    this.textHighlighted.text = t
    this.textNormal.text = t
  }

  activate() {
    this.textHighlighted.visible = true
    this.textNormal.visible = false
    this.switchDirection = 1
  }

  deactivate() {
    this.textHighlighted.visible = false
    this.textNormal.visible = true
    this.switchDirection = -1
  }

  initDrawables(): ContainerChild[] {
    return [
      this.highlight,
      this.textNormal,
      this.textHighlighted
    ]
  }
}