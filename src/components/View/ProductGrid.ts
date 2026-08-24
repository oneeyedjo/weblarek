import { Component } from '../base/Component';

interface IProductGrid {
    catalog: HTMLElement[];
}

export class ProductGrid extends Component<IProductGrid> {
    private containerElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.containerElement = container;
    }

    set catalog(value: HTMLElement[]) {
        this.containerElement.replaceChildren(...value);
    }
}