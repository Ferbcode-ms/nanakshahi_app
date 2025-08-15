import React, { useCallback, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Linking,
  Alert,
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

  // App version and build info
  const appVersion = "1.0.0";
  const buildNumber = "1";

  // Donation and contact links
  const fiverrLink = "https://www.fiverr.com/ferbcode";
  const gumroadLink = "https://gumroad.com/ferbcode";

  // Memoized styles to prevent recreation
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Callback for opening links
  const openLink = useCallback(
    async (url: string, title: string) => {
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert(
            language === "pa" ? "ਗਲਤੀ" : "Error",
            language === "pa"
              ? `${title} ਲਿੰਕ ਨਹੀਂ ਖੁੱਲ ਸਕਦਾ`
              : `Cannot open ${title} link`
          );
        }
      } catch (error) {
        Alert.alert(
          language === "pa" ? "ਗਲਤੀ" : "Error",
          language === "pa" ? "ਲਿੰਕ ਖੋਲ੍ਹਣ ਵਿੱਚ ਗਲਤੀ" : "Error opening link"
        );
      }
    },
    [language]
  );

  // Callback for handling donations
  const handleDonation = useCallback(
    (platform: "fiverr" | "gumroad") => {
      const link = platform === "fiverr" ? fiverrLink : gumroadLink;
      const title = platform === "fiverr" ? "Fiverr" : "Gumroad";
      openLink(link, title);
    },
    [openLink]
  );

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
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

        {/* App Settings */}
        <View style={styles.settingsCard}>
          <Text style={styles.cardTitle}>
            {language === "pa" ? "ਐਪ ਸੈਟਿੰਗਾਂ" : "App Settings"}
          </Text>

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

        {/* App Information */}
        <View style={styles.settingsCard}>
          <Text style={styles.cardTitle}>
            {language === "pa" ? "ਐਪ ਬਾਰੇ" : "About App"}
          </Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <MaterialIcons
                  name="info"
                  size={24}
                  color={theme === "dark" ? "#2196F3" : "#1976D2"}
                />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>
                  {language === "pa" ? "ਐਪ ਦਾ ਨਾਮ" : "App Name"}
                </Text>
                <Text style={styles.settingDescription}>
                  {language === "pa"
                    ? "ਨਾਨਕਸ਼ਾਹੀ ਕੈਲੰਡਰ"
                    : "Nanakshahi Calendar"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <MaterialIcons
                  name="code"
                  size={24}
                  color={theme === "dark" ? "#FF9800" : "#FF5722"}
                />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>
                  {language === "pa" ? "ਵਰਜ਼ਨ" : "Version"}
                </Text>
                <Text style={styles.settingDescription}>
                  {appVersion} ({buildNumber})
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <MaterialIcons
                  name="person"
                  size={24}
                  color={theme === "dark" ? "#4CAF50" : "#388E3C"}
                />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>
                  {language === "pa" ? "ਡਿਵੈਲਪਰ" : "Developer"}
                </Text>
                <Text style={styles.settingDescription}>FerbCode</Text>
              </View>
            </View>
          </View>

          <View style={[styles.settingItem, styles.settingItemLast]}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <MaterialIcons
                  name="description"
                  size={24}
                  color={theme === "dark" ? "#9C27B0" : "#7B1FA2"}
                />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>
                  {language === "pa" ? "ਵੇਰਵਾ" : "Description"}
                </Text>
                <Text style={styles.settingDescription}>
                  {language === "pa"
                    ? "ਸਿੱਖ ਧਰਮ ਦੇ ਨਾਨਕਸ਼ਾਹੀ ਕੈਲੰਡਰ ਦੇ ਅਨੁਸਾਰ ਘਟਨਾਵਾਂ ਅਤੇ ਤਿਉਹਾਰਾਂ ਦਾ ਪੂਰਾ ਕੈਲੰਡਰ"
                    : "Complete calendar of events and festivals according to the Sikh Nanakshahi calendar"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Features */}
        <View style={styles.settingsCard}>
          <Text style={styles.cardTitle}>
            {language === "pa" ? "ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ" : "Features"}
          </Text>

          <View style={styles.featureItem}>
            <MaterialIcons
              name="event"
              size={20}
              color={theme === "dark" ? "#4CAF50" : "#388E3C"}
            />
            <Text style={styles.featureText}>
              {language === "pa"
                ? "ਸਿੱਖ ਧਰਮ ਦੀਆਂ ਸਾਰੀਆਂ ਮਹੱਤਵਪੂਰਨ ਘਟਨਾਵਾਂ"
                : "All important Sikh religious events"}
            </Text>
          </View>

          <View style={styles.featureItem}>
            <MaterialIcons
              name="translate"
              size={20}
              color={theme === "dark" ? "#2196F3" : "#1976D2"}
            />
            <Text style={styles.featureText}>
              {language === "pa"
                ? "ਅੰਗਰੇਜ਼ੀ ਅਤੇ ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਸਮਰਥਨ"
                : "English and Punjabi language support"}
            </Text>
          </View>

          <View style={styles.featureItem}>
            <MaterialIcons
              name="palette"
              size={20}
              color={theme === "dark" ? "#FF9800" : "#FF5722"}
            />
            <Text style={styles.featureText}>
              {language === "pa"
                ? "ਲਾਈਟ ਅਤੇ ਡਾਰਕ ਥੀਮ"
                : "Light and dark themes"}
            </Text>
          </View>

          <View style={styles.featureItem}>
            <MaterialIcons
              name="offline-pin"
              size={20}
              color={theme === "dark" ? "#9C27B0" : "#7B1FA2"}
            />
            <Text style={styles.featureText}>
              {language === "pa" ? "ਆਫਲਾਈਨ ਕੰਮ ਕਰਦਾ ਹੈ" : "Works offline"}
            </Text>
          </View>
        </View>

        {/* Support & Donations */}
        <View style={styles.settingsCard}>
          <Text style={styles.cardTitle}>
            {language === "pa" ? "ਸਹਾਇਤਾ ਅਤੇ ਦਾਨ" : "Support & Donations"}
          </Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleDonation("fiverr")}
          >
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <MaterialIcons
                  name="work"
                  size={24}
                  color={theme === "dark" ? "#00C851" : "#4CAF50"}
                />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>
                  {language === "pa" ? "Fiverr ਪ੍ਰੋਫਾਈਲ" : "Fiverr Profile"}
                </Text>
                <Text style={styles.settingDescription}>
                  {language === "pa"
                    ? "ਡਿਵੈਲਪਰ ਦਾ Fiverr ਪ੍ਰੋਫਾਈਲ ਦੇਖੋ"
                    : "View developer's Fiverr profile"}
                </Text>
              </View>
            </View>
            <MaterialIcons
              name="open-in-new"
              size={20}
              color={theme === "dark" ? "#4CAF50" : "#1976D2"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, styles.settingItemLast]}
            onPress={() => handleDonation("gumroad")}
          >
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <MaterialIcons
                  name="favorite"
                  size={24}
                  color={theme === "dark" ? "#FF4081" : "#E91E63"}
                />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>
                  {language === "pa" ? "ਦਾਨ ਕਰੋ" : "Donate"}
                </Text>
                <Text style={styles.settingDescription}>
                  {language === "pa"
                    ? "Gumroad ਰਾਹੀਂ ਐਪ ਦਾ ਸਮਰਥਨ ਕਰੋ"
                    : "Support the app via Gumroad"}
                </Text>
              </View>
            </View>
            <MaterialIcons
              name="open-in-new"
              size={20}
              color={theme === "dark" ? "#4CAF50" : "#1976D2"}
            />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {language === "pa"
              ? "© 2024 FerbCode. ਸਾਰੇ ਅਧਿਕਾਰ ਸੁਰੱਖਿਅਤ ਹਨ।"
              : "© 2024 FerbCode. All rights reserved."}
          </Text>
          <Text style={styles.footerText}>
            {language === "pa"
              ? "ਸਿੱਖ ਧਰਮ ਦੀ ਸੇਵਾ ਵਿੱਚ ਬਣਾਇਆ ਗਿਆ"
              : "Made in service of Sikh religion"}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(SettingsScreen);

// Move styles outside component to prevent recreation on every render
const createStyles = (theme: "light" | "dark") =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#0a0a0a" : "#f8f9fa",
    },
    scrollView: {
      flex: 1,
      padding: 20,
      paddingBottom: Platform.OS === "ios" ? 120 + 20 : 120,
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
    cardTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: theme === "dark" ? "#ffffff" : "#1a1a1a",
      marginBottom: 20,
      textAlign: "center",
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
      lineHeight: 20,
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

    featureItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#2a2a2a" : "#f0f0f0",
    },
    featureText: {
      fontSize: 16,
      color: theme === "dark" ? "#cccccc" : "#555555",
      marginLeft: 15,
      flex: 1,
      lineHeight: 22,
    },
    footer: {
      alignItems: "center",
      paddingBottom: 100,
      marginTop: 10,
    },
    footerText: {
      fontSize: 14,
      color: theme === "dark" ? "#888888" : "#999999",
      textAlign: "center",

      lineHeight: 20,
    },
  });
