import { EventEmitter, Listener } from "events";

export class PausableEventProxy {
  constructor(private underlyingEmitter: EventEmitter, private predicate: () => boolean) {}

  setPredicate(predicate: () => boolean) {
    this.predicate = predicate
  }

  private myListeners: [string, Listener][] = []

  on(type: string, listener: Listener) {
    const newListener: Listener = (...args) => {
      if (this.predicate()) {
        listener(...args)
      }
    }
    this.underlyingEmitter.on(type, newListener)
    this.myListeners.push([type, newListener])
  }

  off(type: string, listener: Listener) {
    this.underlyingEmitter.off(type, listener)
  }

  kill() {
    this.myListeners.forEach( ([type, listener]) => {
      this.off(type, listener)
    } )
  }
}