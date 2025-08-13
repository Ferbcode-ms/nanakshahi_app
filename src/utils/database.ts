import AsyncStorage from "@react-native-async-storage/async-storage";
import { Event } from "../types";

const EVENTS_STORAGE_KEY = "nanakshahi_calendar_events";

export const initDatabase = async (): Promise<void> => {
  try {
    const existingEvents = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
    if (!existingEvents) {
      // Database is ready, no need to create tables
      console.log("Database initialized successfully");
    }
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
    await AsyncStorage.setItem(
      EVENTS_STORAGE_KEY,
      JSON.stringify(updatedEvents)
    );
  } catch (error) {
    console.error("Insert event error:", error);
    throw error;
  }
};

export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const events = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
    return events ? JSON.parse(events) : [];
  } catch (error) {
    console.error("Get all events error:", error);
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
  } catch (error) {
    console.error("Clear events error:", error);
    throw error;
  }
};

export const resetDatabase = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(EVENTS_STORAGE_KEY);
    console.log("Database reset successfully");
  } catch (error) {
    console.error("Reset database error:", error);
    throw error;
  }
};
