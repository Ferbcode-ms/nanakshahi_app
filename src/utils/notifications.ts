import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { Event } from "../types";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request notification permissions
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Notification permissions not granted");
      return false;
    }

    // Configure for Android
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return true;
  } catch (error) {
    console.error("Error requesting notification permissions:", error);
    return false;
  }
};

// Schedule notification for an event
export const scheduleEventNotification = async (
  event: Event
): Promise<string | null> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return null;
    }

    // Calculate notification time (1 hour before event)
    const eventDate = new Date();
    eventDate.setHours(9, 0, 0, 0); // Set to 9 AM for daily events

    // For recurring events, schedule for today if it's the event day
    const now = new Date();
    const currentHour = now.getHours();

    // If it's past 9 AM, schedule for tomorrow
    if (currentHour >= 9) {
      eventDate.setDate(eventDate.getDate() + 1);
    }

    // Schedule notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: event.title,
        body: event.description,
        data: { eventId: event.id, eventType: event.type },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true, // Repeat daily
      },
    });

    console.log(`Notification scheduled for ${event.title}: ${notificationId}`);
    return notificationId;
  } catch (error) {
    console.error("Error scheduling notification:", error);
    return null;
  }
};

// Schedule notification for a specific event date
export const scheduleSpecificEventNotification = async (
  event: Event,
  eventDate: Date,
  hoursBefore: number = 1
): Promise<string | null> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return null;
    }

    // Calculate notification time
    const notificationTime = new Date(eventDate);
    notificationTime.setHours(notificationTime.getHours() - hoursBefore);

    // Don't schedule if notification time is in the past
    if (notificationTime <= new Date()) {
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: event.title,
        body: event.description,
        data: { eventId: event.id, eventType: event.type },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        date: notificationTime,
      },
    });

    console.log(
      `Specific notification scheduled for ${event.title}: ${notificationId}`
    );
    return notificationId;
  } catch (error) {
    console.error("Error scheduling specific notification:", error);
    return null;
  }
};

// Cancel all notifications
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("All notifications cancelled");
  } catch (error) {
    console.error("Error cancelling notifications:", error);
  }
};

// Cancel specific notification
export const cancelNotification = async (
  notificationId: string
): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log(`Notification cancelled: ${notificationId}`);
  } catch (error) {
    console.error("Error cancelling notification:", error);
  }
};

// Get all scheduled notifications
export const getScheduledNotifications = async (): Promise<
  Notifications.NotificationRequest[]
> => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error("Error getting scheduled notifications:", error);
    return [];
  }
};
