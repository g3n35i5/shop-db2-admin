import {Replenishment} from './replenishment';

export interface ReplenishmentCollection {
  id: number;
  timestamp: Date;
  admin_id: number;
  revoked: boolean;
  comment: string;
  replenishments: Replenishment[];
  price: number;
}
