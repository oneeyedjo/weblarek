import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IBasket {
    list: HTMLElement[];
    totalPrice: number;
    canOrder: boolean;
}

export class Basket extends Component<IBasket> {
    private listElement: HTMLUListElement;
    private buttonElement: HTMLButtonElement;
    private totalElement: HTMLElement;

    constructor(container: HTMLElement, private events: IEvents) {
        super(container);
        this.listElement = ensureElement<HTMLUListElement>('.basket__list', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('basket:submit');
        });
    }

    set data(value: IBasket) {
        this.listElement.replaceChildren(...value.list);
        this.totalElement.textContent = `${value.totalPrice} синапсов`;
        this.buttonElement.disabled = !value.canOrder;
    }
}