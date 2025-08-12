import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Platform,
  Alert,
  StatusBar,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import {
  useSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  SIKH_EVENTS,
  getEventsByType,
  getEventsByCategory,
  getUpcomingEvents,
  getEventsForCurrentMonth,
} from "../data/events";
import { Event } from "../types";

const EventsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(SIKH_EVENTS);

  useEffect(() => {
    filterEvents();
  }, [selectedFilter, searchQuery]);

  const filterEvents = () => {
    let events = SIKH_EVENTS;

    // Apply type filter
    if (selectedFilter !== "all") {
      if (selectedFilter === "upcoming") {
        events = getUpcomingEvents(30);
      } else if (selectedFilter === "thisMonth") {
        events = getEventsForCurrentMonth();
      } else {
        events = getEventsByType(selectedFilter as Event["type"]);
      }
    }

    // Apply search filter
    if (searchQuery.trim()) {
      events = events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.titlePunjabi.includes(searchQuery) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEvents(events);
  };

  const getFilterButtonStyle = (filter: string) => {
    return [
      styles.filterButton,
      selectedFilter === filter
        ? styles.filterButtonActive
        : styles.filterButtonInactive,
    ];
  };

  const getFilterButtonTextStyle = (filter: string) => {
    return [
      styles.filterButtonText,
      selectedFilter === filter
        ? styles.filterButtonTextActive
        : styles.filterButtonTextInactive,
    ];
  };

  const renderEventCard = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={[styles.eventCard, { borderLeftColor: item.color }]}
      onPress={() => {
        // For now, just show an alert with event details
        Alert.alert(
          language === "pa" ? item.titlePunjabi : item.title,
          language === "pa" ? item.descriptionPunjabi : item.description
        );
      }}
    >
      <View style={styles.eventHeader}>
        <Text style={styles.eventIcon}>{item.icon}</Text>
        <View style={styles.eventTitleContainer}>
          <Text style={styles.eventTitle}>
            {language === "pa" ? item.titlePunjabi : item.title}
          </Text>
          <Text style={styles.eventType}>
            {t(item.type)} • {t(item.category)} • {t(item.priority)}
          </Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: item.color }]}>
          <Text style={styles.priorityText}>{t(item.priority)}</Text>
        </View>
      </View>

      <Text style={styles.eventDescription}>
        {language === "pa" ? item.descriptionPunjabi : item.description}
      </Text>

      <View style={styles.eventDate}>
        <MaterialIcons
          name="event"
          size={16}
          color={theme === "dark" ? "#cccccc" : "#666666"}
        />
        <Text style={styles.eventDateText}>
          {item.date.day} {item.date.monthName} {item.date.year}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
    },
    header: {
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#ffffff",
      padding: 20,
      paddingTop: 0 + insets.top,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme === "dark" ? "#ffffff" : "#333333",
      marginBottom: 15,
    },
    searchContainer: {
      marginBottom: 15,
      flexDirection: "row",
      alignItems: "center",
    },
    searchInput: {
      backgroundColor: theme === "dark" ? "#3a3a3a" : "#ffffff",
      borderWidth: 1,
      borderColor: theme === "dark" ? "#4a4a4a" : "#e0e0e0",
      borderRadius: 10,
      padding: 12,
      fontSize: 16,
      color: theme === "dark" ? "#ffffff" : "#333333",
      flex: 1,
    },
    clearButton: {
      padding: 8,
      marginLeft: 8,
    },
    filterContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      marginRight: 10,
    },
    filterButtonActive: {
      backgroundColor: theme === "dark" ? "#4CAF50" : "#2196F3",
      borderColor: theme === "dark" ? "#4CAF50" : "#2196F3",
    },
    filterButtonInactive: {
      backgroundColor: "transparent",
      borderColor: theme === "dark" ? "#4a4a4a" : "#e0e0e0",
    },
    filterButtonText: {
      fontSize: 14,
      fontWeight: "600",
    },
    filterButtonTextActive: {
      color: "#ffffff",
    },
    filterButtonTextInactive: {
      color: theme === "dark" ? "#cccccc" : "#666666",
    },
    content: {
      flex: 1,
      padding: 20,
      paddingBottom: Platform.OS === "ios" ? 100 + insets.bottom : 100,
    },
    eventCard: {
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#ffffff",
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderLeftWidth: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 3,
    },
    eventHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    eventIcon: {
      fontSize: 24,
      marginRight: 12,
    },
    eventTitleContainer: {
      flex: 1,
    },
    eventTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme === "dark" ? "#ffffff" : "#333333",
      marginBottom: 2,
    },
    eventType: {
      fontSize: 12,
      color: theme === "dark" ? "#cccccc" : "#666666",
      textTransform: "capitalize",
    },
    priorityBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    priorityText: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#ffffff",
      textTransform: "uppercase",
    },
    eventDescription: {
      fontSize: 14,
      color: theme === "dark" ? "#cccccc" : "#666666",
      lineHeight: 20,
      marginBottom: 8,
    },
    eventDate: {
      flexDirection: "row",
      alignItems: "center",
    },
    eventDateText: {
      fontSize: 12,
      color: theme === "dark" ? "#cccccc" : "#666666",
      marginLeft: 4,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
    },
    emptyStateText: {
      fontSize: 16,
      color: theme === "dark" ? "#cccccc" : "#666666",
      textAlign: "center",
      lineHeight: 24,
    },
  });

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <View style={styles.header}>
        <Text style={styles.title}>{t("events")}</Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={t("searchEvents")}
            placeholderTextColor={theme === "dark" ? "#666666" : "#999999"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery("")}
            >
              <MaterialIcons
                name="close"
                size={20}
                color={theme === "dark" ? "#666666" : "#999999"}
              />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          <TouchableOpacity
            style={getFilterButtonStyle("all")}
            onPress={() => setSelectedFilter("all")}
          >
            <Text style={getFilterButtonTextStyle("all")}>{t("all")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={getFilterButtonStyle("upcoming")}
            onPress={() => setSelectedFilter("upcoming")}
          >
            <Text style={getFilterButtonTextStyle("upcoming")}>
              {t("upcoming")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={getFilterButtonStyle("thisMonth")}
            onPress={() => setSelectedFilter("thisMonth")}
          >
            <Text style={getFilterButtonTextStyle("thisMonth")}>
              {t("thisMonth")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={getFilterButtonStyle("gurpurab")}
            onPress={() => setSelectedFilter("gurpurab")}
          >
            <Text style={getFilterButtonTextStyle("gurpurab")}>
              {t("gurpurab")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={getFilterButtonStyle("festival")}
            onPress={() => setSelectedFilter("festival")}
          >
            <Text style={getFilterButtonTextStyle("festival")}>
              {t("festival")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={getFilterButtonStyle("historical")}
            onPress={() => setSelectedFilter("historical")}
          >
            <Text style={getFilterButtonTextStyle("historical")}>
              {t("historical")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={getFilterButtonStyle("seasonal")}
            onPress={() => setSelectedFilter("seasonal")}
          >
            <Text style={getFilterButtonTextStyle("seasonal")}>
              {t("seasonal")}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.content}>
        {filteredEvents.length > 0 ? (
          <FlatList
            data={filteredEvents}
            renderItem={renderEventCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons
              name="event-busy"
              size={64}
              color={theme === "dark" ? "#666666" : "#cccccc"}
            />
            <Text style={styles.emptyStateText}>
              {searchQuery.trim() ? t("noEventsFound") : t("noEventsForFilter")}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default EventsScreen;
