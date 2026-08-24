import { TPayment, IBuyer } from '../../types';
import { ValidationErrors } from '../../types';
import { IEvents } from '../base/Events';

export class Customer {
    private payment: TPayment | null = null;
    private address: string = '';
    private phone: string = '';
    private email: string = '';

    constructor(private events: IEvents) {}

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.address !== undefined) this.address = data.address;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.email !== undefined) this.email = data.email;
        this.events.emit('customer:changed');
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email,
        };
    }

    clear(): void {
        this.payment = null;
        this.address = '';
        this.phone = '';
        this.email = '';
        this.events.emit('customer:changed');
    }

    valideData(): ValidationErrors {
        const errors: ValidationErrors = {};
        if (!this.payment) errors.payment = 'Выберите способ оплаты';
        if (!this.address.trim()) errors.address = 'Укажите адрес';
        if (!this.phone.trim()) errors.phone = 'Укажите телефон';
        if (!this.email.trim()) errors.email = 'Укажите email';
        return errors;
    }
}