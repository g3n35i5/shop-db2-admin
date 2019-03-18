export interface Stocktaking {
  id?: number;
  product_id: number;
  count: number;
}

export interface StocktakingCollection {
  id?: number;
  admin_id: number;
  revoked: boolean;
  stocktakings: Stocktaking[];
  timestamp: Date;
}
