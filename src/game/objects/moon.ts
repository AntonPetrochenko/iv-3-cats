import { ContainerChild, Graphics, Point } from "pixi.js";
import { BaseObject } from "../world/baseObject";
import { Game } from "../world/game";
import { isLocation } from "./baseLocation";
import { DropOffLocation } from "./dropOffLocation";

export function isMoon(o: any): o is Moon {
  return o.objectName == 'moon';
}

export class Moon extends BaseObject {

  public objectName: string = 'moon';
  orbitSpeed: number = 0;
  orbitDistance: number = 0;
  t: number = 0;

  update(dt: number) {
    this.t+=dt*this.orbitSpeed;
    this.position.set(
      this.myLocation.position.x+Math.cos(this.t)*this.orbitDistance,
      this.myLocation.position.y+Math.sin(this.t)*this.orbitDistance
    )
  };

  myLocation!: DropOffLocation;
  constructor(position: Point, game: Game) {
    super(position)
    this.beginDrawing()

    this.orbitSpeed = (Math.random()-0.5)*0.03

    const [myLocation, distance] = game.findClosestObject<DropOffLocation>([this.position.x, this.position.y], (o) => {
      return isLocation(o) && o.locationType == 'dropoff'
    })

    if (myLocation) {
      this.myLocation = myLocation
      this.orbitDistance = Math.max(distance, 18)
    }
  }

  initDrawables(): ContainerChild[] {
    return [
      new Graphics()
        .circle(0,0,18)
        .fill('#FFFFFF')
        .circle(0,0,16)
        .fill('#FF0000')
    ]
  }
}