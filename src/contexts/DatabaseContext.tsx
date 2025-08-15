import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  initDatabase,
  insertMultipleEvents,
  getAllEvents,
} from "../utils/database";
import { SAMPLE_EVENTS } from "../data/sampleEvents";

interface DatabaseContextType {
  isDatabaseReady: boolean;
  isInitializing: boolean;
  error: string | null;
  retryInitialization: () => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined
);

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({
  children,
}) => {
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeDatabase = async () => {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        setIsInitializing(true);
        setError(null);

        await initDatabase();

        // Check if database already has events
        const existingEvents = await getAllEvents();

        if (existingEvents.length === 0) {
          // Use insertMultipleEvents for better performance and reliability
          await insertMultipleEvents(SAMPLE_EVENTS);

          // Verify that events were actually inserted
          const verifyEvents = await getAllEvents();
          if (verifyEvents.length === 0) {
            throw new Error("Events were not inserted successfully");
          }
        }

        setIsDatabaseReady(true);
        break; // Success, exit retry loop
      } catch (error) {
        retryCount++;
        console.error(
          `Database initialization failed (attempt ${retryCount}):`,
          error
        );

        if (retryCount >= maxRetries) {
          setError("Database initialization failed after multiple attempts");
        } else {
          // Wait before retrying
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } finally {
        setIsInitializing(false);
      }
    }
  };

  const retryInitialization = () => {
    setIsDatabaseReady(false);
    setError(null);
    initializeDatabase();
  };

  useEffect(() => {
    initializeDatabase();
  }, []);

  const value: DatabaseContextType = {
    isDatabaseReady,
    isInitializing,
    error,
    retryInitialization,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
};
