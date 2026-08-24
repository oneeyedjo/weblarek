import { categoryMap, CDN_URL } from '../../utils/constants';
import { BaseCard } from './BaseCard';
import { ensureElement } from '../../utils/utils';
import { ICardPreview } from '../../types';
import { IEvents } from '../base/Events';

type CategoryKey = keyof typeof categoryMap;

export class ProductDetail extends BaseCard {
    private imageElement: HTMLImageElement;
    private categoryElement: HTMLElement;
    private descriptionElement: HTMLElement;
    private buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, private events: IEvents) {
        super(container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

        this.buttonElement.addEventListener('click', (e) => {
            e.stopPropagation();
            this.events.emit('preview:submit');
        });
    }

    set data(value: ICardPreview) {
        super.data = value;
        this.setImage(this.imageElement, `${CDN_URL}/${value.image}`);
        this.categoryElement.textContent = value.category;
        this.categoryElement.className = `card__category ${categoryMap[value.category as CategoryKey]}`;
        this.descriptionElement.textContent = value.description;

        if (value.price === null) {
            this.buttonElement.disabled = true;
            this.buttonElement.textContent = 'Недоступно';
            return;
        }
        this.buttonElement.textContent = value.inBasket ? 'Удалить из корзины' : 'В корзину';
        this.buttonElement.disabled = false;
    }
}