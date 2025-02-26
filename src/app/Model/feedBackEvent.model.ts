import { User } from "./user.model";
import { Event as EventModel } from "./event.model";

export interface FeedBackEvent {
    idFeedback: number;
    rating: number;
    comments: string;
    feedbackDate?: Date;
    event?:EventModel;
    user?:User;
  }
  