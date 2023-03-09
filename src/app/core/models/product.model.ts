import Brand from './brand.model';
import Category from './category.model';

export default interface Product {
  active?: boolean;
  brand?: Brand;
  categories?: Array<Category>;
  id: number;
  skuCode?: string;
  mainImageUrl: string;
  name: string;
  price: number;
}
