import { ContainerChild, Graphics, Point, Text } from "pixi.js";
import { BaseLocation } from "./baseLocation";
import { StateStackManager } from "../stateStackManager";
import { expandN } from 'regex-to-strings'
import { globalGameState } from "../globalGameState";

export class DropOffLocation extends BaseLocation {

  locationType: string = 'dropoff'
  planetName = expandN(/[A-Z]{1,3}-[0-9]{5}/,1)[0]

  public use(): void {
    alert('Это Хрущёвка')
  }

  constructor(position: Point, private stateStack: StateStackManager) {
    super(position)
    this.beginDrawing()
  }

  public update(): void {
    if (globalGameState.qm.currentQuestPlanet == this) {
      this.drawableContainer.tint ='#FFFF00'
      if (this.miniMapPresentationContainer)
        this.miniMapPresentationContainer.scale = 2
      console.log(this)
    }
  }

  initDrawables(): ContainerChild[] {
    return [
      new Graphics()
        .circle(0,0,18)
        .fill('#FFFFFF')
        .circle(0,0,16)
        .fill('#AAAAAA'),
      new Text({
        text: this.planetName,
        style: {
          fontSize: 8,
          fill: '#FFFFFF'
        },
        x: 10,
        y: 10
      })
    ]
  }
}