import OrderStatus from '../enums/order-status.enum';
import Sku from './sku.model';
import { Address, CustomerData, ShippingData } from './user.model';

interface OrderProductList extends Omit<Sku, 'price'> {
  price: number;
}

export default interface Order {
  id: string;
  status: OrderStatus;
  customerData: CustomerData;
  shippingData: ShippingData;
  productList: Array<OrderProductList>;
  paymentData: {
    amount: number;
    paymentMethod: string;
    paymentAddress: Address;
    paymentProperties: {
      document: string;
      email: string;
      last4: string;
      ownerName: string;
      phone: string;
      validationDate: string;
    };
  };
  history: {
    status: string;
    orderId: number;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export const ORDER_STATUS_TEXT: Record<string, string> = {
  ORDER_CANCELED: 'Pedido cancelado',
  ORDER_SHIPPED: 'Pedido entregue',
  ORDER_EN_ROUTE: 'Pedido em rota de entrega',
  ORDER_IN_SEPARATION: 'Pedido em separação',
  ORDER_STOCK_FAILED: 'Falha na reserva de estoque',
  ORDER_STOCK_RESERVED: 'Estoque reservado',
  PAYMENT_CONFIRMED: 'Pagamento confirmado',
  ORDER_CREATED: 'Pedido criado ',
}
