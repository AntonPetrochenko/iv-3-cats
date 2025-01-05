import { Application, Container } from "pixi.js";
import { BaseState } from "./states/baseState";

export class StateStackManager {

  stateStack: BaseState[] = []

  constructor (private app: Application) {}

  public update(dt: number) {
    if (this.stateStack.length) {
      this.stateStack[this.stateStack.length-1]?.update(dt)
    }
  }

  public pushStateEx( cb: (container: Container, stateStack: StateStackManager) => BaseState ): void {
    const container = new Container()
    this.app.stage.addChild(container)
    const state = cb(container, this)
    this.pushState(state)
  }

  public pushState(state: BaseState) {
    requestAnimationFrame( () => {
      this.stateStack.forEach( s => s.isActive = false )
      this.stateStack.push(state)
      state.isActive = true
    })
  }

  public popState() {
    const removedState = this.stateStack.pop()
    if (removedState) {
      removedState.destructor()
      removedState.localInputs.kill()
      this.app.stage.removeChild(removedState.container)
      this.stateStack[this.stateStack.length-1].isActive = true
    } else {
      console.log('Refusing to pop')
    }
  }

}