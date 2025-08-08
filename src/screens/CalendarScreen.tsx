import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  NANAKSHAHI_MONTHS,
  DAY_NAMES,
  DAY_NAMES_PUNJABI,
  getCurrentNanakshahiDate,
  gregorianToNanakshahi,
  nanakshahiToGregorian,
} from "../utils/dateConverter";
import { NanakshahiDate } from "../types";

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
        cells.push(
          <TouchableOpacity
            key={day}
            style={[
              styles.dayCell,
              isSelected && styles.selectedDay,
              isToday && styles.todayCell,
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
    },
    header: {
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#ffffff",
      padding: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    monthYearText: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme === "dark" ? "#ffffff" : "#333333",
    },
    navigationButton: {
      padding: 15,
      backgroundColor: theme === "dark" ? "#3a3a3a" : "#e0e0e0",
      borderRadius: 8,
    },
    navigationButtonText: {
      fontSize: 16,
      color: theme === "dark" ? "#ffffff" : "#333333",
      fontWeight: "600",
    },
    calendarContainer: {
      flex: 1,
      paddingBottom: Platform.OS === "ios" ? 100 + insets.bottom : 100,
      padding: 20,
    },
    dayHeaders: {
      flexDirection: "row",
      marginBottom: 10,
    },
    dayHeader: {
      width: "14.28%",
      alignItems: "center",
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: theme === "dark" ? "#3a3a3a" : "#e0e0e0",
      borderRadius: 8,
      margin: 2,
    },
    dayHeaderText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme === "dark" ? "#cccccc" : "#666666",
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
      borderColor: theme === "dark" ? "#3a3a3a" : "#e0e0e0",
      position: "relative",
      margin: 2,
      borderRadius: 8,
    },
    emptyDayCell: {
      width: "14.28%",
      aspectRatio: 1,
      alignItems: "center",
      justifyContent: "center",
      margin: 2,
    },
    emptyDayText: {
      fontSize: 16,
      color: "transparent",
    },
    dayText: {
      fontSize: 16,
      color: theme === "dark" ? "#ffffff" : "#333333",
    },
    selectedDay: {
      backgroundColor: theme === "dark" ? "#4CAF50" : "#2196F3",
    },
    selectedDayText: {
      color: "#ffffff",
      fontWeight: "bold",
    },
    todayCell: {
      backgroundColor: theme === "dark" ? "#FF9800" : "#FFE0B2",
    },
    todayText: {
      color: theme === "dark" ? "#ffffff" : "#333333",
      fontWeight: "bold",
    },
    gregorianDateText: {
      fontSize: 11,
      color: theme === "dark" ? "#FF7043" : "#1976D2",
      marginTop: 2,
      fontWeight: "bold",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={() => changeMonth("prev")}
        >
          <Text style={styles.navigationButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthYearText}>
          {getMonthName(currentMonth)} {currentYear}
        </Text>
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={() => changeMonth("next")}
        >
          <Text style={styles.navigationButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.calendarContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderCalendarDays()}
      </ScrollView>
    </View>
  );
};

export default CalendarScreen;
