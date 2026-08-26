import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { BaseForm } from './BaseForm';
import { TPayment } from '../../types';

interface IOrder {
    address: string;
    payment: TPayment | null;
}

export class Order extends BaseForm {
    private cardButton: HTMLButtonElement;
    private cashButton: HTMLButtonElement;
    private addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, private events: IEvents) {
        super(container);
        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
        this.addressInput = ensureElement<HTMLInputElement>('.form__input[name="address"]', container);

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('✅ 1. Событие submit сработало в Order.ts');
            this.events.emit('order:submit');
        });

        this.cardButton.addEventListener('click', () => {
            this.events.emit('order:payment', { payment: 'card' });
        });

        this.cashButton.addEventListener('click', () => {
            this.events.emit('order:payment', { payment: 'cash' });
        });

        this.addressInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            this.events.emit('order:address', { address: target.value });
        });
    }

    set data(value: IOrder) {
        this.addressInput.value = value.address || '';
        this.cardButton.classList.toggle('button_alt-active', value.payment === 'card');
        this.cashButton.classList.toggle('button_alt-active', value.payment === 'cash');
    }
}