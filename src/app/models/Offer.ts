import { Partnership } from "./Partnership";

export interface Offer {
    idOffer: number;
    title: string;
    description: string;
    requiredSkill: string;
    duration: string;
    location: string;
  appnmbr : number;
    employmentType: string;
    jobResponsibilities: string;
    whatWeOffer: string;
    idPartnership: number; // ID of the associated partnership

    partnership?: Partnership; // Optional, if you have a Partnership model
  }