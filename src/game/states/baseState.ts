import { Container } from "pixi.js";
import { inputManager } from "../helper/inputManager";
import { PausableEventProxy } from "../helper/pausableEventProxy"
import { StateStackManager } from "../stateStackManager";

export abstract class BaseState {

  public localInputs: PausableEventProxy;
  public isActive = false;

  constructor(public container: Container, public stateManager: StateStackManager) {
    this.localInputs = new PausableEventProxy(inputManager.evt, () => this.isActive)
  }

  abstract destructor(): void;

  abstract update(dt: number): void;
}