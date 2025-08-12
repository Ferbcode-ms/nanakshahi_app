import React from "react";
import { StatusBar } from "expo-status-bar";
import { StatusBar as RNStatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "./src/contexts/ThemeContext";
import { LanguageProvider } from "./src/contexts/LanguageContext";
import AppNavigator from "./src/navigation/AppNavigator";
import "./src/i18n";

const AppContent = () => {
  const { theme } = useTheme();

  return (
    <>
      <AppNavigator />
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <RNStatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme === "dark" ? "#000000" : "#ffffff"}
        translucent={false}
      />
    </>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
