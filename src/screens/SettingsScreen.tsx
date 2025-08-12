import React from "react";
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

  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert(
        language === "pa" ? "ਗਲਤੀ" : "Error",
        language === "pa" ? "ਲਿੰਕ ਖੋਲ੍ਹਣ ਵਿੱਚ ਗਲਤੀ" : "Error opening link"
      );
    });
  };

  const handleDonationPress = () => {
    const gumroadUrl = "https://gumroad.com/l/nanakshahi-calendar";
    handleLinkPress(gumroadUrl);
  };

  const handleFiverrPress = () => {
    const fiverrUrl = "https://www.fiverr.com/ferbcode";
    handleLinkPress(fiverrUrl);
  };

  const handleGitHubPress = () => {
    const githubUrl = "https://github.com/ferbcode/nanakshahi-calendar";
    handleLinkPress(githubUrl);
  };

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
    appInfoCard: {
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
    appTitle: {
      fontSize: 24,
      fontWeight: "800",
      color: theme === "dark" ? "#ffffff" : "#1a1a1a",
      marginBottom: 8,
      textAlign: "center",
    },
    appVersion: {
      fontSize: 16,
      color: theme === "dark" ? "#4CAF50" : "#1976D2",
      fontWeight: "600",
      textAlign: "center",
      marginBottom: 20,
    },
    appDescription: {
      fontSize: 16,
      color: theme === "dark" ? "#cccccc" : "#666666",
      lineHeight: 24,
      textAlign: "center",
      marginBottom: 20,
    },
    featureList: {
      marginBottom: 20,
    },
    featureItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    featureIcon: {
      marginRight: 12,
      width: 20,
      alignItems: "center",
    },
    featureText: {
      fontSize: 14,
      color: theme === "dark" ? "#cccccc" : "#666666",
      flex: 1,
    },
    developerCard: {
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
    developerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: theme === "dark" ? "#ffffff" : "#1a1a1a",
      marginBottom: 15,
      textAlign: "center",
    },
    developerInfo: {
      alignItems: "center",
      marginBottom: 20,
    },
    developerName: {
      fontSize: 18,
      fontWeight: "600",
      color: theme === "dark" ? "#4CAF50" : "#1976D2",
      marginBottom: 8,
    },
    developerDescription: {
      fontSize: 14,
      color: theme === "dark" ? "#cccccc" : "#666666",
      textAlign: "center",
      lineHeight: 20,
    },
    linkButton: {
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#f0f0f0",
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 12,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    linkButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme === "dark" ? "#ffffff" : "#333333",
      marginLeft: 8,
    },
    donationCard: {
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
      borderRadius: 20,
      padding: 25,
      marginBottom: 100,
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
    donationTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: theme === "dark" ? "#ffffff" : "#1a1a1a",
      marginBottom: 15,
      textAlign: "center",
    },
    donationDescription: {
      fontSize: 16,
      color: theme === "dark" ? "#cccccc" : "#666666",
      textAlign: "center",
      lineHeight: 24,
      marginBottom: 20,
    },
    donationButton: {
      backgroundColor: theme === "dark" ? "#4CAF50" : "#1976D2",
      paddingHorizontal: 30,
      paddingVertical: 15,
      borderRadius: 15,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    donationButtonText: {
      fontSize: 18,
      fontWeight: "700",
      color: "#ffffff",
      marginLeft: 8,
    },
  });

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

        {/* App Information Card */}
        <View style={styles.appInfoCard}>
          <Text style={styles.appTitle}>
            📅 {language === "pa" ? "ਨਾਨਕਸ਼ਾਹੀ ਕੈਲੰਡਰ" : "Nanakshahi Calendar"}
          </Text>
          <Text style={styles.appVersion}>
            {language === "pa" ? "ਵਰਜਨ" : "Version"} 1.0.0
          </Text>
          <Text style={styles.appDescription}>
            {language === "pa"
              ? "ਇਹ ਐਪ ਸਿੱਖ ਧਰਮ ਦੇ ਨਾਨਕਸ਼ਾਹੀ ਕੈਲੰਡਰ ਨੂੰ ਦਰਸਾਉਂਦੀ ਹੈ। ਇਸ ਵਿੱਚ ਗੁਰਪੁਰਬ, ਇਤਿਹਾਸਿਕ ਘਟਨਾਵਾਂ ਅਤੇ ਮਹੱਤਵਪੂਰਨ ਤਾਰੀਖਾਂ ਸ਼ਾਮਲ ਹਨ।"
              : "This app displays the Sikh Nanakshahi calendar with Gurpurabs, historical events, and important dates. Features include date conversion, event listings, and bilingual support."}
          </Text>

          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <MaterialIcons
                  name="calendar-today"
                  size={16}
                  color={theme === "dark" ? "#4CAF50" : "#1976D2"}
                />
              </View>
              <Text style={styles.featureText}>
                {language === "pa"
                  ? "ਨਾਨਕਸ਼ਾਹੀ ਕੈਲੰਡਰ ਦੇਖੋ"
                  : "View Nanakshahi Calendar"}
              </Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <MaterialIcons
                  name="swap-horiz"
                  size={16}
                  color={theme === "dark" ? "#4CAF50" : "#1976D2"}
                />
              </View>
              <Text style={styles.featureText}>
                {language === "pa" ? "ਤਾਰੀਖ ਬਦਲੋ" : "Date Conversion"}
              </Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <MaterialIcons
                  name="event"
                  size={16}
                  color={theme === "dark" ? "#4CAF50" : "#1976D2"}
                />
              </View>
              <Text style={styles.featureText}>
                {language === "pa"
                  ? "ਗੁਰਪੁਰਬ ਅਤੇ ਘਟਨਾਵਾਂ"
                  : "Gurpurabs & Events"}
              </Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <MaterialIcons
                  name="translate"
                  size={16}
                  color={theme === "dark" ? "#4CAF50" : "#1976D2"}
                />
              </View>
              <Text style={styles.featureText}>
                {language === "pa" ? "ਦੋਭਾਸ਼ੀ ਸਹਾਇਤਾ" : "Bilingual Support"}
              </Text>
            </View>
          </View>
        </View>

        {/* Developer Information Card */}
        <View style={styles.developerCard}>
          <Text style={styles.developerTitle}>
            👨‍💻 {language === "pa" ? "ਡਿਵੈਲਪਰ" : "Developer"}
          </Text>
          <View style={styles.developerInfo}>
            <Text style={styles.developerName}>FerbCode</Text>
            <Text style={styles.developerDescription}>
              {language === "pa"
                ? "ਮੈਂ ਇੱਕ ਫ੍ਰੀਲਾਂਸ ਡਿਵੈਲਪਰ ਹਾਂ ਜੋ ਮੋਬਾਈਲ ਐਪਸ ਅਤੇ ਵੈਬਸਾਈਟਾਂ ਬਣਾਉਂਦਾ ਹਾਂ। ਇਹ ਐਪ ਸਿੱਖ ਭਾਈਚਾਰੇ ਦੀ ਸੇਵਾ ਲਈ ਬਣਾਈ ਗਈ ਹੈ।"
                : "I'm a freelance developer specializing in mobile apps and websites. This app was created to serve the Sikh community with accurate Nanakshahi calendar information."}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={handleFiverrPress}
          >
            <MaterialIcons
              name="work"
              size={20}
              color={theme === "dark" ? "#4CAF50" : "#1976D2"}
            />
            <Text style={styles.linkButtonText}>
              {language === "pa"
                ? "Fiverr 'ਤੇ ਮੈਨੂੰ ਹਾਇਰ ਕਰੋ"
                : "Hire me on Fiverr"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={handleGitHubPress}
          >
            <MaterialIcons
              name="code"
              size={20}
              color={theme === "dark" ? "#4CAF50" : "#1976D2"}
            />
            <Text style={styles.linkButtonText}>
              {language === "pa"
                ? "GitHub 'ਤੇ ਕੋਡ ਦੇਖੋ"
                : "View Code on GitHub"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Donation Card */}
        <View style={styles.donationCard}>
          <Text style={styles.donationTitle}>
            ❤️ {language === "pa" ? "ਦਾਨ ਕਰੋ" : "Support the App"}
          </Text>
          <Text style={styles.donationDescription}>
            {language === "pa"
              ? "ਇਹ ਐਪ ਮੁਫ਼ਤ ਹੈ ਅਤੇ ਰਹੇਗੀ। ਜੇਕਰ ਤੁਸੀਂ ਇਸ ਐਪ ਨੂੰ ਪਸੰਦ ਕਰਦੇ ਹੋ, ਤਾਂ ਕਿਰਪਾ ਕਰਕੇ ਇਸ ਦੇ ਵਿਕਾਸ ਨੂੰ ਸਮਰਥਨ ਦਿਓ।"
              : "This app is and will remain free. If you find it useful, please consider supporting its development to help maintain and improve the app."}
          </Text>

          <TouchableOpacity
            style={styles.donationButton}
            onPress={handleDonationPress}
          >
            <MaterialIcons name="favorite" size={24} color="#ffffff" />
            <Text style={styles.donationButtonText}>
              {language === "pa" ? "Gumroad 'ਤੇ ਦਾਨ ਕਰੋ" : "Donate on Gumroad"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
