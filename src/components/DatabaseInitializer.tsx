import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { initDatabase, insertEvent, getAllEvents } from "../utils/database";
import { SAMPLE_EVENTS } from "../data/sampleEvents";
import { useTheme } from "../contexts/ThemeContext";

const DatabaseInitializer: React.FC = () => {
  const { theme } = useTheme();
  const [isInitializing, setIsInitializing] = useState(true);
  const [status, setStatus] = useState("Checking database...");

  // Memoized styles to prevent recreation on every render
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Callback for database initialization to prevent recreation
  const initializeDatabase = useCallback(async () => {
    try {
      setStatus("Initializing database...");
      await initDatabase();

      // Check if database already has events
      const existingEvents = await getAllEvents();
      
      if (existingEvents.length === 0) {
        setStatus("Populating with sample events...");
        // Use Promise.all for better performance when inserting multiple events
        await Promise.all(
          SAMPLE_EVENTS.map(event => insertEvent(event))
        );
        setStatus("Database populated with sample events!");
      } else {
        setStatus("Database already contains events!");
      }
    } catch (error) {
      console.error("Database initialization failed:", error);
      setStatus("Database initialization failed");
    } finally {
      setIsInitializing(false);
    }
  }, []);

  // Initialize database on mount
  useEffect(() => {
    initializeDatabase();
  }, [initializeDatabase]);

  // Don't render anything after initialization
  if (!isInitializing) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(DatabaseInitializer);

// Move styles outside component to prevent recreation on every render
const createStyles = (theme: "light" | "dark") => StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme === "dark" ? "#000000" : "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  statusText: {
    fontSize: 16,
    color: theme === "dark" ? "#ffffff" : "#333333",
    textAlign: "center",
    marginTop: 20,
  },
});
