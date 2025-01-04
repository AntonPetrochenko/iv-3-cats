import { Inventory } from "./inventory/inventory"
import { QuestManager } from "./quests/questManager"

export const globalGameState = {
  money: 1000,
  health: 9,
  inventory: new Inventory(),
  maxQuestItems: 3,
  qm: new QuestManager()
}

export function resetGlobalGameState() {
  globalGameState.money = 1000
  globalGameState.health = 9
  globalGameState.inventory = new Inventory()
  globalGameState.maxQuestItems = 3
  globalGameState.qm = new QuestManager()
}