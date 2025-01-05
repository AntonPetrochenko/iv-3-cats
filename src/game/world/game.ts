import { Container, Graphics, Point, Text } from "pixi.js";
import { BaseObject } from "./baseObject";
import { BaseState } from "../states/baseState";
import { StateStackManager } from "../stateStackManager";
import { Player } from "../objects/player";
import { DebugObject } from "../objects/debugObject";
import { dist } from "../helper/math";
import { shopLocation } from "../objects/shopLocation";
import { shops } from "../data/shops";
import { DropOffLocation } from "../objects/dropOffLocation";
import { Moon } from "../objects/moon";
import { globalGameState } from "../globalGameState";
import { PauseScreen } from "../pause/pauseScreen";
import { FONT_FAMILY } from "../constants";
import { niceText } from "../helper/niceText";
import { gameMusic, shopMusic } from "../helper/audio";

export class Game extends BaseState {

  public objects = new Set<BaseObject>()

  private gameplayContainer = new Container();
  private hudContainer = new Container();
  private miniMapWrapperContainer = new Container();
  private miniMapContainer = new Container();
  private bigMapWrapperContainer = new Container();
  public bigMapContainer = new Container();
  private mapContainer = new Container();

  private debugText = new Text({
    text: 'THIS IS HUD',
    style: {
      fontSize: 8,
      fontFamily: FONT_FAMILY,
      fill: '#ffffff'
    }
  })

  constructor (public container: Container, private mgr: StateStackManager) {

    gameMusic.fade(0,1,1000).play()
    super(container, mgr)
    
    this.container.addChild(this.gameplayContainer)
    this.container.addChild(this.hudContainer)
    this.container.addChild(this.mapContainer)

    this.hudContainer.addChild(this.debugText)

    const mmMask = new Graphics().circle(0,0,32).fill('#FFFFFF')
    this.miniMapWrapperContainer.addChild(mmMask)
    this.miniMapWrapperContainer.addChild(new Graphics().circle(0,0,32).fill('#ffffff'))
    this.miniMapWrapperContainer.addChild(new Graphics().circle(0,0,30).fill('#873e84'))
    this.miniMapWrapperContainer.addChild(new Graphics().circle(0,0,16).fill('#d46eb3')) 
    this.miniMapWrapperContainer.addChild(new Graphics().circle(0,0,8).fill('#ee8fcb'))
    this.miniMapWrapperContainer.mask = mmMask

    this.miniMapWrapperContainer.addChild(this.miniMapContainer)
    this.miniMapWrapperContainer.position.set(320-320/12, 180/6)

    this.bigMapWrapperContainer.addChild(this.bigMapContainer)


    this.hudContainer.addChild(this.miniMapWrapperContainer)
    // this.hudContainer.addChild(this.bigMapWrapperContainer)
    
    const player = new Player(new Point(0,0), this.localInputs, this)
    
    const mm = player.miniMapPresentationContainer = new Container()
    mm.addChild(new Graphics().circle(0,0,2).fill('#FFFFFF'))
    this.miniMapContainer.addChild(mm)
    
    this.generateMap()
    this.addObject(player)

    const bm = player.bigMapPresentationContainer = new Container()
    bm.addChild(new Graphics().circle(0,0,2).fill('#FFFFFF').circle(0,0,1).fill('#FF0000'))
    bm.addChild(niceText('Вы',-2*3,-8, 6))
    this.bigMapContainer.addChild(bm)
    
    globalGameState.qm.game = this
    globalGameState.qm.newQuest()

    this.localInputs.on('button-pressed-select', () => {
      mgr.pushStateEx((container, stateStack) => new PauseScreen(container, stateStack, this.bigMapWrapperContainer))
    }) 
  }

  addObject(object: BaseObject) {
    this.objects.add(object)
    if (object.drawableContainer) {
      this.gameplayContainer.addChild(object.drawableContainer)
      // object.miniMapPresentationContainer = new Container();
      // object.miniMapPresentationContainer.addChild(new Graphics().circle(0,0,3).fill('#ffffff'))
      // this.miniMapContainer.addChild(object.miniMapPresentationContainer)
    }
  }

