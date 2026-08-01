/* import './scss/styles.scss'; */

import Catalog from './components/Modules/Catalog';
import Basket from './components/Modules/Basket';
import Customer from './components/Modules/Customer';

import { API_URL } from './utils/constants'

import { apiProducts } from './utils/data';

// 1. СОЗДАЁМ ЭКЗЕМПЛЯРЫ

const catalog = new Catalog();
const basket = new Basket();
const customer = new Customer();

// 2. ПРОВЕРКА КАТАЛОГА

console.log('1. ПРОВЕРКА КАТАЛОГА');

catalog.setItems(apiProducts.items);
console.log('Товары сохранены в каталог');

console.log('Все товары:', catalog.getItems());

// Берём первый товар из списка 
const allItems = catalog.getItems();
const firstProduct = allItems[0];
console.log('Первый товар:', firstProduct);

if (firstProduct) {
    catalog.setSelected(firstProduct);
    console.log('Выбранный товар:', catalog.getSelected());
}

// 3. ПРОВЕРКА КОРЗИНЫ

console.log('2. ПРОВЕРКА КОРЗИНЫ');

if (firstProduct) {
    basket.addItem(firstProduct);
    console.log('Товар добавлен в корзину');
}

console.log('Корзина:', basket.getItems());
console.log('Количество товаров:', basket.getNum());
console.log('Общая стоимость:', basket.getTotalPrice());

// Проверяем наличие товара
if (firstProduct) {
    console.log('Есть ли товар в корзине?', basket.hasItem(firstProduct.id));
}

// Добавляем второй товар
const secondProduct = allItems[1];
if (secondProduct) {
    basket.addItem(secondProduct);
    console.log('Второй товар добавлен');
}

console.log('Корзина после добавления второго:', basket.getItems());
console.log('Количество товаров:', basket.getNum());
console.log('Общая стоимость:', basket.getTotalPrice());

// Удаляем первый товар
if (firstProduct) {
    basket.removeItem(firstProduct.id);
    console.log('Первый товар удалён');
}

console.log('Корзина после удаления:', basket.getItems());

// Очищаем корзину
basket.clear();
console.log('Корзина очищена');
console.log('Корзина после очистки:', basket.getItems());

// 4. ПРОВЕРКА ПОКУПАТЕЛЯ

console.log('3. ПРОВЕРКА ПОКУПАТЕЛЯ');

customer.setData({
    payment: 'card',
    address: 'ул. Пушкина, д. 1',
    phone: '+7 999 99 99 99',
    email: '999@mail.com'
});
console.log('Данные покупателя сохранены');
console.log('Данные покупателя:', customer.getData());

console.log('Результат валидации:', customer.valideData());
console.log('Все поля валидны?', Object.keys(customer.valideData()).length === 0);

// 5. ОЧИСТКА ДАННЫХ ПОКУПАТЕЛЯ

console.log('4. ОЧИСТКА ДАННЫХ ПОКУПАТЕЛЯ');

customer.clear();
console.log('Данные покупателя очищены');
console.log('Данные после очистки:', customer.getData());

// 6. ПРОВЕРКА ВАЛИДАЦИИ С ОШИБКАМИ

console.log('5. ПРОВЕРКА ВАЛИДАЦИИ С ОШИБКАМИ');

const customer2 = new Customer();
console.log('Ошибки при пустом покупателе:', customer2.valideData());

customer2.setData({
    payment: 'card',
    address: '   '
});
console.log('Ошибки с пробелами в адресе:', customer2.valideData());


// 7. Работа с сервером 

import { Api } from './components/base/Api';
import { AppApi } from './components/AppApi';

const baseApi = new Api(API_URL);
const appApi = new AppApi(baseApi);

async function loadProducts() {
    try {
        const response = await appApi.getProducts();
        catalog.setItems(response.items);
        console.log('Каталог после загрузки с сервера:', catalog.getItems());
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
    }
}

loadProducts();