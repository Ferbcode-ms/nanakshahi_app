import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import { LanguageProvider } from "./src/contexts/LanguageContext";
import AppNavigator from "./src/navigation/AppNavigator";
import DatabaseInitializer from "./src/components/DatabaseInitializer";
import "./src/i18n"; // Import i18n configuration

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <DatabaseInitializer />
          <AppNavigator />
          <StatusBar style="auto" />
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
