import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useDatabase } from "../contexts/DatabaseContext";

const DatabaseLoadingScreen: React.FC = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { isDatabaseReady, isInitializing, error, retryInitialization } =
    useDatabase();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme === "dark" ? "#000000" : "#ffffff",
      padding: 20,
    },
    icon: {
      fontSize: 64,
      marginBottom: 20,
      color: theme === "dark" ? "#4CAF50" : "#388E3C",
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: theme === "dark" ? "#ffffff" : "#333333",
      textAlign: "center",
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: theme === "dark" ? "#cccccc" : "#666666",
      textAlign: "center",
      marginBottom: 30,
      lineHeight: 24,
    },
    loadingContainer: {
      alignItems: "center",
    },
    errorContainer: {
      alignItems: "center",
    },
    errorText: {
      fontSize: 16,
      color: theme === "dark" ? "#FF5252" : "#F44336",
      textAlign: "center",
      marginBottom: 20,
      lineHeight: 24,
    },
    retryButton: {
      backgroundColor: theme === "dark" ? "#4CAF50" : "#388E3C",
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
    },
    retryButtonText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },
  });

  if (error) {
    return (
      <View style={styles.container}>
        <MaterialIcons
          name="error-outline"
          size={64}
          color={theme === "dark" ? "#FF5252" : "#F44336"}
          style={styles.icon}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.title}>
            {language === "pa"
              ? "ਡੇਟਾਬੇਸ ਲੋਡ ਕਰਨ ਵਿੱਚ ਸਮੱਸਿਆ"
              : "Database Loading Issue"}
          </Text>
          <Text style={styles.errorText}>
            {language === "pa"
              ? "ਐਪ ਦੇ ਡੇਟਾ ਨੂੰ ਲੋਡ ਕਰਨ ਵਿੱਚ ਸਮੱਸਿਆ ਆਈ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।"
              : "There was an issue loading the app data. Please try again."}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={retryInitialization}
          >
            <MaterialIcons name="refresh" size={20} color="#ffffff" />
            <Text style={styles.retryButtonText}>
              {language === "pa" ? "ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ" : "Retry"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (isInitializing || !isDatabaseReady) {
    return (
      <View style={styles.container}>
        <MaterialIcons
          name="storage"
          size={64}
          color={theme === "dark" ? "#4CAF50" : "#388E3C"}
          style={styles.icon}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.title}>
            {language === "pa" ? "ਐਪ ਤਿਆਰ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ" : "Preparing App"}
          </Text>
          <Text style={styles.subtitle}>
            {language === "pa"
              ? "ਸਿੱਖ ਘਟਨਾਵਾਂ ਅਤੇ ਤਿਥੀਆਂ ਲੋਡ ਕੀਤੀਆਂ ਜਾ ਰਹੀਆਂ ਹਨ..."
              : "Loading Sikh events and dates..."}
          </Text>
          <ActivityIndicator
            size="large"
            color={theme === "dark" ? "#4CAF50" : "#388E3C"}
          />
        </View>
      </View>
    );
  }

  return null;
};

export default DatabaseLoadingScreen;
