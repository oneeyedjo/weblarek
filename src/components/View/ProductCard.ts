import { categoryMap } from '../../utils/constants';
import { BaseCard } from './BaseCard';
import { ensureElement } from '../../utils/utils';
import { ICardCatalog } from '../../types';

type CategoryKey = keyof typeof categoryMap;

export class ProductCard extends BaseCard {
    private categoryElement: HTMLElement;
    private imageElement: HTMLImageElement;

    constructor(container: HTMLElement, onAction: () => void) {
        super(container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.container.addEventListener('click', onAction);
    }

    set data(value: ICardCatalog) {
        super.data = value;
        this.setImage(this.imageElement, value.image);
        this.categoryElement.textContent = value.category;
        this.categoryElement.className = `card__category ${categoryMap[value.category as CategoryKey]}`;
    }
}