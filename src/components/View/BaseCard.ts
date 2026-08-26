import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { ICardGeneral } from '../../types';


export class BaseCard<T extends ICardGeneral = ICardGeneral> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.titleElement = ensureElement<HTMLElement>('.card__title', container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', container);
    }

    set data(value: T) {
        this.titleElement.textContent = value.title;
        this.priceElement.textContent = value.price !== null ? `${value.price} синапсов` : 'Бесценно';
    }
}