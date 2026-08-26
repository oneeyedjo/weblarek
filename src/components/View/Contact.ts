import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { BaseForm } from './BaseForm';

interface IContact {
    phone: string;
    email: string;
}

export class Contact extends BaseForm {
    private phoneInput: HTMLInputElement;
    private emailInput: HTMLInputElement;

    constructor(container: HTMLFormElement, private events: IEvents) {
        super(container);
        this.phoneInput = ensureElement<HTMLInputElement>('.form__input[name="phone"]', container);
        this.emailInput = ensureElement<HTMLInputElement>('.form__input[name="email"]', container);

        this.phoneInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;

            this.events.emit('contacts:phone', { phone: target.value });
        });

        this.emailInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;

            this.events.emit('contacts:email', { email: target.value });
        });

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit('contacts:submit');
        });
    }

    set data(value: IContact) {
        this.phoneInput.value = value.phone || '';
        this.emailInput.value = value.email || '';
    }
}