export interface Rating {
  average: number;
  count: number;
  data: {
    id: number;
    orderId: number;
    customer: {
      id: string;
      name: string;
      lastname: string;
    };
    skuCode: string;
    stars: number;
    title: string;
    evaluation: string;
    createdAt: string;
  }[];
}

export interface ProductDetailsRating {
  ratingFilled: boolean;
  id: number;
  orderId: number;
  customer: {
    id: string;
    name: string;
    lastname: string;
  };
  skuCode: string;
  stars: number;
  title: string;
  evaluation: string;
  createdAt: string;
}
