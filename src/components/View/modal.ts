import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    private closeButton: HTMLButtonElement;
    private contentElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this.contentElement = ensureElement<HTMLElement>('.modal__content', container);

        this.closeButton.addEventListener('click', () => this.close());
        container.addEventListener('click', (e) => {
            if (e.target === container) this.close();
        });
    }

    open(content: HTMLElement): void {
        this.contentElement.replaceChildren(content);
        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.contentElement.innerHTML = '';
    }

    set content(value: HTMLElement) {
        this.open(value);
    }
}