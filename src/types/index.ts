export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(
        uri: string,
        data: object,
        method?: ApiPostMethods,
    ): Promise<T>;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export type ValidationErrors = Partial<Record<keyof IBuyer, string>>;

export type TPayment = 'card' | 'cash';

export interface IBuyer {
    payment: TPayment | null;
    email: string;
    phone: string;
    address: string;
}

export interface IProductResponse {
    items: IProduct[];
    total: number;
}


export interface IOrderData {
    payment: TPayment;
    address: string;
    email: string;
    phone: string;
    items: string[];
    total: number; 
}

export interface IOrderResponse {
    id: string;
    total: number;
}

export interface ICardGeneral {
    id: string;
    title: string;
    price: number | null;
}

export interface ICardCatalog extends ICardGeneral {
    category: string;
    image: string;
}

export interface ICardPreview extends ICardGeneral {
    image: string;
    category: string;
    description: string;
    inBasket?: boolean;
}