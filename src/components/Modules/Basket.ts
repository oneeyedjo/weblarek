import { IProduct  } from "../../types";

class Basket {
  private items: IProduct[] = []

  getItems(): IProduct[] {
    return this.items
  }

  addItems(product: IProduct): void {
    if(!this.hasItem(product.id)) {
      this.items.push(product)
    }
  }

  removeItem(id: string): void {
    const index = this.items.findIndex(item => item.id === id) 
    if (index !== -1) {
      this.items.splice(index, 1)
    }
  }

  clear(): void {
    this.items = []
  }

  getPrice(): number {
    return this.items.reduce((sum, item) => {
      return sum + (item.price || 0)
    }, 0)
  }

  getNum(): number {
    return this.items.length
  }

  hasItem(id: string): boolean {
    return this.items.some(item => item.id === id)
  }
}

export default Basket;