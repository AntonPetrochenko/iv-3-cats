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
      const item = {..._.sample(_.sample(shops)?.items)} as IInventoryItem // thx lodash for types 👍
      const itemQuantity = 1+Math.floor(Math.random()*4)
      if (item) {
        questMoney += item.price * item.quantity
        if (this.currentQuestItems[item.name]) {
          this.currentQuestItems[item.name] += itemQuantity
        } else {
          this.currentQuestItems[item.name] = itemQuantity
        }
      }
    }
    this.currentQuestPlanet = _.sample(this.game.findAll<DropOffLocation>((o) => isLocation(o) && o.locationType == 'dropoff'))
    globalGameState.money += questMoney
    if (!this.currentQuestItems) {
      alert('Оно сломалось... Жми F5 🤷‍♀️')
    }
  }

  completeQuest() {
    if (!this.game) return
    //this.currentQuestItems.forEach
  }
}