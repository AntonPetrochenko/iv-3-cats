import { Container, ContainerChild, Graphics, Point, Sprite, Texture } from "pixi.js";
import { BaseObject } from "../world/baseObject";
import { Game } from "../world/game";
import { isLocation } from "./baseLocation";
import { DropOffLocation } from "./dropOffLocation";
import { mkSimplexNoise } from "@spissvinkel/simplex-noise";

export function isMoon(o: any): o is Moon {
  return o.objectName == 'moon';
}

export class Moon extends BaseObject {

  public objectName: string = 'moon';
  orbitSpeed: number = 0;
  orbitDistance: number = 0;
  t: number = 0;

  size = 16

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
    this.size = Math.random() * 16 + 3
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

    const palette = ['#ffc3f2', '#ee8fcb', '#d46eb3', '#873e84']

    const fancyTextureContainer = new Container()
    const mask = new Graphics().circle(0,0,this.size).fill(palette[0])
    fancyTextureContainer.addChild(mask)
    fancyTextureContainer.mask = mask

    fancyTextureContainer.addChild(new Graphics().circle(0,0,this.size).fill(palette[0]))



    const simplexSource1 = mkSimplexNoise(Math.random)
    const simplexSource2 = mkSimplexNoise(Math.random)
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = this.size*2
    canvas.height = this.size*2
    
    if (ctx) {
      for (let x=0;x<this.size*2; x++) {
        for (let y=0;y<this.size*2; y++) {
          const s1 = simplexSource1.noise2D(x/16,y/16)*0.5 + simplexSource1.noise2D(x/32,y/32)
          const s2 = simplexSource2.noise2D(x/8,y/8)*0.5 + simplexSource2.noise2D(x/16,y/16)
          const s = Math.max(s1, s2)
          let c = palette[0]
          if (s >= 0.25 && s < 0.5) c = palette[1]
          if (s >= 0.5 && s < 0.75) c = palette[2]
          if (s >= 0.75) c = palette[3]
          ctx.fillStyle = c
          ctx.fillRect(x,y,1,1)
        }
      }
    }

    const niceTexture = new Sprite(Texture.from(canvas))
    niceTexture.position.set(-this.size, -this.size)
    niceTexture.scale.set(1.1)

    fancyTextureContainer.addChild(niceTexture)

    return [
      new Graphics()
        .circle(0,0,this.size + 2)
        .fill('#ea6262'),
        fancyTextureContainer
    ]
  }
}