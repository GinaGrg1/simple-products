export interface IProduct{
    productId: number,
    productName: string,
    productCode: string,
    releaseDate: string,
    description: string,
    price: number,
    starRating: number,
    imageUrl: string
}

export interface IProductsDisplay {
    id: number;
    productName: string,
    productCode?: string,
    description?: string,
    price?: number;
    categoryId?: number;
    category?: string,
    quantityInStock?: number;
    searchKey?: string[],
    supplierIds?: number[]
}

export interface IProductSupply {
    id: number;
    productName: string;
    productCode?: string;
    description?: string;
    price?: number;
    categoryId?: number;
    category?: string;
    quantityInStock?: number;
    searchKey?: string[];
    supplierIds?: number[];
  }

export interface ISupplier {
    id: number;
    name: string;
    cost: number;
    minQuantity: number;
}