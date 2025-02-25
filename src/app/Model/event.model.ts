import { EventType } from './eventType.enum';

export class Event {
  idEvent: number = 0;
  title: string = '';
  description: string = '';
  startDate?: Date;
  endDate?: Date;
  location: string = '';
  maxParticipants: number = 0;
  registrationDeadline?: Date;
  price: number = 0;
  imageUrl: string = '';
  videoUrl: string = '';
  eventType: string = '';
}
