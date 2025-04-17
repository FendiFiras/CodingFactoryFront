import { Event as EventModel } from "./event.model";
import { LocationEvent } from "./locationEvent.model";

export interface Planning {
    idPlanning: number;
    startDatetime: string;  
    endDatetime: string;
    description: string;
    video: string;
    locationType: string;
    event?:EventModel;
    locationEvent?:LocationEvent;
    

  }
  