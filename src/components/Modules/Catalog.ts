import { IProduct } from '../../types';

class Catalog {
  private items: IProduct[] = [];
  private selected: IProduct | null = null;

  setItems(items: IProduct[]): void {
    this.items = items;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getId(id: string): IProduct | null {
    return this.items.find(item => item.id === id) || null
  }
  
  setSelected (product: IProduct): void {
    this.selected = product
  }

  getSelected(): IProduct | null {
    return this.selected
  }
}

export default Catalog;
