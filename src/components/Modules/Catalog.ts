import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Catalog {
    private items: IProduct[] = [];
    private selected: IProduct | null = null;

    constructor(private events: IEvents) {}

    setItems(items: IProduct[]): void {
        this.items = items;
        this.events.emit('catalog:changed');
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getById(id: string): IProduct | null {
        return this.items.find(item => item.id === id) || null;
    }

    setSelected(product: IProduct): void {
        this.selected = product;
        this.events.emit('catalog:selectedChanged');
    }

    getSelected(): IProduct | null {
        return this.selected;
    }
}