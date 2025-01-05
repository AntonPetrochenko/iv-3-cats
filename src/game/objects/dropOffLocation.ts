import { Buffer, Container, ContainerChild, Graphics, Point, Sprite, Text, Texture } from "pixi.js";
import { BaseLocation } from "./baseLocation";
import { StateStackManager } from "../stateStackManager";
import { expandN } from 'regex-to-strings'
import { globalGameState } from "../globalGameState";
import _ from "lodash";
import { mkSimplexNoise } from "@spissvinkel/simplex-noise";

export class DropOffLocation extends BaseLocation {

  locationType: string = 'dropoff'
  planetName = expandN(/[A-Z]{1,3}-[0-9]{5}/,1)[0]


  subCircle?: ContainerChild

  timer = 0

  public use(): void {
    if (globalGameState.qm.currentQuestPlanet == this) {
      globalGameState.qm.completeQuest()
    } else {
      console.log('You got the wrong house, fool!')
    }
  }

  constructor(position: Point, private stateStack: StateStackManager) {
    super(position)
    this.size = 20+Math.random()*16
    this.beginDrawing()
  }

  public update(dt: number): void {
    this.timer += 1/60*dt
    
    if (globalGameState.qm.currentQuestPlanet == this) {
      this.drawableContainer.tint ='#FFFF00'
      if (this.miniMapPresentationContainer)
        this.miniMapPresentationContainer.scale = 2
      if (this.bigMapPresentationContainer)
        this.bigMapPresentationContainer.scale = 3
      if (this.subCircle) {
        this.subCircle.visible = true
      }
    } else {
      this.drawableContainer.tint = '#ffffff'
      if (this.miniMapPresentationContainer)
        this.miniMapPresentationContainer.scale = 1
      if (this.bigMapPresentationContainer)
        this.bigMapPresentationContainer.scale = 1
      if (this.subCircle) {
        this.subCircle.visible = false
      }
    }
  }

  initDrawables(): ContainerChild[] {

    const palettes = [
      ['#873e84', '#d46eb3', '#ee8fcb', '#ffc3f2'],
      ['#5ba675', '#6bc96c', '#abdd64', '#fcef8d'],
      ['#8465ec', '#6d80fa', '#8db7ff', '#aee2ff'],
      ['#873555', '#a6555f', '#c97373', '#f2ae99'],
      ['#7b5480', '#a6859f', '#d9bdc8', '#ffffff']
    ]

    const palette = _.sample(palettes) as [string, string, string, string]
    const fancyTextureContainer = new Container()
    const mask = new Graphics().circle(0,0,this.size).fill(palette[0])
    fancyTextureContainer.addChild(mask)
    fancyTextureContainer.mask = mask

    fancyTextureContainer.addChild(new Graphics().circle(0,0,this.size).fill(palette[0]))
    

    const posWithin = () => (Math.random()*this.size-this.size/2)*2

    // for (let i=Math.random()*4+2;i>0; i-- ) {
    //   fancyTextureContainer.addChild(new Graphics().circle(posWithin(), posWithin(), Math.random()*16+4).fill(palette[1]))
    // }
    // for (let i=Math.random()*8+4;i>0; i-- ) {
    //   fancyTextureContainer.addChild(new Graphics().circle(posWithin(), posWithin(), Math.random()*8+2).fill(palette[2]))
    // }
    // for (let i=Math.random()*16+8;i>0; i-- ) {
    //   fancyTextureContainer.addChild(new Graphics().circle(posWithin(), posWithin(), Math.random()*4+2).fill(palette[3]))
    // }

    const simplexSource1 = mkSimplexNoise(Math.random)
    const simplexSource2 = mkSimplexNoise(Math.random)
    const textureBuffer = new Uint8Array(this.size*this.size*4)
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = this.size*2
    canvas.height = this.size*2
    
    if (ctx) {
      for (let x=0;x<this.size*2; x++) {
        for (let y=0;y<this.size*2; y++) {
          const s1 = simplexSource1.noise2D(x/32,y/32)*0.5 + simplexSource1.noise2D(x/64,y/64)
          const s2 = simplexSource2.noise2D(x/16,y/16)*0.5 + simplexSource2.noise2D(x/32,y/32)
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
        .circle(0,0,this.size+2)
        .fill('#FFFFFF'),
      fancyTextureContainer,
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