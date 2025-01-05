export interface IInventoryItem {
  use(): void
  quantity: number
  name: string
  price: number
  description: string
}