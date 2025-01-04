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

export class Game extends BaseState {

  private objects = new Set<BaseObject>()

  private gameplayContainer = new Container();
  private hudContainer = new Container();
  private miniMapWrapperContainer = new Container();
  private miniMapContainer = new Container();
  private bigMapContainer = new Container();
  private mapContainer = new Container();

  constructor (public container: Container, private mgr: StateStackManager) {
    super(container, mgr)
    this.addObject(new Player(new Point(0,0), this.localInputs, this))

    this.container.addChild(this.gameplayContainer)
    this.container.addChild(this.hudContainer)
    this.container.addChild(this.mapContainer)

    this.hudContainer.addChild(new Text({
      text: 'THIS IS HUD',
      style: {
        fontSize: 8
      }
    }))

    this.miniMapWrapperContainer.addChild(this.miniMapContainer)
    this.miniMapWrapperContainer.position.set(320/2, 180/2)
    this.hudContainer.addChild(this.miniMapWrapperContainer)

    this.generateMap()

    globalGameState.qm.game = this
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
          -o.position.x/4,
          -o.position.y/4
        )
      }
      o._update(dt)
      if (o.bigMapPresentationContainer) {
        o.bigMapPresentationContainer.position.set(o.position.x/3, o.position.y/3)
      }
      if (o.miniMapPresentationContainer) {
        o.miniMapPresentationContainer.position.set(o.position.x/4, o.position.y/4)
      }
    })
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
      return [Math.random()*1000-500,Math.random()*1000-500]
    }

    shops.forEach( (shopData) => {
      const newShop = new shopLocation(shopData.items, new Point(...generatePointOnMap()), this.mgr)
      this.addObject(newShop)
      
      const mm = newShop.miniMapPresentationContainer = new Container()
      mm.addChild(new Graphics().circle(0,0,2).fill('#FFFFFF').circle(0,0,1).fill('#0000FF'))
      this.miniMapContainer.addChild(mm)
    })

    for (let i=0; i<29; i++) {
      const newHouse = new DropOffLocation(new Point(...generatePointOnMap()), this.mgr)
      this.addObject(newHouse)

      const mm = newHouse.miniMapPresentationContainer = new Container()
      mm.addChild(new Graphics().circle(0,0,1).fill('#FFFF00'))
      this.miniMapContainer.addChild(mm)
    }

    for (let i=0; i<50; i++) {
      const newMoon = new Moon(new Point(...generatePointOnMap()), this)
      this.addObject(newMoon)

      const mm = newMoon.miniMapPresentationContainer = new Container()
      mm.addChild(new Graphics().circle(0,0,1).fill('#FF0000'))
      this.miniMapContainer.addChild(mm)
    }
  }

}