import { IInventoryItem } from "../inventory/inventoryItem";

export interface StoreInfo {
  name: string,
  sysname: string,
  items: IInventoryItem[]
}

const groceryStore: StoreInfo = {
  name: 'Grocery',
  sysname: 'grocery',
  items: [
    {
      name: 'CANNED CAT FOOD',
      price: 500,
      quantity: 1,
      use: () => {},
      
    },
    {
      name: 'KIBBLE',
      price: 250,
      quantity: 1,
      use: () => {},
    },
    {
      name: 'FLAX',
      price: 100,
      quantity: 1,
      use: () => {},
    },
    {
      name: 'YOGURT',
      price: 500,
      quantity: 1,
      use: () => {},
    },
    {
      name: 'HARBOIL EGG',
      price: 40,
      quantity: 1,
      use: () => {},
    },
    {
      name: 'CEMENT (edible)',
      price: 40,
      quantity: 1,
      use: () => {},
    },
  ]
}

const hardwareStore: StoreInfo = {
  name: 'HARDWARE',
  sysname: 'hardware',
  items: [
    {
      name: 'SCRATCH POLE',
      price: 1000,
      quantity: 1,
      use: () => {},
    },
    {
      name: 'PILLOW',
      price: 1500,
      quantity: 1,
      use: () => {},
    },
    {
      name: 'AUTO FEEDER',
      price: 2500,
      quantity: 1,
      use: () => {},
    },
    {
      name: 'BOWL',
      price: 500,
      quantity: 1,
      use: () => {},
    },
    {
      name: 'WATER FOUNTAIN',
      price: 1500,
      quantity: 1,
      use: () => {},
    },
    {
      name: 'CEMENT (inedible)',
      price: 40,
      quantity: 1,
      use: () => {},
    },
  ]
}

const drugStore: StoreInfo = {
  name: 'HERB',
  sysname: 'drug',
  items: [
    {
      name: 'CATNIP',
      price: 100,
      quantity: 1,
      use: () => {},
      
    },
    {
      name: 'VALERIAN EXTR.',
      price: 100,
      quantity: 1,
      use: () => {},
    },
    {
      name: 'Nepetalactone',
      price: 100,
      quantity: 1,
      use: () => {},
    },
    {
      name: 'WATER',
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
