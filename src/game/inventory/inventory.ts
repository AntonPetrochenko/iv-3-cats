import { IInventoryItem } from "./inventoryItem";

export class Inventory {
  items: IInventoryItem[] = []

  constructor() {}
  
  public insertItem(newItem: IInventoryItem): void {
    for (const ownedItem of this.items) {
      if (ownedItem.name == newItem.name) {
        ownedItem.quantity += newItem.quantity
        return
      }
    }
    // else
    this.items.push({...newItem}) // copy on write JUST IN CASE
  }

  public tryTakeItems(itemName: string, quantity: number): boolean {
    for (const ownedItem of this.items) {
      if (ownedItem.name == itemName)  {
        if (ownedItem.quantity >= quantity) {
          ownedItem.quantity -= quantity
          this.items = this.items.filter( i => i.quantity > 0 ) // todo remove just this
          return true
        }
      }
    }
    return false
  }
}