import { ContainerChild, Graphics, Point } from "pixi.js";
import { inputManager } from "../helper/inputManager";
import { BaseObject } from "../world/baseObject";
import { PausableEventProxy } from "../helper/pausableEventProxy";
import { lerp2, mul2 } from "../helper/math";
import { Game } from "../world/game";
import { BaseLocation, isLocation } from "./baseLocation";
import { isMoon, Moon } from "./moon";

const PlayerString = 'player';

export function isPlayer(a: any): a is Player {
  return a.objectName == PlayerString
}

export class Player extends BaseObject {

  private invulnerabilitySeconds = 3;

  public isCameraAnchor = true;

  public objectName: string = PlayerString;

  update(dt: number): void {

    this.invulnerabilitySeconds -= dt*1/60
    const stick = mul2(inputManager.getLeftStick(),2) 
    const currentVelocity = [this.velocity.x, this.velocity.y] as [number, number]
    const control = lerp2(currentVelocity, stick, 0.05*dt)
    

    if (Math.abs(stick[0]) > 0.3 || Math.abs(stick[1]) > 0.3) {
      this.velocity.set(control[0], control[1])
      this.rotation = Math.atan2(-stick[1], -stick[0])
    }
    
    if (this.invulnerabilitySeconds < 0) {
      const [hittableMoon, distance] = this.game.findClosestObject<Moon>([this.position.x, this.position.y], (o) => {
        return isMoon(o)
      })
  
      console.log(this.invulnerabilitySeconds, )
      if (hittableMoon && distance < 16) {
        this.invulnerabilitySeconds = 3
        const punchAngle = Math.atan2(this.position.y - hittableMoon.position.y, this.position.x - hittableMoon.position.x)
        
        this.velocity.set(
          Math.cos(punchAngle)*3,
          Math.sin(punchAngle)*3
        )
      }
    }
  }

  constructor(position: Point, localInputs: PausableEventProxy, private game: Game) {
    super(position)

    localInputs.on('button-pressed-a', () => {
      console.log('A press')
      const [location, distance] = game.findClosestObject<BaseLocation>([this.position.x, this.position.y], (o) => isLocation(o))
      
      if (location && distance < 30) {
        location.use()
      }
    })

    this.beginDrawing()
  }

  initDrawables(): ContainerChild[] {
    return [
      new Graphics()
        .lineTo(5,2.5)
        .lineTo(5,-2.5)
        .lineTo(0,0)
        .fill('#ffffff'),
      new Graphics()
        .circle(0,0,3)
        .fill('#ff0000')
    ]
  }
  
}