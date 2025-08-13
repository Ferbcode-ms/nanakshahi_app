import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<"light" | "dark">("light");

  // Callback for loading theme to prevent recreation
  const loadTheme = useCallback(async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
        setThemeState(savedTheme as "light" | "dark");
      }
    } catch (error) {
      console.error("Error loading theme:", error);
      // Fallback to default theme
      setThemeState("light");
    }
  }, []);

  // Callback for setting theme to prevent recreation
  const setTheme = useCallback(async (newTheme: "light" | "dark") => {
    try {
      await AsyncStorage.setItem("theme", newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error("Error saving theme:", error);
      // Still update the state even if saving fails
      setThemeState(newTheme);
    }
  }, []);

  // Callback for toggling theme to prevent recreation
  const toggleTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  }, [theme, setTheme]);

  // Load theme on mount
  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      theme,
      toggleTheme,
      setTheme,
    }),
    [theme, toggleTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
