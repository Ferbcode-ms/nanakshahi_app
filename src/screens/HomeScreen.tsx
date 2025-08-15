import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useDatabase } from "../contexts/DatabaseContext";
import {
  useSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";
import {
  getCurrentNanakshahiDate,
  getCurrentGregorianDate,
  NANAKSHAHI_MONTHS,
} from "../utils/dateConverter";
import { NanakshahiDate, GregorianDate, Event } from "../types";

import { getEventsForDate } from "../utils/database";

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { isDatabaseReady } = useDatabase();
  const insets = useSafeAreaInsets();
  const [nanakshahiDate, setNanakshahiDate] = useState<NanakshahiDate | null>(
    null
  );
  const [gregorianDate, setGregorianDate] = useState<GregorianDate | null>(
    null
  );
  const [todayEvents, setTodayEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const updateDates = useCallback(async () => {
    try {
      const currentNanakshahi = getCurrentNanakshahiDate();
      const currentGregorian = getCurrentGregorianDate();

      setNanakshahiDate(currentNanakshahi);
      setGregorianDate(currentGregorian);

      // Load events for today from database
      const events = await getEventsForDate(currentNanakshahi);
      setTodayEvents(events);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to update dates and load events:", error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isDatabaseReady) {
      updateDates();
      const interval = setInterval(updateDates, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [isDatabaseReady, updateDates]);

  const getMonthName = (monthNumber: number) => {
    const month = NANAKSHAHI_MONTHS.find((m) => m.number === monthNumber);
    return language === "pa" ? month?.namePunjabi : month?.name;
  };

  const renderEventItem = (event: Event) => {
    const getEventTypeColor = (type: string) => {
      switch (type) {
        case "gurpurab":
          return theme === "dark" ? "#FFD700" : "#FFC107";
        case "festival":
          return theme === "dark" ? "#4CAF50" : "#4CAF50";
        case "historical":
          return theme === "dark" ? "#2196F3" : "#2196F3";
        case "seasonal":
          return theme === "dark" ? "#FF9800" : "#FF9800";
        case "personal":
          return theme === "dark" ? "#9C27B0" : "#9C27B0";
        default:
          return theme === "dark" ? "#757575" : "#757575";
      }
    };

    return (
      <View
        style={[
          styles.eventItem,
          { borderLeftColor: getEventTypeColor(event.type) },
        ]}
      >
        <View style={styles.eventHeader}>
          <Text
            style={[
              styles.eventTitle,
              { color: theme === "dark" ? "#ffffff" : "#333333" },
            ]}
          >
            {language === "pa" ? event.titlePunjabi : event.title}
          </Text>
          <View
            style={[
              styles.eventTypeBadge,
              { backgroundColor: getEventTypeColor(event.type) },
            ]}
          >
            <Text style={styles.eventTypeText}>{event.type.toUpperCase()}</Text>
          </View>
        </View>
        <Text
          style={[
            styles.eventDescription,
            { color: theme === "dark" ? "#cccccc" : "#666666" },
          ]}
        >
          {language === "pa" ? event.descriptionPunjabi : event.description}
        </Text>
        {event.significance && (
          <Text
            style={[
              styles.eventSignificance,
              { color: theme === "dark" ? "#FF9800" : "#FF5722" },
            ]}
          >
            {language === "pa" ? event.significancePunjabi : event.significance}
          </Text>
        )}
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#0a0a0a" : "#f8f9fa",
    },
    topBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: Platform.OS === "ios" ? 50 : 30,
      paddingBottom: 15,
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#2a2a2a" : "#f0f0f0",
    },
    homeSection: {
      flexDirection: "row",
      alignItems: "center",
    },
    homeIcon: {
      fontSize: 28,
      marginRight: 8,
    },
    homeText: {
      fontSize: 26,
      fontWeight: "800",
      color: theme === "dark" ? "#ffffff" : "#1a1a1a",
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
      paddingTop: Platform.OS === "ios" ? 20 + insets.top : 20,
      paddingBottom: Platform.OS === "ios" ? 120 + insets.bottom : 120,
    },
    header: {
      alignItems: "center",
      marginBottom: 30,
      paddingTop: 10,
    },
    title: {
      fontSize: 26,
      fontWeight: "700",
      color: theme === "dark" ? "#ffffff" : "#1a1a1a",
      marginBottom: 6,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      color: theme === "dark" ? "#a0a0a0" : "#666666",
      fontWeight: "500",
      textAlign: "center",
    },
    dateCard: {
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 6,
      borderWidth: 1,
      borderColor: theme === "dark" ? "#2a2a2a" : "#f0f0f0",
    },
    dateTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme === "dark" ? "#ffffff" : "#1a1a1a",
      marginBottom: 12,
      textAlign: "center",
    },
    dateText: {
      fontSize: 24,
      fontWeight: "700",
      color: theme === "dark" ? "#4CAF50" : "#1976D2",
      textAlign: "center",
      marginBottom: 6,
    },
    dateSubtext: {
      fontSize: 14,
      color: theme === "dark" ? "#a0a0a0" : "#666666",
      textAlign: "center",
      marginTop: 6,
      fontWeight: "500",
    },
    eventItem: {
      paddingVertical: 15,
      paddingHorizontal: 18,
      borderRadius: 12,
      marginBottom: 12,
      borderLeftWidth: 6,
      borderLeftColor: "#FF9800",
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#ffffff",
      borderWidth: 1,
      borderColor: theme === "dark" ? "#3a3a3a" : "#f0f0f0",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 2,
    },
    eventHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    eventTitle: {
      fontSize: 16,
      fontWeight: "600",
      flex: 1,
      marginRight: 10,
      color: theme === "dark" ? "#ffffff" : "#1a1a1a",
      lineHeight: 20,
    },
    eventTypeBadge: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 10,
      minWidth: 70,
      alignItems: "center",
    },
    eventTypeText: {
      fontSize: 12,
      color: "#ffffff",
      fontWeight: "700",
      textAlign: "center",
    },
    eventDescription: {
      fontSize: 14,
      marginBottom: 8,
      lineHeight: 20,
      color: theme === "dark" ? "#b0b0b0" : "#555555",
    },
    eventSignificance: {
      fontSize: 14,
      fontStyle: "italic",
      marginTop: 8,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme === "dark" ? "#3a3a3a" : "#f0f0f0",
      color: theme === "dark" ? "#FF9800" : "#FF5722",
    },
    noEventsText: {
      fontSize: 16,
      textAlign: "center",
      paddingVertical: 25,
      fontWeight: "500",
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
        <StatusBar
          barStyle={theme === "dark" ? "light-content" : "dark-content"}
          backgroundColor={theme === "dark" ? "#0a0a0a" : "#f8f9fa"}
        />
        <Text style={[styles.title, { textAlign: "center", marginTop: 50 }]}>
          {t("loading")}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme === "dark" ? "#0a0a0a" : "#f8f9fa"}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {language === "pa" ? "ਸਤ ਸ੍ਰੀ ਅਕਾਲ" : "Sat Sri Akal"}
          </Text>
          <Text style={styles.subtitle}>
            {language === "pa"
              ? "ਆਪ ਦਾ ਸਵਾਗਤ ਹੈ"
              : "Welcome to Nanakshahi Calendar"}
          </Text>
        </View>

        <View style={styles.dateCard}>
          <Text style={styles.dateTitle}>
            📅 {language === "pa" ? "ਨਾਨਕਸ਼ਾਹੀ ਤਾਰੀਖ" : "Nanakshahi Date"}
          </Text>
          <Text style={styles.dateText}>
            {nanakshahiDate?.day}{" "}
            {nanakshahiDate ? getMonthName(nanakshahiDate.month) : ""}{" "}
            {nanakshahiDate?.year}
          </Text>
          <Text style={styles.dateSubtext}>
            {language === "pa" ? "ਨਾਨਕਸ਼ਾਹੀ ਕੈਲੰਡਰ" : "Nanakshahi Calendar"}
          </Text>
        </View>

        <View style={styles.dateCard}>
          <Text style={styles.dateTitle}>
            🌍 {language === "pa" ? "ਗ੍ਰੇਗੋਰੀਅਨ ਤਾਰੀਖ" : "Gregorian Date"}
          </Text>
          <Text style={styles.dateText}>
            {gregorianDate?.day} {gregorianDate?.monthName}{" "}
            {gregorianDate?.year}
          </Text>
          <Text style={styles.dateSubtext}>
            {language === "pa"
              ? "ਅੰਤਰਰਾਸ਼ਟਰੀ ਕੈਲੰਡਰ"
              : "International Calendar"}
          </Text>
        </View>

        {/* Today's Events */}
        {(() => {
          if (todayEvents.length > 0) {
            return (
              <View style={styles.dateCard}>
                <Text style={styles.dateTitle}>
                  {language === "pa" ? "ਆਜ ਦੀਆਂ ਘਟਨਾਵਾਂ" : "Today's Events"}
                </Text>
                {todayEvents.map((event, index) => (
                  <View key={`${event.title}-${index}`}>
                    {renderEventItem(event)}
                  </View>
                ))}
              </View>
            );
          }
          return (
            <View style={styles.dateCard}>
              <Text style={styles.dateTitle}>
                {language === "pa" ? "ਆਜ ਦੀਆਂ ਘਟਨਾਵਾਂ" : "Today's Events"}
              </Text>
              <Text
                style={[
                  styles.noEventsText,
                  { color: theme === "dark" ? "#cccccc" : "#666666" },
                ]}
              >
                {language === "pa" ? "ਆਜ ਕੋਈ ਘਟਨਾ ਨਹੀਂ ਹੈ" : "No events today"}
              </Text>
            </View>
          );
        })()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
