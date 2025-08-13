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
import i18n from "i18next";

interface LanguageContextType {
  language: "en" | "pa";
  setLanguage: (language: "en" | "pa") => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<"en" | "pa">("en");

  // Callback for loading language to prevent recreation
  const loadLanguage = useCallback(async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem("language");
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "pa")) {
        const lang = savedLanguage as "en" | "pa";
        setLanguageState(lang);
        await i18n.changeLanguage(lang);
      }
    } catch (error) {
      console.error("Error loading language:", error);
      // Fallback to default language
      setLanguageState("en");
    }
  }, []);

  // Callback for setting language to prevent recreation
  const setLanguage = useCallback(async (newLanguage: "en" | "pa") => {
    try {
      await AsyncStorage.setItem("language", newLanguage);
      setLanguageState(newLanguage);
      await i18n.changeLanguage(newLanguage);
    } catch (error) {
      console.error("Error saving language:", error);
      // Still update the state even if saving fails
      setLanguageState(newLanguage);
    }
  }, []);

  // Callback for toggling language to prevent recreation
  const toggleLanguage = useCallback(() => {
    const newLanguage = language === "en" ? "pa" : "en";
    setLanguage(newLanguage);
  }, [language, setLanguage]);

  // Load language on mount
  useEffect(() => {
    loadLanguage();
  }, [loadLanguage]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
    }),
    [language, setLanguage, toggleLanguage]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
