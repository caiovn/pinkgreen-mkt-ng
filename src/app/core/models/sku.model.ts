import Product from './product.model';

export interface SkuAttributes {
  label: string;
  type: string;
  value: string;
}

export default interface Sku {
  active?: boolean,
  skuCode: string;
  name: string;
  stockQuantity: number;
  quantity?: number;
  height: number;
  width: number;
  length: number;
  relatedSkus?: Array<Product>;
  weight: number;
  mainImageUrl: string;
  urlImages: Array<string>;
  skuAttributes: Array<SkuAttributes>;
  product: Product;
  price: {
    listPrice: number;
    salePrice?: number;
    startDate?: Date;
    endDate?: Date;
  };
}
