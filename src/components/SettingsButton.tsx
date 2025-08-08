import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

const SettingsButton: React.FC = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      top: Platform.OS === "ios" ? insets.top + 10 : 50,
      right: 20,
      zIndex: 1000,
    },
    button: {
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#ffffff",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 25,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme === "dark" ? "#3a3a3a" : "#e0e0e0",
    },
    buttonText: {
      color: theme === "dark" ? "#ffffff" : "#333333",
      fontSize: 14,
      fontWeight: "600",
      marginLeft: 8,
    },
    icon: {
      marginRight: 4,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={toggleTheme}>
        <MaterialIcons
          name={theme === "dark" ? "light-mode" : "dark-mode"}
          size={20}
          color={theme === "dark" ? "#FFD600" : "#333"}
          style={styles.icon}
        />
        <Text style={styles.buttonText}>
          {theme === "dark" ? t("light") : t("dark")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={toggleLanguage}>
        <MaterialIcons
          name="language"
          size={20}
          color={theme === "dark" ? "#4CAF50" : "#2196F3"}
          style={styles.icon}
        />
        <Text style={styles.buttonText}>
          {language === "en" ? t("punjabi") : t("english")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsButton;
