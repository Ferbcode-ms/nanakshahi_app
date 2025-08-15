import AsyncStorage from "@react-native-async-storage/async-storage";
import { Event } from "../types";

const EVENTS_STORAGE_KEY = "nanakshahi_calendar_events";

// Cache for events to avoid repeated AsyncStorage reads
let eventsCache: Event[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to check if cache is valid
const isCacheValid = (): boolean => {
  return eventsCache !== null && Date.now() - cacheTimestamp < CACHE_DURATION;
};

// Helper function to invalidate cache
const invalidateCache = (): void => {
  eventsCache = null;
  cacheTimestamp = 0;
};

export const initDatabase = async (): Promise<void> => {
  try {
    // Ensure AsyncStorage is available and working
    const testKey = "test_storage";
    await AsyncStorage.setItem(testKey, "test");
    await AsyncStorage.removeItem(testKey);

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
};

export const insertEvent = async (event: Event): Promise<void> => {
  try {
    const existingEvents = await getAllEvents();
    const updatedEvents = existingEvents.filter((e) => e.id !== event.id);
    updatedEvents.push(event);

    // Update cache immediately
    eventsCache = updatedEvents;
    cacheTimestamp = Date.now();

    await AsyncStorage.setItem(
      EVENTS_STORAGE_KEY,
      JSON.stringify(updatedEvents)
    );
  } catch (error) {
    console.error("Insert event error:", error);
    // Invalidate cache on error
    invalidateCache();
    throw error;
  }
};

export const getAllEvents = async (): Promise<Event[]> => {
  try {
    // Return cached data if valid
    if (isCacheValid()) {
      return eventsCache!;
    }

    const events = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
    const parsedEvents = events ? JSON.parse(events) : [];

    // Update cache
    eventsCache = parsedEvents;
    cacheTimestamp = Date.now();

    return parsedEvents;
  } catch (error) {
    console.error("Get all events error:", error);
    // Invalidate cache on error
    invalidateCache();
    return [];
  }
};

export const getEventsForDate = async (date: {
  day: number;
  month: number;
  year?: number;
}): Promise<Event[]> => {
  try {
    const allEvents = await getAllEvents();
    return allEvents.filter((event) => {
      // For recurring events, only check day and month
      if (event.isRecurring) {
        return event.date.day === date.day && event.date.month === date.month;
      }

      // For non-recurring events, check year if provided
      if (date.year) {
        return (
          event.date.day === date.day &&
          event.date.month === date.month &&
          event.date.year === date.year
        );
      }

      return event.date.day === date.day && event.date.month === date.month;
    });
  } catch (error) {
    console.error("Get events for date error:", error);
    return [];
  }
};

export const getEventsByType = async (type: string): Promise<Event[]> => {
  try {
    const allEvents = await getAllEvents();
    return allEvents.filter((event) => event.type === type);
  } catch (error) {
    console.error("Get events by type error:", error);
    return [];
  }
};

export const searchEvents = async (query: string): Promise<Event[]> => {
  try {
    const allEvents = await getAllEvents();
    const searchQuery = query.toLowerCase();
    return allEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(searchQuery) ||
        event.titlePunjabi.includes(searchQuery) ||
        (event.description &&
          event.description.toLowerCase().includes(searchQuery))
    );
  } catch (error) {
    console.error("Search events error:", error);
    return [];
  }
};

export const clearAllEvents = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(EVENTS_STORAGE_KEY);
    // Invalidate cache
    invalidateCache();
  } catch (error) {
    console.error("Clear events error:", error);
    throw error;
  }
};

export const resetDatabase = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(EVENTS_STORAGE_KEY);
    // Invalidate cache
    invalidateCache();
    console.log("Database reset successfully");
  } catch (error) {
    console.error("Reset database error:", error);
    throw error;
  }
};

// Batch operations for better performance
export const insertMultipleEvents = async (events: Event[]): Promise<void> => {
  try {
    const existingEvents = await getAllEvents();
    const existingIds = new Set(existingEvents.map((e) => e.id));

    // Filter out events that already exist
    const newEvents = events.filter((event) => !existingIds.has(event.id));

    if (newEvents.length === 0) {
      return; // No new events to insert
    }

    const updatedEvents = [...existingEvents, ...newEvents];

    // Update cache immediately
    eventsCache = updatedEvents;
    cacheTimestamp = Date.now();

    await AsyncStorage.setItem(
      EVENTS_STORAGE_KEY,
      JSON.stringify(updatedEvents)
    );
  } catch (error) {
    console.error("Insert multiple events error:", error);
    // Invalidate cache on error
    invalidateCache();
    throw error;
  }
};

// Get events for a date range (optimized)
export const getEventsForDateRange = async (
  startDate: { day: number; month: number; year: number },
  endDate: { day: number; month: number; year: number }
): Promise<Event[]> => {
  try {
    const allEvents = await getAllEvents();
    return allEvents.filter((event) => {
      const eventDate = event.date;

      // Convert dates to comparable numbers for easier comparison
      const eventDateNum =
        eventDate.year * 10000 + eventDate.month * 100 + eventDate.day;
      const startDateNum =
        startDate.year * 10000 + startDate.month * 100 + startDate.day;
      const endDateNum =
        endDate.year * 10000 + endDate.month * 100 + endDate.day;

      return eventDateNum >= startDateNum && eventDateNum <= endDateNum;
    });
  } catch (error) {
    console.error("Get events for date range error:", error);
    return [];
  }
};

// Cache management utilities
export const clearCache = (): void => {
  invalidateCache();
};

export const getCacheInfo = (): { hasCache: boolean; age: number } => {
  return {
    hasCache: eventsCache !== null,
    age: eventsCache ? Date.now() - cacheTimestamp : 0,
  };
};
