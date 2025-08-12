import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
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
import {
  NANAKSHAHI_MONTHS,
  DAY_NAMES,
  DAY_NAMES_PUNJABI,
  getCurrentNanakshahiDate,
  gregorianToNanakshahi,
  nanakshahiToGregorian,
} from "../utils/dateConverter";
import { NanakshahiDate, Event } from "../types";
import { getEventsForDate } from "../data/events";

const CalendarScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const insets = useSafeAreaInsets();
  const [currentMonth, setCurrentMonth] = useState(1);
  const [currentYear, setCurrentYear] = useState(556);
  const [selectedDate, setSelectedDate] = useState<NanakshahiDate | null>(null);

  useEffect(() => {
    // Use the accurate date conversion function
    const currentNanakshahi = getCurrentNanakshahiDate();
    setCurrentMonth(currentNanakshahi.month);
    setCurrentYear(currentNanakshahi.year);
  }, []);

  const getMonthName = (monthNumber: number) => {
    const month = NANAKSHAHI_MONTHS.find((m) => m.number === monthNumber);
    return language === "pa" ? month?.namePunjabi : month?.name;
  };

  const getDaysInMonth = (month: number, year: number) => {
    const monthData = NANAKSHAHI_MONTHS.find((m) => m.number === month);
    return monthData?.days || 30;
  };

  const getDayName = (dayIndex: number) => {
    return language === "pa"
      ? DAY_NAMES_PUNJABI[dayIndex]
      : DAY_NAMES[dayIndex];
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    // For Nanakshahi calendar, we need to calculate the day of week for the 1st of the month
    // Since Nanakshahi months have fixed start dates in Gregorian calendar, we can use those

    // Nanakshahi month start dates in Gregorian calendar
    const NANAKSHAHI_START_DATES = [
      { month: 3, day: 14 }, // Chet starts on March 14
      { month: 4, day: 13 }, // Vaisakh starts on April 13
      { month: 5, day: 14 }, // Jeth starts on May 14
      { month: 6, day: 15 }, // Harh starts on June 15
      { month: 7, day: 16 }, // Sawan starts on July 16
      { month: 8, day: 16 }, // Bhadon starts on August 16
      { month: 9, day: 17 }, // Assu starts on September 17
      { month: 10, day: 17 }, // Katik starts on October 17
      { month: 11, day: 17 }, // Maghar starts on November 17
      { month: 12, day: 18 }, // Poh starts on December 18
      { month: 1, day: 17 }, // Magh starts on January 17
      { month: 2, day: 17 }, // Phagan starts on February 17
    ];

    // Get the Gregorian start date for this Nanakshahi month
    const startDate = NANAKSHAHI_START_DATES[month - 1];

    // Create a Date object for the 1st of this Nanakshahi month
    const gregorianDate = new Date(
      year + 1469 - 1,
      startDate.month - 1,
      startDate.day
    );

    // Return the day of week (0 = Sunday, 1 = Monday, etc.)
    return gregorianDate.getDay();
  };

  const getDayOfWeekForDate = (day: number, month: number, year: number) => {
    // Calculate which day of the week a specific date falls on
    const firstDayOfMonth = getFirstDayOfMonth(month, year);
    // Calculate the day of week for the specific date
    // (firstDayOfMonth + day - 1) % 7 gives us the day of week (0 = Sunday, 1 = Monday, etc.)
    return (firstDayOfMonth + day - 1) % 7;
  };

  // Short day names for headers
  const SHORT_DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const SHORT_DAY_NAMES_PUNJABI = [
    "ਐਤ",
    "ਸੋਮ",
    "ਮੰਗ",
    "ਬੁੱਧ",
    "ਵੀਰ",
    "ਸ਼ੁਕ",
    "ਸ਼ਨੀ",
  ];

  const renderEventItem = ({ item }: { item: Event }) => {
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
          { borderLeftColor: getEventTypeColor(item.type) },
        ]}
      >
        <View style={styles.eventHeader}>
          <Text
            style={[
              styles.eventTitle,
              { color: theme === "dark" ? "#ffffff" : "#333333" },
            ]}
          >
            {language === "pa" ? item.titlePunjabi : item.title}
          </Text>
          <View
            style={[
              styles.eventTypeBadge,
              { backgroundColor: getEventTypeColor(item.type) },
            ]}
          >
            <Text style={styles.eventTypeText}>{item.type.toUpperCase()}</Text>
          </View>
        </View>
        <Text
          style={[
            styles.eventDescription,
            { color: theme === "dark" ? "#cccccc" : "#666666" },
          ]}
        >
          {language === "pa" ? item.descriptionPunjabi : item.description}
        </Text>
        {item.significance && (
          <Text
            style={[
              styles.eventSignificance,
              { color: theme === "dark" ? "#FF9800" : "#FF5722" },
            ]}
          >
            {language === "pa" ? item.significancePunjabi : item.significance}
          </Text>
        )}
      </View>
    );
  };

  const renderEventsSection = () => {
    if (!selectedDate) return null;

    const events = getEventsForDate(selectedDate);
    const gregorianDate = nanakshahiToGregorian(selectedDate);

    return (
      <View style={styles.eventsSection}>
        <View style={styles.eventsHeader}>
          <View style={styles.eventsHeaderLeft}>
            <Text
              style={[
                styles.eventsHeaderText,
                { color: theme === "dark" ? "#ffffff" : "#333333" },
              ]}
            >
              {language === "pa" ? "ਘਟਨਾਵਾਂ" : "Events"}
            </Text>
            <Text
              style={[
                styles.selectedDateText,
                { color: theme === "dark" ? "#cccccc" : "#666666" },
              ]}
            >
              {selectedDate.day} {getMonthName(selectedDate.month)}{" "}
              {selectedDate.year} ({gregorianDate.day} {gregorianDate.monthName}{" "}
              {gregorianDate.year})
            </Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedDate(null)}
          >
            <Text
              style={[
                styles.closeButtonText,
                { color: theme === "dark" ? "#ffffff" : "#333333" },
              ]}
            >
              ✕
            </Text>
          </TouchableOpacity>
        </View>

        {events.length === 0 ? (
          <View style={styles.noEventsContainer}>
            <Text
              style={[
                styles.noEventsText,
                { color: theme === "dark" ? "#cccccc" : "#666666" },
              ]}
            >
              {language === "pa"
                ? "ਇਸ ਦਿਨ ਕੋਈ ਘਟਨਾ ਨਹੀਂ ਹੈ"
                : "No events on this date"}
            </Text>
          </View>
        ) : (
          <View style={styles.eventsList}>
            {events.map((item, index) => (
              <View key={`${item.title}-${index}`}>
                {renderEventItem({ item })}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
    const totalCells = daysInMonth + firstDayOfMonth;
    const rows = [];
    let cells: React.ReactNode[] = [];

    // Add short day headers
    const dayHeaders = [];
    for (let i = 0; i < 7; i++) {
      dayHeaders.push(
        <View key={`header-${i}`} style={styles.dayHeader}>
          <Text style={styles.dayHeaderText}>
            {language === "pa"
              ? SHORT_DAY_NAMES_PUNJABI[i]
              : SHORT_DAY_NAMES[i]}
          </Text>
        </View>
      );
    }

    // Fill the grid with empty cells and day cells
    for (let i = 0; i < totalCells; i++) {
      if (i < firstDayOfMonth) {
        // Empty cell
        cells.push(
          <View key={`empty-${i}`} style={styles.emptyDayCell}>
            <Text style={styles.emptyDayText}></Text>
          </View>
        );
      } else {
        const day = i - firstDayOfMonth + 1;
        const date: NanakshahiDate = {
          year: currentYear,
          month: currentMonth,
          day,
          monthName: getMonthName(currentMonth) || "",
        };
        const isSelected =
          selectedDate?.day === day &&
          selectedDate?.month === currentMonth &&
          selectedDate?.year === currentYear;
        // Add today cell logic
        const today = getCurrentNanakshahiDate();
        const isToday =
          day === today.day &&
          currentMonth === today.month &&
          currentYear === today.year;

        // Check for events on this date
        const events = getEventsForDate(date);
        const hasEvents = events.length > 0;
        cells.push(
          <TouchableOpacity
            key={day}
            style={[
              styles.dayCell,
              isSelected && styles.selectedDay,
              isToday && styles.todayCell,
              hasEvents &&
                (() => {
                  // Check for specific event types to apply different background colors
                  const hasGurpurab = events.some(
                    (event) =>
                      event.title.toLowerCase().includes("gurpurab") ||
                      event.title.toLowerCase().includes("guru") ||
                      event.title.toLowerCase().includes("ਗੁਰਪੁਰਬ") ||
                      event.title.toLowerCase().includes("ਗੁਰੂ")
                  );

                  const hasHistorical = events.some(
                    (event) =>
                      event.title.toLowerCase().includes("martyrdom") ||
                      event.title.toLowerCase().includes("birth") ||
                      event.title.toLowerCase().includes("death") ||
                      event.title.toLowerCase().includes("ਸ਼ਹੀਦੀ") ||
                      event.title.toLowerCase().includes("ਜਨਮ") ||
                      event.title.toLowerCase().includes("ਦੇਹਾਂਤ")
                  );

                  if (hasGurpurab) return styles.dayCellWithGurpurab;
                  if (hasHistorical) return styles.dayCellWithHistorical;
                  return styles.dayCellWithEvents;
                })(),
            ]}
            onPress={() => setSelectedDate(date)}
          >
            <Text
              style={[
                styles.dayText,
                isSelected && styles.selectedDayText,
                isToday && styles.todayText,
              ]}
            >
              {language === "pa" ? day.toLocaleString("pa-IN") : day}
            </Text>
            {/* Gregorian date below Nanakshahi date */}
            <Text style={styles.gregorianDateText}>
              {(() => {
                const greg = nanakshahiToGregorian(date);
                // Show day and month in Punjabi if language is pa
                if (language === "pa") {
                  // Convert numbers to Gurmukhi digits
                  const paDay = greg.day.toLocaleString("pa-IN");
                  const paMonth = greg.monthName === "" ? "" : greg.monthName; // Optionally map to Punjabi month names
                  return `${paDay} ${paMonth}`;
                } else {
                  return `${greg.day} ${greg.monthName.substr(0, 3)}`;
                }
              })()}
            </Text>
          </TouchableOpacity>
        );
      }
      // If we've filled a row, push it and reset
      if ((i + 1) % 7 === 0) {
        rows.push(
          <View key={`row-${i / 7}`} style={{ flexDirection: "row" }}>
            {cells}
          </View>
        );
        cells = [];
      }
    }
    // Push any remaining cells (for the last row)
    if (cells.length > 0) {
      while (cells.length < 7) {
        cells.push(
          <View key={`empty-end-${cells.length}`} style={styles.emptyDayCell}>
            <Text style={styles.emptyDayText}></Text>
          </View>
        );
      }
      rows.push(
        <View key={`row-last`} style={{ flexDirection: "row" }}>
          {cells}
        </View>
      );
    }
    return (
      <View style={styles.calendarContainer}>
        <View style={styles.dayHeaders}>{dayHeaders}</View>
        <View>{rows}</View>
      </View>
    );
  };

  const changeMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 1) {
        setCurrentMonth(12);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 12) {
        setCurrentMonth(1);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const goToCurrentDate = () => {
    const currentNanakshahi = getCurrentNanakshahiDate();
    setCurrentMonth(currentNanakshahi.month);
    setCurrentYear(currentNanakshahi.year);
    setSelectedDate(null); // Clear any selected date
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
    },
    header: {
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#ffffff",
      padding: 16,
      paddingTop: 16,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#3a3a3a" : "#f0f0f0",
    },
    headerTop: {
      width: "100%",
      alignItems: "center",
      marginBottom: 16,
    },
    calendarTitle: {
      fontSize: 24,
      fontWeight: "800",
      color: theme === "dark" ? "#ffffff" : "#1a1a1a",
      textAlign: "center",
      marginBottom: 6,
      textShadowColor:
        theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    headerBottom: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerCenter: {
      alignItems: "center",
      flex: 1,
    },
    currentDateButton: {
      backgroundColor: theme === "dark" ? "#4CAF50" : "#4CAF50",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      marginTop: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
    },
    currentDateButtonText: {
      color: "#ffffff",
      fontSize: 13,
      fontWeight: "700",
    },
    monthYearText: {
      fontSize: 20,
      fontWeight: "700",
      color: theme === "dark" ? "#ffffff" : "#333333",
      textAlign: "center",
      textShadowColor:
        theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    navigationButton: {
      padding: 14,
      backgroundColor: theme === "dark" ? "#3a3a3a" : "#f5f5f5",
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      minWidth: 44,
      alignItems: "center",
    },
    navigationButtonText: {
      fontSize: 18,
      color: theme === "dark" ? "#ffffff" : "#333333",
      fontWeight: "700",
    },
    calendarContainer: {
      flex: 1,
      padding: 16,
    },
    dayHeaders: {
      flexDirection: "row",
      marginBottom: 16,
    },
    dayHeader: {
      width: "14.28%",
      alignItems: "center",
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: theme === "dark" ? "#3a3a3a" : "#e8e8e8",
      borderRadius: 10,
      margin: 1,
      backgroundColor: theme === "dark" ? "#333333" : "#f8f9fa",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      elevation: 1,
    },
    dayHeaderText: {
      fontSize: 14,
      fontWeight: "700",
      color: theme === "dark" ? "#cccccc" : "#555555",
    },
    daysGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: 5,
    },
    dayCell: {
      width: "14.28%",
      aspectRatio: 1,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme === "dark" ? "#3a3a3a" : "#e8e8e8",
      position: "relative",
      margin: 1,
      borderRadius: 10,
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#ffffff",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      elevation: 1,
    },
    dayCellWithEvents: {
      backgroundColor: theme === "dark" ? "#3a3a3a" : "#f8f9fa",
      borderColor: theme === "dark" ? "#4a4a4a" : "#e0e0e0",
      borderWidth: 2,
    },
    dayCellWithGurpurab: {
      backgroundColor: theme === "dark" ? "#4a3a1a" : "#fff8e1",
      borderColor: theme === "dark" ? "#ffd54f" : "#ffc107",
      borderWidth: 2,
    },
    dayCellWithHistorical: {
      backgroundColor: theme === "dark" ? "#1a3a1a" : "#e8f5e8",
      borderColor: theme === "dark" ? "#4caf50" : "#4caf50",
      borderWidth: 2,
    },
    emptyDayCell: {
      width: "14.28%",
      aspectRatio: 1,
      alignItems: "center",
      justifyContent: "center",
      margin: 1,
    },
    emptyDayText: {
      fontSize: 16,
      color: "transparent",
    },
    dayText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme === "dark" ? "#ffffff" : "#333333",
    },
    selectedDay: {
      backgroundColor: theme === "dark" ? "#4CAF50" : "#2196F3",
      borderColor: theme === "dark" ? "#4CAF50" : "#2196F3",
      shadowColor: theme === "dark" ? "#4CAF50" : "#2196F3",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 6,
    },
    selectedDayText: {
      color: "#ffffff",
      fontWeight: "700",
    },
    todayCell: {
      backgroundColor: theme === "dark" ? "#FF9800" : "#FFF3E0",
      borderColor: theme === "dark" ? "#FF9800" : "#FFB74D",
      shadowColor: theme === "dark" ? "#FF9800" : "#FF9800",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 4,
    },
    todayText: {
      color: theme === "dark" ? "#ffffff" : "#E65100",
      fontWeight: "700",
    },
    gregorianDateText: {
      fontSize: 11,
      color: theme === "dark" ? "#FF7043" : "#1976D2",
      marginTop: 2,
      fontWeight: "600",
    },

    eventsSection: {
      marginTop: 20,
      marginBottom: 0,
      padding: 20,
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#ffffff",
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme === "dark" ? "#3a3a3a" : "#e8e8e8",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 6,
    },
    eventsHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    eventsHeaderLeft: {
      flex: 1,
    },
    closeButton: {
      padding: 10,
      borderRadius: 20,
      backgroundColor: theme === "dark" ? "#4a4a4a" : "#f0f0f0",
      width: 36,
      height: 36,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 3,
      elevation: 2,
    },
    closeButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme === "dark" ? "#ffffff" : "#333333",
    },
    eventsHeaderText: {
      fontSize: 20,
      fontWeight: "700",
      color: theme === "dark" ? "#ffffff" : "#333333",
    },
    selectedDateText: {
      fontSize: 15,
      color: theme === "dark" ? "#cccccc" : "#666666",
      marginTop: 4,
      fontWeight: "500",
    },
    noEventsContainer: {
      alignItems: "center",
      paddingVertical: 20,
    },
    noEventsText: {
      fontSize: 16,
    },
    eventItem: {
      paddingVertical: 15,
      paddingHorizontal: 18,
      borderRadius: 12,
      marginBottom: 12,
      borderLeftWidth: 6,
      borderLeftColor: "#FF9800", // Default color, will be overridden by renderEventItem
      backgroundColor: theme === "dark" ? "#3a3a3a" : "#ffffff",
      borderWidth: 1,
      borderColor: theme === "dark" ? "#4a4a4a" : "#e0e0e0",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    eventHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    eventTitle: {
      fontSize: 17,
      fontWeight: "bold",
      flex: 1,
      marginRight: 10,
    },
    eventTypeBadge: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 8,
      minWidth: 60,
      alignItems: "center",
    },
    eventTypeText: {
      fontSize: 11,
      color: "#ffffff",
      fontWeight: "bold",
      textAlign: "center",
    },
    eventDescription: {
      fontSize: 15,
      marginBottom: 8,
      lineHeight: 20,
    },
    eventSignificance: {
      fontSize: 13,
      fontStyle: "italic",
      marginTop: 5,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme === "dark" ? "#4a4a4a" : "#f0f0f0",
    },
    eventsList: {
      marginTop: 10,
    },
    legendContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 16,
      paddingHorizontal: 10,
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    legendBox: {
      width: 15,
      height: 15,
      borderRadius: 3,
      borderWidth: 1,
      borderColor: "#ccc", // Default border color
      marginRight: 8,
    },
    legendText: {
      fontSize: 12,
      color: theme === "dark" ? "#cccccc" : "#555555",
    },
  });

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.calendarTitle}>
            📅 {language === "pa" ? "ਨਾਨਕਸ਼ਾਹੀ ਕੈਲੰਡਰ" : "Nanakshahi Calendar"}
          </Text>
        </View>
        <View style={styles.headerBottom}>
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={() => changeMonth("prev")}
          >
            <Text style={styles.navigationButtonText}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.monthYearText}>
              {getMonthName(currentMonth)} {currentYear}
            </Text>
            <TouchableOpacity
              style={styles.currentDateButton}
              onPress={goToCurrentDate}
            >
              <Text style={styles.currentDateButtonText}>
                🎯 {language === "pa" ? "ਆਜ ਦਾ ਦਿਨ" : "Today"}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={() => changeMonth("next")}
          >
            <Text style={styles.navigationButtonText}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.calendarContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? 120 + insets.bottom : 120,
        }}
      >
        {/* Event Color Legend */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendBox,
                {
                  backgroundColor: theme === "dark" ? "#4a3a1a" : "#fff8e1",
                  borderColor: theme === "dark" ? "#ffd54f" : "#ffc107",
                },
              ]}
            />
            <Text style={styles.legendText}>
              {language === "pa" ? "ਗੁਰਪੁਰਬ" : "Gurpurab"}
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendBox,
                {
                  backgroundColor: theme === "dark" ? "#1a3a1a" : "#e8f5e8",
                  borderColor: "#4caf50",
                },
              ]}
            />
            <Text style={styles.legendText}>
              {language === "pa" ? "ਇਤਿਹਾਸਿਕ" : "Historical"}
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendBox,
                {
                  backgroundColor: theme === "dark" ? "#3a3a3a" : "#f8f9fa",
                  borderColor: theme === "dark" ? "#4a4a4a" : "#e0e0e0",
                },
              ]}
            />
            <Text style={styles.legendText}>
              {language === "pa" ? "ਹੋਰ" : "Other"}
            </Text>
          </View>
        </View>

        {renderCalendarDays()}
        {renderEventsSection()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CalendarScreen;
