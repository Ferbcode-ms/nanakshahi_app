import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import {
  useSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#0a0a0a" : "#f8f9fa",
    },
    scrollView: {
      flex: 1,
      padding: 20,
      paddingBottom: Platform.OS === "ios" ? 120 + insets.bottom : 120,
    },
    header: {
      alignItems: "center",
      marginBottom: 40,
      paddingTop: 10,
    },
    title: {
      fontSize: 32,
      fontWeight: "800",
      color: theme === "dark" ? "#ffffff" : "#1a1a1a",
      marginBottom: 8,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 18,
      color: theme === "dark" ? "#a0a0a0" : "#666666",
      fontWeight: "500",
      textAlign: "center",
    },
    settingsCard: {
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
      borderRadius: 20,
      padding: 25,
      marginBottom: 25,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme === "dark" ? "#2a2a2a" : "#f0f0f0",
    },
    settingItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#2a2a2a" : "#f0f0f0",
    },
    settingItemLast: {
      borderBottomWidth: 0,
    },
    settingLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    settingIcon: {
      marginRight: 15,
      width: 24,
      alignItems: "center",
    },
    settingInfo: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme === "dark" ? "#ffffff" : "#1a1a1a",
      marginBottom: 4,
    },
    settingDescription: {
      fontSize: 14,
      color: theme === "dark" ? "#a0a0a0" : "#666666",
    },
    settingValue: {
      fontSize: 16,
      fontWeight: "600",
      color: theme === "dark" ? "#4CAF50" : "#1976D2",
    },
    toggleButton: {
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#f0f0f0",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme === "dark" ? "#3a3a3a" : "#e0e0e0",
    },
    toggleButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme === "dark" ? "#ffffff" : "#333333",
    },
  });

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {language === "pa" ? "ਸੈਟਿੰਗਾਂ" : "Settings"}
          </Text>
          <Text style={styles.subtitle}>
            {language === "pa" ? "ਐਪ ਦੀਆਂ ਸੈਟਿੰਗਾਂ" : "App Settings"}
          </Text>
        </View>

        <View style={styles.settingsCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <MaterialIcons
                  name={theme === "dark" ? "light-mode" : "dark-mode"}
                  size={24}
                  color={theme === "dark" ? "#FFD600" : "#333"}
                />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>
                  {language === "pa" ? "ਥੀਮ" : "Theme"}
                </Text>
                <Text style={styles.settingDescription}>
                  {language === "pa"
                    ? "ਐਪ ਦਾ ਰੰਗ ਸਕੀਮ ਬਦਲੋ"
                    : "Change app color scheme"}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.toggleButton} onPress={toggleTheme}>
              <Text style={styles.toggleButtonText}>
                {theme === "dark"
                  ? language === "pa"
                    ? "ਲਾਈਟ"
                    : "Light"
                  : language === "pa"
                  ? "ਡਾਰਕ"
                  : "Dark"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.settingItem, styles.settingItemLast]}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <MaterialIcons
                  name="language"
                  size={24}
                  color={theme === "dark" ? "#4CAF50" : "#2196F3"}
                />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>
                  {language === "pa" ? "ਭਾਸ਼ਾ" : "Language"}
                </Text>
                <Text style={styles.settingDescription}>
                  {language === "pa"
                    ? "ਐਪ ਦੀ ਭਾਸ਼ਾ ਬਦਲੋ"
                    : "Change app language"}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={toggleLanguage}
            >
              <Text style={styles.toggleButtonText}>
                {language === "en" ? "Punjabi" : "English"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
