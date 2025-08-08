import { NanakshahiDate, GregorianDate } from "../types";

// Nanakshahi calendar starts from 1469 CE (Guru Nanak's birth year)
const NANAKSHAHI_EPOCH = 1469;

// Nanakshahi months (Chet to Phagan)
export const NANAKSHAHI_MONTHS = [
  { number: 1, name: "Chet", namePunjabi: "ਚੇਤ", days: 31 },
  { number: 2, name: "Vaisakh", namePunjabi: "ਵੈਸਾਖ", days: 31 },
  { number: 3, name: "Jeth", namePunjabi: "ਜੇਠ", days: 31 },
  { number: 4, name: "Harh", namePunjabi: "ਹਾੜ", days: 31 },
  { number: 5, name: "Sawan", namePunjabi: "ਸਾਵਣ", days: 31 },
  { number: 6, name: "Bhadon", namePunjabi: "ਭਾਦੋਂ", days: 30 },
  { number: 7, name: "Assu", namePunjabi: "ਅੱਸੂ", days: 30 },
  { number: 8, name: "Katik", namePunjabi: "ਕੱਤਕ", days: 30 },
  { number: 9, name: "Maghar", namePunjabi: "ਮੱਘਰ", days: 30 },
  { number: 10, name: "Poh", namePunjabi: "ਪੋਹ", days: 30 },
  { number: 11, name: "Magh", namePunjabi: "ਮਾਘ", days: 30 },
  { number: 12, name: "Phagan", namePunjabi: "ਫੱਗਣ", days: 30 },
];

// Day names
export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const DAY_NAMES_PUNJABI = [
  "ਐਤਵਾਰ",
  "ਸੋਮਵਾਰ",
  "ਮੰਗਲਵਾਰ",
  "ਬੁੱਧਵਾਰ",
  "ਵੀਰਵਾਰ",
  "ਸ਼ੁੱਕਰਵਾਰ",
  "ਸ਼ਨੀਵਾਰ",
];

// Nanakshahi calendar conversion rules
// Based on the actual Nanakshahi calendar system
const NANAKSHAHI_START_DATES = [
  { month: 3, day: 14 }, // Chet starts on March 14
  { month: 4, day: 13 }, // Vaisakh starts on April 13
  { month: 5, day: 14 }, // Jeth starts on May 14
  { month: 6, day: 15 }, // Harh starts on June 15 (FIXED)
  { month: 7, day: 16 }, // Sawan starts on July 16 (FIXED)
  { month: 8, day: 16 }, // Bhadon starts on August 16 (FIXED)
  { month: 9, day: 17 }, // Assu starts on September 17 (FIXED)
  { month: 10, day: 17 }, // Katik starts on October 17 (FIXED)
  { month: 11, day: 17 }, // Maghar starts on November 17 (FIXED)
  { month: 12, day: 18 }, // Poh starts on December 18 (FIXED)
  { month: 1, day: 17 }, // Magh starts on January 17 (FIXED)
  { month: 2, day: 17 }, // Phagan starts on February 17 (FIXED)
];

// Convert Gregorian date to Nanakshahi date
export function gregorianToNanakshahi(date: Date): NanakshahiDate {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  let nanakshahiYear = year - NANAKSHAHI_EPOCH + 1;
  let nanakshahiMonth = 1;
  let nanakshahiDay = 1;

  // Handle special case for dates before Chet 1 (March 14)
  if (month === 1 || month === 2 || (month === 3 && day < 14)) {
    nanakshahiYear--;
    nanakshahiMonth = 12; // Phagan
    const lastYearEnd = new Date(year - 1, 11, 31);
    const daysDiff = Math.floor(
      (date.getTime() - lastYearEnd.getTime()) / (1000 * 60 * 60 * 24)
    );
    nanakshahiDay = 30 + daysDiff; // Phagan has 30 days
  } else {
    // Find the Nanakshahi month based on Gregorian date
    for (let i = 0; i < NANAKSHAHI_START_DATES.length; i++) {
      const startDate = NANAKSHAHI_START_DATES[i];
      const nextStartDate = NANAKSHAHI_START_DATES[(i + 1) % 12];

      let currentMonthStart = new Date(
        year,
        startDate.month - 1,
        startDate.day
      );
      let nextMonthStart = new Date(
        year,
        nextStartDate.month - 1,
        nextStartDate.day
      );

      // Handle year boundary
      if (nextStartDate.month < startDate.month) {
        nextMonthStart = new Date(
          year + 1,
          nextStartDate.month - 1,
          nextStartDate.day
        );
      }

      if (date >= currentMonthStart && date < nextMonthStart) {
        nanakshahiMonth = i + 1;
        const daysDiff = Math.floor(
          (date.getTime() - currentMonthStart.getTime()) / (1000 * 60 * 60 * 24)
        );
        nanakshahiDay = daysDiff + 1;
        break;
      }
    }
  }

  const monthData = NANAKSHAHI_MONTHS.find((m) => m.number === nanakshahiMonth);

  return {
    year: nanakshahiYear,
    month: nanakshahiMonth,
    day: nanakshahiDay,
    monthName: monthData?.name || "",
    dayName: DAY_NAMES[date.getDay()],
  };
}

// Convert Nanakshahi date to Gregorian date
export function nanakshahiToGregorian(
  nanakshahiDate: NanakshahiDate
): GregorianDate {
  const nanakshahiYear = nanakshahiDate.year;
  const nanakshahiMonth = nanakshahiDate.month;
  const nanakshahiDay = nanakshahiDate.day;

  let gregorianYear = nanakshahiYear + NANAKSHAHI_EPOCH - 1;
  let gregorianMonth = 1;
  let gregorianDay = 1;

  // Find the Gregorian month start date for the Nanakshahi month
  const startDate = NANAKSHAHI_START_DATES[nanakshahiMonth - 1];

  if (startDate) {
    gregorianMonth = startDate.month;
    gregorianDay = startDate.day + nanakshahiDay - 1;

    // Adjust for month overflow
    const daysInMonth = new Date(gregorianYear, gregorianMonth, 0).getDate();
    while (gregorianDay > daysInMonth) {
      gregorianDay -= daysInMonth;
      gregorianMonth++;
      if (gregorianMonth > 12) {
        gregorianMonth = 1;
        gregorianYear++;
      }
    }
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return {
    year: gregorianYear,
    month: gregorianMonth,
    day: gregorianDay,
    monthName: monthNames[gregorianMonth - 1] || "",
    dayName:
      DAY_NAMES[
        new Date(gregorianYear, gregorianMonth - 1, gregorianDay).getDay()
      ],
  };
}

// Get current Nanakshahi date
export function getCurrentNanakshahiDate(): NanakshahiDate {
  return gregorianToNanakshahi(new Date());
}

// Get current Gregorian date
export function getCurrentGregorianDate(): GregorianDate {
  const now = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    monthName: monthNames[now.getMonth()],
    dayName: DAY_NAMES[now.getDay()],
  };
}
