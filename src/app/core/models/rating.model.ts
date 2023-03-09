export interface IRating {
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
