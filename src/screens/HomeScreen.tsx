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
import { Audio } from "expo-av";
import { getPrimaryStreamUrl, AUDIO_CONFIG } from "../utils/audioStreams";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
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
  const insets = useSafeAreaInsets();
  const [nanakshahiDate, setNanakshahiDate] = useState<NanakshahiDate | null>(
    null
  );
  const [gregorianDate, setGregorianDate] = useState<GregorianDate | null>(
    null
  );
  const [todayEvents, setTodayEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Gurbani audio state
  const [gurbaniSound, setGurbaniSound] = useState<Audio.Sound | null>(null);
  const [isGurbaniPlaying, setIsGurbaniPlaying] = useState(false);
  const [isGurbaniLoading, setIsGurbaniLoading] = useState(false);
  const [gurbaniError, setGurbaniError] = useState<string | null>(null);

  useEffect(() => {
    updateDates();
    const interval = setInterval(updateDates, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const updateDates = async () => {
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
  };

  const getMonthName = (monthNumber: number) => {
    const month = NANAKSHAHI_MONTHS.find((m) => m.number === monthNumber);
    return language === "pa" ? month?.namePunjabi : month?.name;
  };

  // Initialize Gurbani audio
  useEffect(() => {
    const initializeGurbaniAudio = async () => {
      try {
        await Audio.setAudioModeAsync(AUDIO_CONFIG.audioMode);
      } catch (error) {
        console.error("Error initializing Gurbani audio:", error);
        setGurbaniError("Audio initialization failed");
      }
    };

    initializeGurbaniAudio();

    return () => {
      if (gurbaniSound) {
        gurbaniSound.unloadAsync();
      }
    };
  }, []);

  // Gurbani audio controls
  const toggleGurbani = useCallback(async () => {
    try {
      if (isGurbaniPlaying) {
        // Stop Gurbani
        if (gurbaniSound) {
          await gurbaniSound.stopAsync();
          await gurbaniSound.unloadAsync();
          setGurbaniSound(null);
          setIsGurbaniPlaying(false);
          setGurbaniError(null);
        }
      } else {
        // Start Gurbani
        setIsGurbaniLoading(true);
        setGurbaniError(null);

        // Unload previous sound if exists
        if (gurbaniSound) {
          await gurbaniSound.unloadAsync();
        }

        // Load new sound
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: getPrimaryStreamUrl() },
          AUDIO_CONFIG.playbackOptions
        );

        setGurbaniSound(newSound);
        setIsGurbaniPlaying(true);
        setIsGurbaniLoading(false);

        // Set up status update listener
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setIsGurbaniPlaying(status.isPlaying || false);
          } else {
            setIsGurbaniPlaying(false);
            setGurbaniError("Connection lost");
          }
        });
      }
    } catch (error) {
      console.error("Error with Gurbani audio:", error);
      setGurbaniError("Failed to connect to Golden Temple stream");
      setIsGurbaniLoading(false);
      setIsGurbaniPlaying(false);
    }
  }, [gurbaniSound, isGurbaniPlaying]);

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
    gurbaniCard: {
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
    gurbaniHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    gurbaniIconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#f8f9fa",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 15,
    },
    gurbaniTextContainer: {
      flex: 1,
    },
    gurbaniTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme === "dark" ? "#ffffff" : "#1a1a1a",
      marginBottom: 4,
    },
    gurbaniSubtitle: {
      fontSize: 14,
      color: theme === "dark" ? "#a0a0a0" : "#666666",
      fontWeight: "500",
    },
    gurbaniPlayButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme === "dark" ? "#4CAF50" : "#388E3C",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    gurbaniStopButton: {
      backgroundColor: theme === "dark" ? "#F44336" : "#D32F2F",
    },
    gurbaniErrorText: {
      fontSize: 14,
      color: theme === "dark" ? "#FF5252" : "#F44336",
      textAlign: "center",
      marginBottom: 8,
      fontStyle: "italic",
    },
    gurbaniDescription: {
      fontSize: 14,
      color: theme === "dark" ? "#cccccc" : "#555555",
      lineHeight: 20,
      fontStyle: "italic",
      marginBottom: 12,
    },
    gurbaniStatus: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    gurbaniStatusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },
    gurbaniStatusText: {
      fontSize: 12,
      color: theme === "dark" ? "#a0a0a0" : "#666666",
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
    <SafeAreaView edges={["top"]} style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme === "dark" ? "#0a0a0a" : "#f8f9fa"}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
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

        {/* Gurbani Card */}
        <View style={styles.gurbaniCard}>
          <View style={styles.gurbaniHeader}>
            <View style={styles.gurbaniIconContainer}>
              <MaterialIcons
                name="music-note"
                size={32}
                color={theme === "dark" ? "#FFD600" : "#FF9800"}
              />
            </View>
            <View style={styles.gurbaniTextContainer}>
              <Text style={styles.gurbaniTitle}>
                {language === "pa" ? "ਲਾਈਵ ਗੁਰਬਾਣੀ" : "Live Gurbani"}
              </Text>
              <Text style={styles.gurbaniSubtitle}>
                {language === "pa"
                  ? "ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ ਤੋਂ"
                  : "From Golden Temple"}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.gurbaniPlayButton,
                isGurbaniPlaying && styles.gurbaniStopButton,
              ]}
              onPress={toggleGurbani}
              disabled={isGurbaniLoading}
            >
              {isGurbaniLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <MaterialIcons
                  name={isGurbaniPlaying ? "stop" : "play-arrow"}
                  size={28}
                  color="#ffffff"
                />
              )}
            </TouchableOpacity>
          </View>

          {gurbaniError && (
            <Text style={styles.gurbaniErrorText}>{gurbaniError}</Text>
          )}

          <Text style={styles.gurbaniDescription}>
            {language === "pa"
              ? "ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ ਤੋਂ ਲਾਈਵ ਗੁਰਬਾਣੀ ਸੁਣੋ"
              : "Listen to live Gurbani from Sri Harmandir Sahib"}
          </Text>

          <View style={styles.gurbaniStatus}>
            <View
              style={[
                styles.gurbaniStatusDot,
                { backgroundColor: isGurbaniPlaying ? "#4CAF50" : "#9E9E9E" },
              ]}
            />
            <Text style={styles.gurbaniStatusText}>
              {isGurbaniLoading
                ? language === "pa"
                  ? "ਕਨੈਕਟ ਹੋ ਰਿਹਾ ਹੈ..."
                  : "Connecting..."
                : isGurbaniPlaying
                ? language === "pa"
                  ? "ਲਾਈਵ"
                  : "Live"
                : language === "pa"
                ? "ਬੰਦ"
                : "Stopped"}
            </Text>
          </View>
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
