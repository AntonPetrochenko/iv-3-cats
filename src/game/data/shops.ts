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
      name: 'КОНСЕРВЫ',
      price: 500,
      quantity: 1,
      use: () => {},
      
    },
    {
      name: 'СУХОЙ КОРМ',
      price: 250,
      quantity: 1,
      use: () => {},
    },
    {
      name: 'ЛЁН',
      price: 100,
      quantity: 1,
      use: () => {},
    },
    {
      name: 'ЙОГУРТ',
      price: 500,
      quantity: 1,
      use: () => {},
    },
    {
      name: 'ЯЙЦО',
      price: 40,
      quantity: 1,
      use: () => {},
    },
  ]
}

const hardwareStore: StoreInfo = {
  name: 'ВСЁ ДЛЯ ДОМА',
  sysname: 'hardware',
  items: [
    {
      name: 'КОГТЕТОЧКА',
      price: 1000,
      quantity: 1,
      use: () => {},
    },
    {
      name: 'ЛЕЖАНКА',
      price: 1500,
      quantity: 1,
      use: () => {},
    },
    {
      name: 'АВТОКОРМУШКА',
      price: 2500,
      quantity: 1,
      use: () => {},
    },
    {
      name: 'МИСКА',
      price: 500,
      quantity: 1,
      use: () => {},
    },
    {
      name: 'ФОНТАНЧИК',
      price: 1500,
      quantity: 1,
      use: () => {},
    },
  ]
}

const drugStore: StoreInfo = {
  name: 'Аптека',
  sysname: 'hardware',
  items: [
    {
      name: 'ВАЛЕРЬЯНА',
      price: 100,
      quantity: 1,
      use: () => {},
      
    },
    {
      name: 'ВАЛЕРЬЯНА',
      price: 100,
      quantity: 1,
      use: () => {},
    },
    {
      name: 'ВАЛЕРЬЯНА',
      price: 100,
      quantity: 1,
      use: () => {},
    },
    {
      name: 'ВАЛЕРЬЯНА',
      price: 100,
      quantity: 1,
      use: () => {},
    }
  ]
}

export const shops: StoreInfo[] = [
  groceryStore,
  groceryStore,
  hardwareStore,
  drugStore
]
