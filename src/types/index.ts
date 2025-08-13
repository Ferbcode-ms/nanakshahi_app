export interface NanakshahiDate {
  year: number;
  month: number;
  day: number;
  monthName: string;
  dayName?: string;
}

export interface GregorianDate {
  year: number;
  month: number;
  day: number;
  monthName: string;
  dayName?: string;
}

export interface Event {
  id: string;
  title: string;
  titlePunjabi: string;
  date: NanakshahiDate;
  type:
    | "gurpurab"
    | "festival"
    | "historical"
    | "seasonal"
    | "personal"
    | "shahidi"
    | "joti-jot";
  category:
    | "major"
    | "minor"
    | "personal"
    | "religious"
    | "historical"
    | "cultural";
  priority: "high" | "medium" | "low" | "highest";
  description?: string;
  descriptionPunjabi?: string;
  significance?: string;
  significancePunjabi?: string;
  color: string;
  icon?: string;
  isRecurring?: boolean;
  gregorianDate?: GregorianDate;
}

export interface CalendarEvent {
  id: string;
  title: string;
  titlePunjabi: string;
  date: NanakshahiDate;
  type: "gurpurab" | "event" | "holiday";
  description?: string;
  descriptionPunjabi?: string;
}

export interface AppSettings {
  language: "en" | "pa";
  theme: "light" | "dark";
}

export interface MonthData {
  month: number;
  monthName: string;
  monthNamePunjabi: string;
  days: number;
  startDate: NanakshahiDate;
  endDate: NanakshahiDate;
}

export type RootStackParamList = {
  Home: undefined;
  Calendar: undefined;
  Converter: undefined;
  Events: undefined;
  Settings: undefined;
};
