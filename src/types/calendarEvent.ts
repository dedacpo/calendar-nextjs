import { Timestamp } from "firebase/firestore";

export type CalendarEvent = {
  id: string;
  cityName: string;
  date: Date;
  lat: number;
  lng: number;
  temperatureMax: number;
  temperatureMin: number;
  title: string;
  weatherDescr: string;
  weatherIcon: string;
  weatherId: number;
  weatherMain: string;
};
