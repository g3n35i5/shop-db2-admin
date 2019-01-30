export interface Replenishment {
  id: number;
  product_id: number;
  amount: number;
  total_price: number;
  revoked: boolean;
}
