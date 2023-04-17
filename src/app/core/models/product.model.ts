import Brand from './brand.model';
import Category from './category.model';

export default interface Product {
  active?: boolean;
  brand?: Brand;
  categories?: Array<Category>;
  id?: number;
  skuCode?: string;
  mainImageUrl: string;
  name: string;
  price: number;
  quantity?: number;
}

export const PaymentMethods: Record<string, string> = {
  CREDIT_CARD: 'Cartão de crédito',
  DEBIT_CARD: 'Cartão de débito',
  BANK_SLIP: 'Boleto',
};
