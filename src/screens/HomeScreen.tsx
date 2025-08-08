import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getCurrentNanakshahiDate,
  getCurrentGregorianDate,
  NANAKSHAHI_MONTHS,
} from "../utils/dateConverter";
import { NanakshahiDate, GregorianDate } from "../types";
import SettingsButton from "../components/SettingsButton";

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const insets = useSafeAreaInsets();
  const [nanakshahiDate, setNanakshahiDate] = useState<NanakshahiDate | null>(
    null
  );
  const [gregorianDate, setGregorianDate] = useState<GregorianDate | null>(
    null
  );

  useEffect(() => {
    updateDates();
    const interval = setInterval(updateDates, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const updateDates = () => {
    const currentNanakshahi = getCurrentNanakshahiDate();
    const currentGregorian = getCurrentGregorianDate();

    setNanakshahiDate(currentNanakshahi);
    setGregorianDate(currentGregorian);
  };

  const getMonthName = (monthNumber: number) => {
    const month = NANAKSHAHI_MONTHS.find((m) => m.number === monthNumber);
    return language === "pa" ? month?.namePunjabi : month?.name;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
    },
    scrollView: {
      flex: 1,
      padding: 20,
      paddingBottom: Platform.OS === "ios" ? 100 + insets.bottom : 100,
    },
    header: {
      alignItems: "center",
      marginBottom: 30,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme === "dark" ? "#ffffff" : "#333333",
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: theme === "dark" ? "#cccccc" : "#666666",
    },
    dateCard: {
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#ffffff",
      borderRadius: 15,
      padding: 20,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    dateTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme === "dark" ? "#ffffff" : "#333333",
      marginBottom: 10,
    },
    dateText: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme === "dark" ? "#4CAF50" : "#2196F3",
      textAlign: "center",
    },
    dateSubtext: {
      fontSize: 14,
      color: theme === "dark" ? "#cccccc" : "#666666",
      textAlign: "center",
      marginTop: 5,
    },
  });

  if (!nanakshahiDate || !gregorianDate) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { textAlign: "center", marginTop: 50 }]}>
          {t("loading")}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SettingsButton />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t("currentDate")}</Text>
          <Text style={styles.subtitle}>{t("today")}</Text>
        </View>

        <View style={styles.dateCard}>
          <Text style={styles.dateTitle}>{t("nanakshahiDate")}</Text>
          <Text style={styles.dateText}>
            {nanakshahiDate.day} {getMonthName(nanakshahiDate.month)}{" "}
            {nanakshahiDate.year}
          </Text>
          <Text style={styles.dateSubtext}>
            {language === "pa" ? "ਨਾਨਕਸ਼ਾਹੀ" : "Nanakshahi"}
          </Text>
        </View>

        <View style={styles.dateCard}>
          <Text style={styles.dateTitle}>{t("gregorianDate")}</Text>
          <Text style={styles.dateText}>
            {gregorianDate.day} {gregorianDate.monthName} {gregorianDate.year}
          </Text>
          <Text style={styles.dateSubtext}>
            {language === "pa" ? "ਗ੍ਰੇਗੋਰੀਅਨ" : "Gregorian"}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
