import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IHeader {
    counter: number;
}

export class Header extends Component<IHeader> {
    private basketButton: HTMLButtonElement;
    private counterElement: HTMLElement;

    constructor(container: HTMLElement, private events: IEvents) {
        super(container);
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);
        this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', container);
        this.basketButton.addEventListener('click', () => this.events.emit('basket:open'));
    }

    set counter(value: number) {
        this.counterElement.textContent = String(value);
    }
}