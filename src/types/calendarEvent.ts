import { Timestamp } from "firebase/firestore";

export type CalendarEvent = {
  id: string;
  cityName: string;
  cityIndex: number;
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
