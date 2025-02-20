export class BanLog {
    idBan?: number;
  banDuration?: Date;
  banReason?: string;
  status?: Status;
  
}
export enum Status {
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED'
  }
