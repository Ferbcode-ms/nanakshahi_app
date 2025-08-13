import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // Navigation
      home: "Home",
      calendar: "Calendar",
      converter: "Converter",
      events: "Events",

      // Home Screen
      currentDate: "Current Date",
      nanakshahiDate: "Nanakshahi Date",
      gregorianDate: "Gregorian Date",
      today: "Today",

      // Calendar Screen
      month: "Month",
      year: "Year",
      noEvents: "No events for this day",

      // Converter Screen
      dateConverter: "Date Converter",
      convertFrom: "Convert from",
      convertTo: "Convert to",
      nanakshahi: "Nanakshahi",
      gregorian: "Gregorian",
      convert: "Convert",
      selectDate: "Select Date",

      // Events Screen
      upcomingEvents: "Upcoming Events",
      allEvents: "All Events",
      gurpurab: "Gurpurab",
      holiday: "Holiday",
      event: "Event",

      // Settings
      settings: "Settings",
      language: "Language",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      english: "English",
      punjabi: "Punjabi",

      // Common
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",

      // Months
      chet: "Chet",
      vaisakh: "Vaisakh",
      jeth: "Jeth",
      harh: "Harh",
      sawan: "Sawan",
      bhadon: "Bhadon",
      assu: "Assu",
      katik: "Katik",
      maghar: "Maghar",
      poh: "Poh",
      magh: "Magh",
      phagan: "Phagan",
    },
  },
  pa: {
    translation: {
      // Navigation
      home: "ਹੋਮ",
      calendar: "ਕੈਲੰਡਰ",
      converter: "ਕਨਵਰਟਰ",
      events: "ਇਵੈਂਟਸ",

      // Home Screen
      currentDate: "ਮੌਜੂਦਾ ਤਾਰੀਖ",
      nanakshahiDate: "ਨਾਨਕਸ਼ਾਹੀ ਤਾਰੀਖ",
      gregorianDate: "ਗ੍ਰੇਗੋਰੀਅਨ ਤਾਰੀਖ",
      today: "ਅੱਜ",

      // Calendar Screen
      month: "ਮਹੀਨਾ",
      year: "ਸਾਲ",
      noEvents: "ਇਸ ਦਿਨ ਲਈ ਕੋਈ ਇਵੈਂਟ ਨਹੀਂ",

      // Converter Screen
      dateConverter: "ਤਾਰੀਖ ਕਨਵਰਟਰ",
      convertFrom: "ਇਸ ਤੋਂ ਬਦਲੋ",
      convertTo: "ਇਸ ਵਿੱਚ ਬਦਲੋ",
      nanakshahi: "ਨਾਨਕਸ਼ਾਹੀ",
      gregorian: "ਗ੍ਰੇਗੋਰੀਅਨ",
      convert: "ਬਦਲੋ",
      selectDate: "ਤਾਰੀਖ ਚੁਣੋ",

      // Events Screen
      upcomingEvents: "ਆਉਣ ਵਾਲੇ ਇਵੈਂਟਸ",
      allEvents: "ਸਾਰੇ ਇਵੈਂਟਸ",
      gurpurab: "ਗੁਰਪੁਰਬ",
      holiday: "ਛੁੱਟੀ",
      event: "ਇਵੈਂਟ",

      // Settings
      settings: "ਸੈਟਿੰਗਸ",
      language: "ਭਾਸ਼ਾ",
      theme: "ਥੀਮ",
      light: "ਹਲਕਾ",
      dark: "ਕਾਲਾ",
      english: "ਅੰਗਰੇਜ਼ੀ",
      punjabi: "ਪੰਜਾਬੀ",

      // Common
      loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
      error: "ਗਲਤੀ",
      success: "ਸਫਲ",
      cancel: "ਰੱਦ ਕਰੋ",
      save: "ਸੇਵ ਕਰੋ",
      delete: "ਮਿਟਾਓ",
      edit: "ਸੰਪਾਦਿਤ ਕਰੋ",

      // Months
      chet: "ਚੇਤ",
      vaisakh: "ਵੈਸਾਖ",
      jeth: "ਜੇਠ",
      harh: "ਹਾੜ",
      sawan: "ਸਾਵਣ",
      bhadon: "ਭਾਦੋਂ",
      assu: "ਅੱਸੂ",
      katik: "ਕੱਤਕ",
      maghar: "ਮੱਘਰ",
      poh: "ਪੋਹ",
      magh: "ਮਾਘ",
      phagan: "ਫੱਗਣ",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  fallbackLng: "en",
  debug: false,
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
  react: {
    useSuspense: false, // This is important for React Native
  },
});

export default i18n;
