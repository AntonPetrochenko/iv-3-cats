import _ from "lodash";
import { globalGameState } from "../globalGameState";
import { IInventoryItem } from "../inventory/inventoryItem";
import { Game } from "../world/game";
import { shops } from "../data/shops";
import { DropOffLocation } from "../objects/dropOffLocation";
import { isLocation } from "../objects/baseLocation";

export class QuestManager {

  currentQuestItems: Record<string, number> = {};
  currentQuestPlanet?: DropOffLocation
  game?: Game

  constructor() {
    // @ts-expect-error idk
    window.questManager = this
  }

  newQuest() {
    if (!this.game) return
    this.currentQuestItems = {}
    const itemVarietyCount = 1+Math.floor(Math.random()*globalGameState.maxQuestItems)
    let questMoney = 0;
    for (let i=0; i<itemVarietyCount; i++) {
      const shop = _.sample(shops)
      const item = {..._.sample(shop?.items)} as IInventoryItem // thx lodash for types 👍
      const itemQuantity = 1+Math.floor(Math.random()*4)
      if (item && shop) {
        questMoney += item.price * itemQuantity
        if (this.currentQuestItems[item.name]) {
          this.currentQuestItems[item.name] += itemQuantity
        } else {
          this.currentQuestItems[item.name] = itemQuantity
        }
      }
    }
    this.currentQuestPlanet = _.sample(this.game.findAll<DropOffLocation>((o) => isLocation(o) && o.locationType == 'dropoff'))
    globalGameState.money += Math.floor(questMoney * 1.4)
    if (!this.currentQuestItems) {
      alert('Оно сломалось... Жми F5 🤷‍♀️')
    }
  }

  completeQuest() {
    if (!this.game) return
    Object.keys(this.currentQuestItems).forEach( itemName => {
      const itemQuantity = this.currentQuestItems[itemName]
      const success = globalGameState.inventory.tryTakeItems(itemName, itemQuantity)
      if (!success) {
        globalGameState.health -= 1
      }
    })
    this.newQuest()
  }
}