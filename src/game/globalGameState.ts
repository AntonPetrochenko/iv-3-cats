import { Inventory } from "./inventory/inventory"
import { QuestManager } from "./quests/questManager"

export const globalGameState = {
  money: 0,
  health: 9,
  inventory: new Inventory(),
  maxQuestItems: 3,
  qm: new QuestManager()
}

export function resetGlobalGameState() {
  globalGameState.money = 0
  globalGameState.health = 9
  globalGameState.inventory = new Inventory()
  globalGameState.maxQuestItems = 3
  globalGameState.qm = new QuestManager()
}