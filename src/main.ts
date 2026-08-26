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

import { TPayment } from './types';

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
const productDetail = new ProductDetail(cloneTemplate('#card-preview'), events);


function updateBasketView() {
    const items = basket.getItems();
    const listItems = items.map((item, index) => {
        const cartItem = new CardItem(
            cloneTemplate('#card-basket'),
            () => {
                basket.removeItem(item.id);
            }
        );
        cartItem.data = {
            ...item,
            index: index + 1
        };
        return cartItem.render();
    });
    basketView.data = {
        list: listItems,
        totalPrice: basket.getTotalPrice(),
        canOrder: basket.getNum() > 0
    };
    header.counter = basket.getNum();
}


function updateOrderForm() {
    const currentData = customer.getData();
    const errors = customer.validateOrderData();

    orderForm.data = {
        address: currentData.address || '',
        payment: currentData.payment
    };

    const orderErrors: string[] = [];
    if (errors.payment) orderErrors.push(errors.payment);
    if (errors.address) orderErrors.push(errors.address);
    orderForm.errors = orderErrors;
}

function updateContactForm() {
    const currentData = customer.getData();
    const errors = customer.validateContactData();

    contactForm.data = {
        phone: currentData.phone || '',
        email: currentData.email || ''
    };

    const contactErrors: string[] = [];
    if (errors.phone) contactErrors.push(errors.phone);
    if (errors.email) contactErrors.push(errors.email);
    contactForm.errors = contactErrors;
}



events.on('catalog:changed', () => {
    const products = catalog.getItems();
    const cards = products.map((product) => {
        const card = new ProductCard(
            cloneTemplate('#card-catalog'),
            () => {
                catalog.setSelected(product);
            }
        );
        card.data = product;
        return card.render();
    });
    gallery.catalog = cards;
});

events.on('basket:changed', () => {
    updateBasketView();
});

events.on('catalog:selectedChanged', () => {
    const product = catalog.getSelected();
    if (!product) return;
    const inBasket = basket.hasItem(product.id);
    productDetail.data = { ...product, inBasket };
    modal.open(productDetail.render());
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
    modal.open(basketView.render());
});

events.on('basket:submit', () => {
    updateOrderForm();
    modal.open(orderForm.render());
});


events.on('customer:changed', () => {
    updateOrderForm();
    updateContactForm();
});


events.on('order:payment', (data: { payment: TPayment }) => {
    customer.setData({ payment: data.payment });
});

events.on('order:address', (data: { address: string }) => {
    customer.setData({ address: data.address });
});

events.on('order:submit', () => {
    const errors = customer.validateOrderData();
    if (Object.keys(errors).length === 0) {
        updateContactForm();
        modal.open(contactForm.render());
    } else {
        updateOrderForm();
        const orderErrors: string[] = [];
        if (errors.payment) orderErrors.push(errors.payment);
        if (errors.address) orderErrors.push(errors.address);
        orderForm.errors = orderErrors;
    }
});


events.on('contacts:phone', (data: { phone: string }) => {
    customer.setData({ phone: data.phone });
});

events.on('contacts:email', (data: { email: string }) => {
    customer.setData({ email: data.email });
});

events.on('contacts:submit', () => {
    const errors = customer.validateContactData();
    if (Object.keys(errors).length === 0) {
        const currentData = customer.getData();
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
    } else {
        updateContactForm();
        const contactErrors: string[] = [];
        if (errors.phone) contactErrors.push(errors.phone);
        if (errors.email) contactErrors.push(errors.email);
        contactForm.errors = contactErrors;
    }
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
    } catch (error) {
        console.error('Ошибка загрузки каталога:', error);
    }
}

init();