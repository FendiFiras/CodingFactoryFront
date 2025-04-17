import { User } from "./User";

export class BanLog {
    idBan?: number;
  banDuration?: Date;
  banReason?: string;
  status?: Status;
  user: User = new User();
  
}
export enum Status {
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    CANCELLED='CANCELLED'
  }
