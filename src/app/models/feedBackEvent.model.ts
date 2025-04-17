import { Event as EventModel } from "./event.model";
import { User } from "./User";

export interface FeedBackEvent {
    idFeedback: number;
    rating: number;
    comments: string;
    feedbackDate?: Date;
    event?:EventModel;
    user?:User;
  }
  