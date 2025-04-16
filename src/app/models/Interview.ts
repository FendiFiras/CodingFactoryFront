import { Application } from "./Application";

export interface Interview {
  id?: number;
  application: Application;
  interviewDate: string;  // ISO date format (YYYY-MM-DD)
  interviewTime: string;  // ISO time format (HH:mm:ss)
}