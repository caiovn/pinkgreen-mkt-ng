import OrderStatus from '../enums/order-status.enum';
import Sku from './sku.model';
import { Address, CustomerData, ShippingData } from './user.model';

export default interface Order {
  id: string;
  status: OrderStatus;
  customerData: CustomerData;
  shippingData: ShippingData;
  productList: Array<Sku>;
  paymentData: {
    amount: number;
    paymentMethod: string;
    paymentAddress: Address;
  };
  createdAt: string;
  updatedAt: string;
}
