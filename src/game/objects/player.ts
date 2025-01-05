import { Assets, ContainerChild, Graphics, Point, Sprite } from "pixi.js";
import { inputManager } from "../helper/inputManager";
import { BaseObject } from "../world/baseObject";
import { PausableEventProxy } from "../helper/pausableEventProxy";
import { lerp2, mod, mul2 } from "../helper/math";
import { Game } from "../world/game";
import { BaseLocation, isLocation } from "./baseLocation";
import { isMoon, Moon } from "./moon";
import { globalGameState } from "../globalGameState";
import { collideSfx } from "../helper/audio";

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
      if (hittableMoon && distance < hittableMoon.size) {
        this.invulnerabilitySeconds = 3
        globalGameState.health -= 1
        collideSfx.play()
        const punchAngle = Math.atan2(this.position.y - hittableMoon.position.y, this.position.x - hittableMoon.position.x)
        
        this.velocity.set(
          Math.cos(punchAngle)*3,
          Math.sin(punchAngle)*3
        )
      }
    }

    if (this.invulnerabilitySeconds > 0) {
      if (Math.floor(this.invulnerabilitySeconds*10)%2 > 0.9) {
        this.drawableContainer.visible = false
      } else {
        this.drawableContainer.visible = true
      }
    }

    this.position.x = (mod(this.position.x+950,1900))-950
    this.position.y = (mod(this.position.y+700,1400))-700
  }

  constructor(position: Point, localInputs: PausableEventProxy, private game: Game) {
    super(position)


    

    localInputs.on('button-pressed-b', () => {
      const [location, distance] = game.findClosestObject<BaseLocation>([this.position.x, this.position.y], (o) => isLocation(o) && o.locationType == 'shop')
      if (location && distance < location.size + 16) {
        location.use()
      }
    })

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
      // new Graphics()
      //   .lineTo(5,2.5)
      //   .lineTo(5,-2.5)
      //   .lineTo(0,0)
      //   .fill('#ffffff'),
      new Sprite({
        texture: Assets.get('wunk'),
        x: -8,
        y: -8
      })
    ]
  }
  
}