import { IInventoryItem } from "../inventory/inventoryItem";

export interface StoreInfo {
  name: string,
  sysname: string,
  items: IInventoryItem[]
}

const groceryStore: StoreInfo = {
  name: 'Продукты',
  sysname: 'grocery',
  items: [
    {
      name: 'ПРОДУКТОВЫЙ ТУТ',
      price: 1,
      quantity: 1,
      use: () => {}
    }
  ]
}

const hardwareStore: StoreInfo = {
  name: 'Хозяйственный',
  sysname: 'hardware',
  items: [
    {
      name: 'ХОЗМАГ ТУТ',
      price: 1,
      quantity: 1,
      use: () => {}
    }
  ]
}

const drugStore: StoreInfo = {
  name: 'Аптека',
  sysname: 'hardware',
  items: [
    {
      name: 'АПТЕКА',
      price: 1,
      quantity: 1,
      use: () => {}
    }
  ]
}

export const shops: StoreInfo[] = [
  groceryStore,
  hardwareStore,
  drugStore
]
