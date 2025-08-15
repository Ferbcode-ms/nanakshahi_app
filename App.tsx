import React, { Suspense } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import { LanguageProvider } from "./src/contexts/LanguageContext";
import { DatabaseProvider } from "./src/contexts/DatabaseContext";
import { View, Text, ActivityIndicator } from "react-native";
import "./src/i18n"; // Import i18n configuration

// Lazy load components for better performance and smaller initial bundle
const AppNavigator = React.lazy(() => import("./src/navigation/AppNavigator"));
const DatabaseLoadingScreen = React.lazy(
  () => import("./src/components/DatabaseLoadingScreen")
);

// Loading component for Suspense fallback
const LoadingFallback: React.FC = () => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f5f5f5",
    }}
  >
    <ActivityIndicator size="large" color="#4CAF50" />
    <Text style={{ marginTop: 16, fontSize: 16, color: "#666" }}>
      Loading...
    </Text>
  </View>
);

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <DatabaseProvider>
            <Suspense fallback={<LoadingFallback />}>
              <DatabaseLoadingScreen />
              <AppNavigator />
              <StatusBar style="auto" />
            </Suspense>
          </DatabaseProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
