import { Api } from "../components/base/Api";
import { IProductResponse, IOrderData, IOrderResponse } from "../types/index";
import { IApi } from "../types"

export class AppApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProductResponse> {
    return this.api.get<IProductResponse>("/product/");
  }

  postOrder(order: IOrderData): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>("/order/", order);
  }
}
