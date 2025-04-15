import { EventType } from './eventType.enum';

export class Event {
  idEvent: number = 0;
  title: string = '';
  description: string = '';
  startDate?: string;
  endDate?: string;
  location: string = '';
  maxParticipants: number = 0;
  registrationDeadline?: string;
  price: number = 0;
  imageUrl: string = '';
  videoUrl: string = '';
  eventType: string = '';
}
