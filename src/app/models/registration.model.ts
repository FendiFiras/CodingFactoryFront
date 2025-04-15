import { Event as EventModel } from "./event.model";
import { User } from "./user";

export interface Registration {
    idRegistration: number;
    registrationDate: string;
    confirmation: boolean;
    user?:User;
    event?:EventModel;

  }
  