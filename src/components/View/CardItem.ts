import { BaseCard } from './BaseCard';
import { ensureElement } from '../../utils/utils';
import { ICardGeneral } from '../../types';

interface ICardItem extends ICardGeneral {
    index: number;
}

export class CardItem extends BaseCard<ICardItem> {
    private indexElement: HTMLElement;
    private deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, onDelete: () => void) {
        super(container);
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        this.deleteButton.addEventListener('click', onDelete);
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }

    set data(value: ICardItem) {
        super.data = value;
        this.index = value.index;
    }
}