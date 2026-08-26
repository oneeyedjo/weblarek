import { Component } from '../base/Component';

interface IProductGrid {
    catalog: HTMLElement[];
}

export class ProductGrid extends Component<IProductGrid> {
    constructor(container: HTMLElement) {
        super(container); 
    }

    set catalog(value: HTMLElement[]) {
        this.container.replaceChildren(...value); 
    }
}