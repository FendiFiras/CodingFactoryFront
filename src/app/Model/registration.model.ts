import { User } from "./user.model";
import { Event as EventModel } from "./event.model";

export interface Registration {
    idRegistration: number;
    registrationDate: string;
    confirmation: boolean;
    user?:User;
    event?:EventModel;

  }
  