import { Event as EventModel } from "./event.model";
import { User } from "./user";

export interface FeedBackEvent {
    idFeedback: number;
    rating: number;
    comments: string;
    feedbackDate?: Date;
    event?:EventModel;
    user?:User;
  }
  