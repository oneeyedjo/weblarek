import { IOrderResponse, IOrderData, IApi, IProductResponse } from '../../types';

export class AppApi {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    getProducts(): Promise<IProductResponse> {
        return this.api.get('/product/');
    }

    postOrder(data: IOrderData): Promise<IOrderResponse> {
        return this.api.post('/order/', data, 'POST');
    }
}