import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface IBaseForm {
    errors: string[];
}

export class BaseForm extends Component<IBaseForm> {
    protected errorElement: HTMLElement;
    protected submitButton: HTMLButtonElement;

    constructor(container: HTMLFormElement) {
        super(container);
        this.errorElement = ensureElement<HTMLElement>('.form__errors', container);
        this.submitButton = ensureElement<HTMLButtonElement>('.button[type="submit"]', container);
    }

    set errors(value: string[]) {
        this.errorElement.textContent = value.join('; ');
        this.submitButton.disabled = value.length > 0;
    }
}