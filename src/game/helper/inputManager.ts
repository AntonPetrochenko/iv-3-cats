import { EventEmitter } from 'events'

const BUTTON_MAPPING = new Map<number, keyof Partial<IInputMapping>>([
  [8, 'select'],
  [9, 'start'],
  [0, 'b'],
  [1, 'a'],
])

interface IInputMapping {
  a: boolean,
  b: boolean,
  select: boolean,
  start: boolean,
}

export class GlobalInputManager {
  evt = new EventEmitter()

  private stickViaKeyboard = true;

  private previousButtonStates: boolean[] = []
  private previousDirectionStates = {
    left: false,
    right: false,
    up: false,
    down: false
  }
  public inputStates: IInputMapping = {
    a: false,
    b: false,
    select: false,
    start: false
  }
  private internalKeyboardState = {
    left: false,
    right: false,
    up: false,
    down: false,
  }

  private leftStick = [0,0]
  public getLeftStick(): [number, number] { return [this.leftStick[0], this.leftStick[1]] }
  
  private constructor() {
    const loopFunc = () => {
      const pads = navigator.getGamepads()
      pads.forEach( (p) => {
        if (p) {
          p.buttons.forEach( (buttonState, idx) => {
            if (this.previousButtonStates[idx] != buttonState.pressed && BUTTON_MAPPING.has(idx)) {
              this.evt.emit((buttonState.pressed ? 'button-pressed' : 'button-released') + '-' + BUTTON_MAPPING.get(idx))
            }
            this.previousButtonStates[idx] = buttonState.pressed
          })

          if (p.axes[0]) {
            const left = p.axes[0] < -0.3
            const right = p.axes[0] > 0.3
            if (left && this.previousDirectionStates.left != left) {
              this.evt.emit('direction-horizontal', -1)
              this.stickViaKeyboard = false;
            }
            if (right && this.previousDirectionStates.right != right) {
              this.evt.emit('direction-horizontal', 1)
              this.stickViaKeyboard = false;
            }
            this.previousDirectionStates.left = left
            this.previousDirectionStates.right = right

          }

          if (p.axes[1]) {
            const up = p.axes[1] < -0.3
            const down = p.axes[1] > 0.3
            if (up && this.previousDirectionStates.up != up) {
              this.evt.emit('direction-vertical', -1)
              this.stickViaKeyboard = false;
            }
            if (down && this.previousDirectionStates.down != down) {
              this.evt.emit('direction-vertical', 1)
              this.stickViaKeyboard = false;
            }
            this.previousDirectionStates.up = up
            this.previousDirectionStates.down = down
          }

          if (!this.stickViaKeyboard) {
            this.leftStick[0] = p.axes[0]
            this.leftStick[1] = p.axes[1]
          }
        }
      })


      if (this.stickViaKeyboard) {
        if (this.internalKeyboardState.left != this.internalKeyboardState.right) {
          this.leftStick[0] = this.internalKeyboardState.left ? -1 : 1
        } else {
          this.leftStick[0] = 0 
        }
        if (this.internalKeyboardState.up != this.internalKeyboardState.down) {
          this.leftStick[1] = this.internalKeyboardState.up ? -1 : 1
        } else {
          this.leftStick[1] = 0
        }
      }
      requestAnimationFrame(loopFunc)
    }

    window.addEventListener('keydown', (evt) => {
      this.stickViaKeyboard = true;
      switch (evt.key) {
        case 'ArrowLeft': { this.evt.emit('direction-horizontal', -1); this.internalKeyboardState.left = true; break; }
        case 'ArrowRight': { this.evt.emit('direction-horizontal', 1); this.internalKeyboardState.right = true;  break; }
        case 'ArrowUp': { this.evt.emit('direction-vertical', -1);     this.internalKeyboardState.up = true; break; }
        case 'ArrowDown': { this.evt.emit('direction-vertical', 1);    this.internalKeyboardState.down = true;  break; }

        case 'Shift': { this.evt.emit('button-pressed-select'); break; }
        case 'Enter': { this.evt.emit('button-pressed-start'); break; }

        case 'z': { this.evt.emit('button-pressed-a'); break; }
        case 'x': { this.evt.emit('button-pressed-b'); break; }
      }
    })

    window.addEventListener('keyup', (evt) => {
      switch (evt.key) {
        case 'ArrowLeft': {   this.internalKeyboardState.left = false; break; }
        case 'ArrowRight': {  this.internalKeyboardState.right = false; break; }
        case 'ArrowUp': {     this.internalKeyboardState.up = false; break; }
        case 'ArrowDown': {   this.internalKeyboardState.down = false; break; }

        case 'Shift': { this.evt.emit('button-released-select'); break; }
        case 'Enter': { this.evt.emit('button-released-start'); break; }

        case 'z': { this.evt.emit('button-released-a'); break; }
        case 'x': { this.evt.emit('button-released-b'); break; }
      }
    })

    const pollLoop = requestAnimationFrame(loopFunc)
  }

  

  static instance = new GlobalInputManager()
}

export const inputManager = GlobalInputManager.instance