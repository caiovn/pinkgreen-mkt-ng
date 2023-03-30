import Product from './product.model';

export default interface Sku {
  skuCode: string;
  name: string;
  stockQuantity: number;
  quantity?: number;
  height: number;
  width: number;
  length: number;
  relatedSkus: Array<Product>;
  weight: number;
  mainImageUrl: string;
  urlImages: Array<string>;
  product: Product;
  price: {
    listPrice: number;
    salePrice?: number;
    startDate?: Date;
    endDate?: Date;
  };
  skuAttributes: Array<{ label: string; type: string; value: string }>;
}
