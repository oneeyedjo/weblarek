import { Api } from "../components/base/Api";
import { IProductResponse, IOrderData, IOrderResponse } from "../types/index";

export class AppApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  getProducts(): Promise<IProductResponse> {
    return this.api.get<IProductResponse>("/product/");
  }

  postOrder(order: IOrderData): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>("/order/", order);
  }
}
