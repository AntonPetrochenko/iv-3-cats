import { Inventory } from "./inventory/inventory"

export const globalGameState = {
  money: 1000,
  health: 9,
  inventory: new Inventory()
}

export function resetGlobalGameState() {
  globalGameState.money = 1000
  globalGameState.health = 9
  globalGameState.inventory = new Inventory()
}