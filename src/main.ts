import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { AppApi } from './components/api/AppApi';
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

// Модели 
import { Catalog } from './components/Modules/Catalog';
import { Basket } from './components/Modules/Basket';
import { Customer } from './components/Modules/Customer';

// View
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

// Типы
import { IProduct, ICardPreview, TPayment } from './types';

//данные
import { apiProducts } from './utils/data';


const events = new EventEmitter();


const catalog = new Catalog(events);
const basket = new Basket(events);
const customer = new Customer(events);


const baseApi = new Api(API_URL);
const appApi = new AppApi(baseApi);


const gallery = new ProductGrid(ensureElement('.gallery'));
const modal = new Modal(ensureElement('#modal-container'));
const header = new Header(ensureElement('.header'), events);




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
    const detail = new ProductDetail(
        cloneTemplate('#card-preview'),
        events
    );
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
    const basketView = new BasketView(
        cloneTemplate('#basket'),
        events
    );
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
    const orderForm = new Order(
        cloneTemplate('#order'),
        events
    );
    const currentData = customer.getData();
    orderForm.data = {
        address: currentData.address || '',
        payment: currentData.payment
    };
    modal.open(orderForm.render());
});


events.on('order:payment', (data: { payment: TPayment }) => {
    customer.setData({ payment: data.payment });
});


events.on('order:address', (data: { address: string }) => {
    customer.setData({ address: data.address });
});


events.on('order:submit', () => {
    const errors = customer.valideData();
    if (Object.keys(errors).length === 0) {
        const contactForm = new Contact(
            cloneTemplate('#contacts'),
            events
        );
        const data = customer.getData();
        contactForm.data = {
            phone: data.phone || '',
            email: data.email || ''
        };
        modal.open(contactForm.render());
    } else {
        console.warn('Ошибки формы заказа:', errors);
    }
});


events.on('contacts:phone', (data: { phone: string }) => {
    customer.setData({ phone: data.phone });
});

events.on('contacts:email', (data: { email: string }) => {
    customer.setData({ email: data.email });
});


events.on('contacts:submit', () => {
    const errors = customer.valideData();
    if (Object.keys(errors).length === 0) {
        const orderData = {
            payment: customer.getData().payment!,
            address: customer.getData().address,
            email: customer.getData().email,
            phone: customer.getData().phone,
            items: basket.getItems().map(item => item.id)
        };
        appApi.postOrder(orderData)
            .then(response => {
                const success = new Success(
                    cloneTemplate('#success'),
                    events
                );
                success.total = response.total;
                modal.open(success.render());
                basket.clear();
                customer.clear();
            })
            .catch(error => {
                console.error('Ошибка заказа:', error);
            });
    } else {
        console.warn('Ошибки контактов:', errors);
    }
});


events.on('success:close', () => {
    modal.close();
});


async function init() {
    try {
        catalog.setItems(apiProducts.items);
        console.log(' Данные загружены:', apiProducts.items.length, 'товаров');
    } catch (error) {
        console.error('Ошибка загрузки', error);
    }
}

init()