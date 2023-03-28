export interface CustomerData {
  id: string;
  document: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Client {
  name: string;
  surname: string;
  cpf: string;
  email: string;
  telephone: string;
  address: Address;
}

export interface User {
  customerId: string;
  name: string;
  given_name: string;
  family_name: string;
  email: string;
  document: string;
  telephone: string;
}

export interface ShippingData {
  freightPrice: number;
  deliveryDays: number;
  address: Address;
}

export interface Address {
  country: string;
  zipCode: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  city: string;
  state: string;
  phone: string;
}

export interface Billing {
  paymentMethod: string;
  creditCard: {
    name: string;
    number: string;
    cvv: string;
    expDate: string;
  };
  address: Address;
}

export interface PaymentData {
  paymentMethod: string;
  paymentMethodProperties: {
    cardNumber?: string;
    cvv?: string;
    validationDate?: string;
    document: string;
    ownerName: string;
    birthday?: string;
    phone: string;
    email: string;
  };
  paymentAddress: Address;
}
