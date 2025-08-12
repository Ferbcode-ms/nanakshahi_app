import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const insets = useSafeAreaInsets();

  const handleDonation = () => {
    const gumroadUrl = "https://gumroad.com/l/nanakshahi-calendar";
    Linking.openURL(gumroadUrl);
  };

  const handleFerbcode = () => {
    const ferbcodeUrl = "https://ferbcode.com";
    Linking.openURL(ferbcodeUrl);
  };

  const handleEmail = () => {
    const email = "support@nanakshahi-calendar.com";
    const subject = "Nanakshahi Calendar Support";
    const body = "Hello, I need help with the Nanakshahi Calendar app.";

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    Linking.openURL(mailtoUrl);
  };

  const handleWebsite = () => {
    const websiteUrl = "https://nanakshahi-calendar.com";
    Linking.openURL(websiteUrl);
  };

  const handlePrivacyPolicy = () => {
    const privacyUrl = "https://nanakshahi-calendar.com/privacy";
    Linking.openURL(privacyUrl);
  };

  const handleTermsOfService = () => {
    const termsUrl = "https://nanakshahi-calendar.com/terms";
    Linking.openURL(termsUrl);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: Platform.OS === "ios" ? 120 + insets.bottom : 120,
    },
    header: {
      alignItems: "center",
      marginBottom: 40,
      paddingTop: 10,
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: "800",
      marginBottom: 8,
      textAlign: "center",
    },
    headerSubtitle: {
      fontSize: 18,
      fontWeight: "500",
      textAlign: "center",
    },
    section: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 15,
      marginLeft: 5,
    },
    card: {
      borderRadius: 20,
      padding: 20,
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
    settingLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    settingText: {
      marginLeft: 15,
      flex: 1,
    },
    settingTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 4,
    },
    settingSubtitle: {
      fontSize: 14,
      fontWeight: "400",
    },
    toggle: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      minWidth: 40,
      alignItems: "center",
    },
    toggleText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#ffffff",
    },
    infoItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#2a2a2a" : "#f0f0f0",
    },
    infoText: {
      marginLeft: 15,
      flex: 1,
    },
    infoTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 4,
    },
    infoSubtitle: {
      fontSize: 14,
      fontWeight: "400",
    },
    footer: {
      alignItems: "center",
      marginTop: 20,
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: theme === "dark" ? "#2a2a2a" : "#f0f0f0",
    },
    footerText: {
      fontSize: 14,
      textAlign: "center",
      marginBottom: 8,
    },
  });

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#000000" : "#f5f5f5" },
      ]}
      edges={["top"]}
    >
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme === "dark" ? "#000000" : "#f5f5f5"}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text
            style={[
              styles.headerTitle,
              { color: theme === "dark" ? "#ffffff" : "#333333" },
            ]}
          >
            {language === "pa" ? "ਸੈਟਿੰਗਾਂ" : "Settings"}
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              { color: theme === "dark" ? "#bdbdbd" : "#666666" },
            ]}
          >
            {language === "pa"
              ? "ਆਪਣੀ ਐਪ ਨੂੰ ਕਸਟਮਾਈਜ਼ ਕਰੋ"
              : "Customize your app experience"}
          </Text>
        </View>

        {/* App Preferences Section */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme === "dark" ? "#ffffff" : "#333333" },
            ]}
          >
            {language === "pa" ? "ਐਪ ਪਸੰਦਾਂ" : "App Preferences"}
          </Text>

          <View
            style={[
              styles.card,
              { backgroundColor: theme === "dark" ? "#1f1f1f" : "#ffffff" },
            ]}
          >
            <TouchableOpacity style={styles.settingItem} onPress={toggleTheme}>
              <View style={styles.settingLeft}>
                <MaterialIcons
                  name={theme === "dark" ? "light-mode" : "dark-mode"}
                  size={24}
                  color={theme === "dark" ? "#4CAF50" : "#1976D2"}
                />
                <View style={styles.settingText}>
                  <Text
                    style={[
                      styles.settingTitle,
                      { color: theme === "dark" ? "#ffffff" : "#333333" },
                    ]}
                  >
                    {language === "pa" ? "ਥੀਮ" : "Theme"}
                  </Text>
                  <Text
                    style={[
                      styles.settingSubtitle,
                      { color: theme === "dark" ? "#bdbdbd" : "#666666" },
                    ]}
                  >
                    {language === "pa"
                      ? "ਡਾਰਕ ਜਾਂ ਲਾਈਟ ਮੋਡ ਚੁਣੋ"
                      : "Choose dark or light mode"}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.toggle,
                  { backgroundColor: theme === "dark" ? "#4CAF50" : "#1976D2" },
                ]}
              >
                <Text style={styles.toggleText}>
                  {theme === "dark" ? "🌙" : "☀️"}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={toggleLanguage}
            >
              <View style={styles.settingLeft}>
                <MaterialIcons
                  name="language"
                  size={24}
                  color={theme === "dark" ? "#4CAF50" : "#1976D2"}
                />
                <View style={styles.settingText}>
                  <Text
                    style={[
                      styles.settingTitle,
                      { color: theme === "dark" ? "#ffffff" : "#333333" },
                    ]}
                  >
                    {language === "pa" ? "ਭਾਸ਼ਾ" : "Language"}
                  </Text>
                  <Text
                    style={[
                      styles.settingSubtitle,
                      { color: theme === "dark" ? "#bdbdbd" : "#666666" },
                    ]}
                  >
                    {language === "pa"
                      ? "ਪੰਜਾਬੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਚੁਣੋ"
                      : "Choose Punjabi or English"}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.toggle,
                  { backgroundColor: theme === "dark" ? "#4CAF50" : "#1976D2" },
                ]}
              >
                <Text style={styles.toggleText}>
                  {language === "pa" ? "ਪਾ" : "EN"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Information Section */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme === "dark" ? "#ffffff" : "#333333" },
            ]}
          >
            {language === "pa" ? "ਐਪ ਬਾਰੇ ਜਾਣਕਾਰੀ" : "App Information"}
          </Text>

          <View
            style={[
              styles.card,
              { backgroundColor: theme === "dark" ? "#1f1f1f" : "#ffffff" },
            ]}
          >
            <View style={styles.infoItem}>
              <MaterialIcons
                name="info"
                size={24}
                color={theme === "dark" ? "#4CAF50" : "#1976D2"}
              />
              <View style={styles.infoText}>
                <Text
                  style={[
                    styles.infoTitle,
                    { color: theme === "dark" ? "#ffffff" : "#333333" },
                  ]}
                >
                  {language === "pa" ? "ਐਪ ਦਾ ਨਾਮ" : "App Name"}
                </Text>
                <Text
                  style={[
                    styles.infoSubtitle,
                    { color: theme === "dark" ? "#bdbdbd" : "#666666" },
                  ]}
                >
                  Nanakshahi Calendar
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <MaterialIcons
                name="code"
                size={24}
                color={theme === "dark" ? "#4CAF50" : "#1976D2"}
              />
              <View style={styles.infoText}>
                <Text
                  style={[
                    styles.infoTitle,
                    { color: theme === "dark" ? "#ffffff" : "#333333" },
                  ]}
                >
                  {language === "pa" ? "ਵਰਜਨ" : "Version"}
                </Text>
                <Text
                  style={[
                    styles.infoSubtitle,
                    { color: theme === "dark" ? "#bdbdbd" : "#666666" },
                  ]}
                >
                  1.0.0
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <MaterialIcons
                name="developer-mode"
                size={24}
                color={theme === "dark" ? "#4CAF50" : "#1976D2"}
              />
              <View style={styles.infoText}>
                <Text
                  style={[
                    styles.infoTitle,
                    { color: theme === "dark" ? "#ffffff" : "#333333" },
                  ]}
                >
                  {language === "pa" ? "ਡਿਵੈਲਪਰ" : "Developer"}
                </Text>
                <Text
                  style={[
                    styles.infoSubtitle,
                    { color: theme === "dark" ? "#bdbdbd" : "#666666" },
                  ]}
                >
                  Ferbcode
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <MaterialIcons
                name="description"
                size={24}
                color={theme === "dark" ? "#4CAF50" : "#1976D2"}
              />
              <View style={styles.infoText}>
                <Text
                  style={[
                    styles.infoTitle,
                    { color: theme === "dark" ? "#ffffff" : "#333333" },
                  ]}
                >
                  {language === "pa" ? "ਵੇਰਵਾ" : "Description"}
                </Text>
                <Text
                  style={[
                    styles.infoSubtitle,
                    { color: theme === "dark" ? "#bdbdbd" : "#666666" },
                  ]}
                >
                  {language === "pa"
                    ? "ਨਾਨਕਸ਼ਾਹੀ ਕੈਲੰਡਰ ਐਪ - ਸਿੱਖ ਧਰਮ ਅਤੇ ਸੱਭਿਆਚਾਰ ਲਈ ਇੱਕ ਸੰਪੂਰਨ ਡਿਜੀਟਲ ਕੈਲੰਡਰ"
                    : "Nanakshahi Calendar App - A comprehensive digital calendar for Sikh religion and culture"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Ferbcode Section */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme === "dark" ? "#ffffff" : "#333333" },
            ]}
          >
            {language === "pa" ? "ਡਿਵੈਲਪਰ" : "Developer"}
          </Text>

          <View
            style={[
              styles.card,
              { backgroundColor: theme === "dark" ? "#1f1f1f" : "#ffffff" },
            ]}
          >
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleFerbcode}
            >
              <View style={styles.settingLeft}>
                <MaterialIcons
                  name="business"
                  size={24}
                  color={theme === "dark" ? "#4CAF50" : "#1976D2"}
                />
                <View style={styles.settingText}>
                  <Text
                    style={[
                      styles.settingTitle,
                      { color: theme === "dark" ? "#ffffff" : "#333333" },
                    ]}
                  >
                    Ferbcode
                  </Text>
                  <Text
                    style={[
                      styles.settingSubtitle,
                      { color: theme === "dark" ? "#bdbdbd" : "#666666" },
                    ]}
                  >
                    {language === "pa"
                      ? "ਡਿਵੈਲਪਰ ਦੀ ਵੈਬਸਾਈਟ ਵੇਖੋ"
                      : "Visit developer website"}
                  </Text>
                </View>
              </View>
              <MaterialIcons
                name="open-in-new"
                size={20}
                color={theme === "dark" ? "#bdbdbd" : "#666666"}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={handleEmail}>
              <View style={styles.settingLeft}>
                <MaterialIcons
                  name="email"
                  size={24}
                  color={theme === "dark" ? "#4CAF50" : "#1976D2"}
                />
                <View style={styles.settingText}>
                  <Text
                    style={[
                      styles.settingTitle,
                      { color: theme === "dark" ? "#ffffff" : "#333333" },
                    ]}
                  >
                    {language === "pa" ? "ਸਹਾਇਤਾ ਈਮੇਲ" : "Support Email"}
                  </Text>
                  <Text
                    style={[
                      styles.settingSubtitle,
                      { color: theme === "dark" ? "#bdbdbd" : "#666666" },
                    ]}
                  >
                    support@nanakshahi-calendar.com
                  </Text>
                </View>
              </View>
              <MaterialIcons
                name="email"
                size={20}
                color={theme === "dark" ? "#bdbdbd" : "#666666"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Support & Donation Section */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme === "dark" ? "#ffffff" : "#333333" },
            ]}
          >
            {language === "pa" ? "ਸਹਾਇਤਾ ਅਤੇ ਦਾਨ" : "Support & Donation"}
          </Text>

          <View
            style={[
              styles.card,
              { backgroundColor: theme === "dark" ? "#1f1f1f" : "#ffffff" },
            ]}
          >
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleDonation}
            >
              <View style={styles.settingLeft}>
                <MaterialIcons name="favorite" size={24} color="#E91E63" />
                <View style={styles.settingText}>
                  <Text
                    style={[
                      styles.settingTitle,
                      { color: theme === "dark" ? "#ffffff" : "#333333" },
                    ]}
                  >
                    {language === "pa" ? "ਦਾਨ ਕਰੋ" : "Make a Donation"}
                  </Text>
                  <Text
                    style={[
                      styles.settingSubtitle,
                      { color: theme === "dark" ? "#bdbdbd" : "#666666" },
                    ]}
                  >
                    {language === "pa"
                      ? "ਐਪ ਦੇ ਵਿਕਾਸ ਨੂੰ ਸਹਾਇਤਾ ਕਰੋ"
                      : "Support app development"}
                  </Text>
                </View>
              </View>
              <MaterialIcons
                name="open-in-new"
                size={20}
                color={theme === "dark" ? "#bdbdbd" : "#666666"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleWebsite}
            >
              <View style={styles.settingLeft}>
                <MaterialIcons
                  name="language"
                  size={24}
                  color={theme === "dark" ? "#4CAF50" : "#1976D2"}
                />
                <View style={styles.settingText}>
                  <Text
                    style={[
                      styles.settingTitle,
                      { color: theme === "dark" ? "#ffffff" : "#333333" },
                    ]}
                  >
                    {language === "pa" ? "ਵੈਬਸਾਈਟ" : "Website"}
                  </Text>
                  <Text
                    style={[
                      styles.settingSubtitle,
                      { color: theme === "dark" ? "#bdbdbd" : "#666666" },
                    ]}
                  >
                    nanakshahi-calendar.com
                  </Text>
                </View>
              </View>
              <MaterialIcons
                name="open-in-new"
                size={20}
                color={theme === "dark" ? "#bdbdbd" : "#666666"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme === "dark" ? "#ffffff" : "#333333" },
            ]}
          >
            {language === "pa" ? "ਕਾਨੂੰਨੀ" : "Legal"}
          </Text>

          <View
            style={[
              styles.card,
              { backgroundColor: theme === "dark" ? "#1f1f1f" : "#ffffff" },
            ]}
          >
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handlePrivacyPolicy}
            >
              <View style={styles.settingLeft}>
                <MaterialIcons
                  name="privacy-tip"
                  size={24}
                  color={theme === "dark" ? "#4CAF50" : "#1976D2"}
                />
                <View style={styles.settingText}>
                  <Text
                    style={[
                      styles.settingTitle,
                      { color: theme === "dark" ? "#ffffff" : "#333333" },
                    ]}
                  >
                    {language === "pa" ? "ਗੋਪਨੀਯਤਾ ਨੀਤੀ" : "Privacy Policy"}
                  </Text>
                </View>
              </View>
              <MaterialIcons
                name="open-in-new"
                size={20}
                color={theme === "dark" ? "#bdbdbd" : "#666666"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleTermsOfService}
            >
              <View style={styles.settingLeft}>
                <MaterialIcons
                  name="description"
                  size={24}
                  color={theme === "dark" ? "#4CAF50" : "#1976D2"}
                />
                <View style={styles.settingText}>
                  <Text
                    style={[
                      styles.settingTitle,
                      { color: theme === "dark" ? "#ffffff" : "#333333" },
                    ]}
                  >
                    {language === "pa"
                      ? "ਸੇਵਾ ਦੀਆਂ ਸ਼ਰਤਾਂ"
                      : "Terms of Service"}
                  </Text>
                </View>
              </View>
              <MaterialIcons
                name="open-in-new"
                size={20}
                color={theme === "dark" ? "#bdbdbd" : "#666666"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text
            style={[
              styles.footerText,
              { color: theme === "dark" ? "#bdbdbd" : "#666666" },
            ]}
          >
            © 2024 Ferbcode.{" "}
            {language === "pa"
              ? "ਸਾਰੇ ਅਧਿਕਾਰ ਸੁਰੱਖਿਅਤ ਹਨ।"
              : "All rights reserved."}
          </Text>
          <Text
            style={[
              styles.footerText,
              { color: theme === "dark" ? "#bdbdbd" : "#666666" },
            ]}
          >
            {language === "pa"
              ? "ਸਿੱਖ ਧਰਮ ਅਤੇ ਸੱਭਿਆਚਾਰ ਲਈ ਬਣਾਇਆ ਗਿਆ"
              : "Made with ❤️ for Sikh religion and culture"}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
