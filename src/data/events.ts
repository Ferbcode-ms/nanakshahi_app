import { NanakshahiDate } from "../types";

export interface Event {
  id: string;
  title: string;
  titlePunjabi: string;
  type: string; // e.g., "festival", "gurpurab", "holiday", etc.
  date: NanakshahiDate;
}

const EVENTS: Event[] = [
  {
    id: "1",
    title: "Vaisakhi",
    titlePunjabi: "ਵੈਸਾਖੀ",
    type: "festival",
    date: { year: 556, month: 2, day: 1, monthName: "Vaisakh" },
  },
  {
    id: "2",
    title: "Guru Nanak Gurpurab",
    titlePunjabi: "ਗੁਰੂ ਨਾਨਕ ਗੁਰਪੁਰਬ",
    type: "gurpurab",
    date: { year: 556, month: 9, day: 7, monthName: "Maghar" },
  },
  // Add more events as needed
];

export function getEventsForDate(date: NanakshahiDate) {
  return EVENTS.filter(
    (event) => event.date.day === date.day && event.date.month === date.month
    // Optionally, match year if your events are year-specific
  );
}
