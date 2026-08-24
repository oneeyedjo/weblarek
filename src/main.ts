
import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { AppApi } from './components/api/AppApi';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

import { Catalog } from './components/Modules/Catalog';
import { Basket } from './components/Modules/Basket';
import { Customer } from './components/Modules/Customer';

import { ProductGrid } from './components/View/ProductGrid';
import { Modal } from './components/View/modal';
import { Header } from './components/View/Header';
import { ProductCard } from './components/View/ProductCard';
import { ProductDetail } from './components/View/ProductDetail';
import { CardItem } from './components/View/CardItem';
import { Basket as BasketView } from './components/View/Basket';
import { Order } from './components/View/Order';
import { Contact } from './components/View/Contact';
import { Success } from './components/View/success';

import { IProduct, ICardPreview, TPayment } from './types';


const events = new EventEmitter();
const catalog = new Catalog(events);
const basket = new Basket(events);
const customer = new Customer(events);


const baseApi = new Api(API_URL);
const appApi = new AppApi(baseApi);


const gallery = new ProductGrid(ensureElement('.gallery'));
const modal = new Modal(ensureElement('#modal-container'));
const header = new Header(ensureElement('.header'), events);

const orderForm = new Order(cloneTemplate('#order'), events);
const contactForm = new Contact(cloneTemplate('#contacts'), events);
const successForm = new Success(cloneTemplate('#success'), events);
const basketView = new BasketView(cloneTemplate('#basket'), events);


events.on('catalog:changed', () => {
    const products = catalog.getItems();
    const cards = products.map((product) => {
        const card = new ProductCard(
            cloneTemplate('#card-catalog'),
            () => {
                catalog.setSelected(product);
                events.emit('card:selected', product);
            }
        );
        card.data = product;
        return card.render();
    });
    gallery.catalog = cards;
});

events.on('basket:changed', () => {
    header.counter = basket.getNum();
});

events.on('card:selected', (product: IProduct) => {
    const detail = new ProductDetail(cloneTemplate('#card-preview'), events);
    const inBasket = basket.hasItem(product.id);
    const previewData: ICardPreview = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        description: product.description,
        inBasket: inBasket
    };
    detail.data = previewData;
    modal.open(detail.render());
});

events.on('preview:submit', () => {
    const selected = catalog.getSelected();
    if (!selected) return;
    if (basket.hasItem(selected.id)) {
        basket.removeItem(selected.id);
    } else {
        basket.addItem(selected);
    }
    modal.close();
});

events.on('basket:open', () => {
    const items = basket.getItems();
    const listItems = items.map((item, index) => {
        const cartItem = new CardItem(
            cloneTemplate('#card-basket'),
            () => {
                basket.removeItem(item.id);
                events.emit('basket:open');
            }
        );
        cartItem.data = item;
        cartItem.index = index + 1;
        return cartItem.render();
    });
    basketView.data = {
        list: listItems,
        totalPrice: basket.getTotalPrice(),
        canOrder: basket.getNum() > 0
    };
    modal.open(basketView.render());
});

events.on('basket:submit', () => {
    const currentData = customer.getData();
    orderForm.data = {
        address: currentData.address || '',
        payment: currentData.payment
    };
    orderForm.errors = [];
    modal.open(orderForm.render());
});

events.on('order:payment', (data: { payment: TPayment }) => {
    customer.setData({ payment: data.payment });
    updateOrderForm();
});

events.on('order:address', (data: { address: string }) => {
    customer.setData({ address: data.address });
    updateOrderForm();
});

function updateOrderForm() {
    const currentData = customer.getData();
    orderForm.data = {
        address: currentData.address || '',
        payment: currentData.payment
    };
    const hasPayment = !!currentData.payment;
    const hasAddress = currentData.address.trim() !== '';
    if (hasPayment && hasAddress) {
        orderForm.errors = [];
    } else {
        const errors: string[] = [];
        if (!hasPayment) errors.push('Выберите способ оплаты');
        if (!hasAddress) errors.push('Укажите адрес');
        orderForm.errors = errors;
    }
}

events.on('order:submit', () => {
    const currentData = customer.getData();
    const hasPayment = !!currentData.payment;
    const hasAddress = currentData.address.trim() !== '';

    if (hasPayment && hasAddress) {
        contactForm.data = {
            phone: currentData.phone || '',
            email: currentData.email || ''
        };
        contactForm.errors = [];
        modal.open(contactForm.render());
    } else {
        const errors: string[] = [];
        if (!hasPayment) errors.push('Выберите способ оплаты');
        if (!hasAddress) errors.push('Укажите адрес');
        orderForm.errors = errors;
    }
});

events.on('contacts:phone', (data: { phone: string }) => {
    customer.setData({ phone: data.phone });
    updateContactForm();
});

events.on('contacts:email', (data: { email: string }) => {
    customer.setData({ email: data.email });
    updateContactForm();
});

function updateContactForm() {
    const currentData = customer.getData();
    contactForm.data = {
        phone: currentData.phone || '',
        email: currentData.email || ''
    };
    const hasPhone = currentData.phone.trim() !== '';
    const hasEmail = currentData.email.trim() !== '';
    if (hasPhone && hasEmail) {
        contactForm.errors = [];
    } else {
        const errors: string[] = [];
        if (!hasPhone) errors.push('Укажите телефон');
        if (!hasEmail) errors.push('Укажите email');
        contactForm.errors = errors;
    }
}

events.on('contacts:submit', () => {
    const currentData = customer.getData();
    const hasPhone = currentData.phone.trim() !== '';
    const hasEmail = currentData.email.trim() !== '';

    if (!hasPhone || !hasEmail) {
        const errors: string[] = [];
        if (!hasPhone) errors.push('Укажите телефон');
        if (!hasEmail) errors.push('Укажите email');
        contactForm.errors = errors;
        return;
    }

    const orderData = {
        payment: currentData.payment!,
        address: currentData.address,
        email: currentData.email,
        phone: currentData.phone,
        items: basket.getItems().map(item => item.id),
        total: basket.getTotalPrice() 
    };


    appApi.postOrder(orderData)
        .then(response => {
            successForm.total = response.total;
            modal.open(successForm.render());
            basket.clear();
            customer.clear();
        })
        .catch(error => {
            console.error('Ошибка заказа:', error);
        });
});

events.on('success:close', () => {
    modal.close();
});


async function init() {
    try {
        const response = await appApi.getProducts();
        const productsWithImages = response.items.map(product => ({
            ...product,
            image: product.image ? CDN_URL + product.image : ''
        }));
        catalog.setItems(productsWithImages);
        console.log(' Загружено товаров:', productsWithImages.length);
    } catch (error) {
        console.error(' Ошибка загрузки каталога:', error);
    }
}

init();