  findClosestObject<T extends BaseObject>(origin: [number, number], cb: (t: BaseObject) => boolean): [T | null, number] {
    let closestObject: BaseObject | null = null;
    let closestObjectDistance: number = Infinity;

    this.objects.forEach( o => {
      if (cb(o)) {
        const d = dist(origin, [o.position.x, o.position.y])
        if (d < closestObjectDistance) {
          closestObject = o
          closestObjectDistance = d
        }
      }
    })

    return [closestObject, closestObjectDistance]
  }

  findAll<T extends BaseObject>(cb: (t: BaseObject) => boolean): T[] {
    const outArr: BaseObject[] = [];
    this.objects.forEach( o => {
      if (cb(o)) outArr.push(o)
    })
    return outArr as T[] // sorry
  }

  update(dt: number) {
    this.objects.forEach( o => {
      if (o.isCameraAnchor) {
        this.gameplayContainer.position.set(
          -o.position.x+320/2,  // -o.velocity.x*4
          -o.position.y+180/2  // -o.velocity.y*4
        )

        this.miniMapContainer.position.set(
          -o.position.x/8,
          -o.position.y/8
        )

        // this.bigMapContainer.position.set(
        //   -o.position.x/8,
        //   -o.position.y/5
        // )
      }
      o._update(dt)
      if (o.bigMapPresentationContainer) {
        o.bigMapPresentationContainer.position.set(o.position.x/8, o.position.y/8)
      }
      if (o.miniMapPresentationContainer) {
        o.miniMapPresentationContainer.position.set(o.position.x/8, o.position.y/8)
      }
    })

    this.debugText.text = `ЖИЗНИ КОТИКА: ${globalGameState.health}  ДЕНЕГ ${globalGameState.money} \n`
    
  }

  removeObject(object: BaseObject) {
    object._onDelete()
    this.objects.delete(object)
    this.gameplayContainer.removeChild(object.drawableContainer)
    this.container.removeChild(this.gameplayContainer)
    this.container.removeChild(this.hudContainer)
  }

  destructor(): void {
    this.objects.forEach( o => {
      this.removeObject(o)
    })
    
  }

  public generateMap() {

    function generatePointOnMap() {
      return [Math.random()*1500-(1500/2),Math.random()*1000-500]
    }

    

    for (let i=0; i<19; i++) {
      const newHouse = new DropOffLocation(new Point(...generatePointOnMap()), this.mgr)
      this.addObject(newHouse)

      const mm = newHouse.miniMapPresentationContainer = new Container()
      mm.addChild(new Graphics().circle(0,0,1).fill('#FFFF00'))
      this.miniMapContainer.addChild(mm)

      const bm = newHouse.bigMapPresentationContainer = new Container()
      bm.addChild(new Graphics().circle(0,0,2).fill('#FFFFFF'))
      const s = 4
      const subCircle = newHouse.subCircle = new Graphics().lineTo(-s,0).lineTo(s,0).lineTo(0,0).lineTo(0,-s).lineTo(0,s).stroke('#ffffff').circle(0,0,1).fill('#FFFF00')
      bm.addChild(subCircle)
      this.bigMapContainer.addChild(bm)

      console.log(bm)
    }

    for (let i=0; i<30; i++) {
      const newMoon = new Moon(new Point(...generatePointOnMap()), this)
      this.addObject(newMoon)

      const mm = newMoon.miniMapPresentationContainer = new Container()
      mm.addChild(new Graphics().circle(0,0,1).fill('#FF0000'))
      this.miniMapContainer.addChild(mm)
    }

    shops.forEach( (shopData) => {
      const newShop = new shopLocation(shopData, new Point(...generatePointOnMap()), this.mgr)
      this.addObject(newShop)
      
      const mm = newShop.miniMapPresentationContainer = new Container()
      mm.addChild(new Graphics().circle(0,0,2).fill('#FFFFFF').circle(0,0,1).fill('#0000FF'))
      this.miniMapContainer.addChild(mm)

      const bm = newShop.bigMapPresentationContainer = new Container()
      bm.addChild(new Graphics().circle(0,0,2).fill('#FFFFFF').circle(0,0,1).fill('#0000FF'))
      bm.addChild(niceText(shopData.name, -shopData.name.length*3,-8, 6))
      this.bigMapContainer.addChild(bm)
    })
  }

}