import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
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
  gregorianToNanakshahi,
  nanakshahiToGregorian,
  NANAKSHAHI_MONTHS,
  getCurrentNanakshahiDate,
  getCurrentGregorianDate,
} from "../utils/dateConverter";
import { NanakshahiDate, GregorianDate } from "../types";

const ConverterScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const insets = useSafeAreaInsets();
  const [fromType, setFromType] = useState<"gregorian" | "nanakshahi">(
    "gregorian"
  );
  const [toType, setToType] = useState<"nanakshahi" | "gregorian">(
    "nanakshahi"
  );
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [result, setResult] = useState<NanakshahiDate | GregorianDate | null>(
    null
  );

  const convertDate = () => {
    if (!day || !month || !year) {
      Alert.alert(t("error"), "Please fill all fields");
      return;
    }

    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
      Alert.alert(t("error"), "Please enter valid numbers");
      return;
    }

    try {
      if (fromType === "gregorian") {
        const gregorianDate = new Date(yearNum, monthNum - 1, dayNum);
        const nanakshahiResult = gregorianToNanakshahi(gregorianDate);
        setResult(nanakshahiResult);
      } else {
        const nanakshahiDate: NanakshahiDate = {
          year: yearNum,
          month: monthNum,
          day: dayNum,
          monthName: "",
        };
        const gregorianResult = nanakshahiToGregorian(nanakshahiDate);
        setResult(gregorianResult);
      }
    } catch (error) {
      Alert.alert(t("error"), "Invalid date");
    }
  };

  const clearFields = () => {
    setDay("");
    setMonth("");
    setYear("");
    setResult(null);
  };

  const getDefaultFields = (fromType: "gregorian" | "nanakshahi") => {
    if (fromType === "gregorian") {
      const today = getCurrentGregorianDate();
      return {
        day: today.day.toString(),
        month: today.month.toString(),
        year: today.year.toString(),
      };
    } else {
      const today = getCurrentNanakshahiDate();
      return {
        day: today.day.toString(),
        month: today.month.toString(),
        year: today.year.toString(),
      };
    }
  };

  useEffect(() => {
    const defaults = getDefaultFields(fromType);
    setDay(defaults.day);
    setMonth(defaults.month);
    setYear(defaults.year);
    setResult(null);
  }, [fromType]);

  const getMonthName = (monthNumber: number) => {
    const month = NANAKSHAHI_MONTHS.find((m) => m.number === monthNumber);
    return language === "pa" ? month?.namePunjabi : month?.name;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#0a0a0a" : "#f8f9fa",
    },
    scrollView: {},
    header: {
      alignItems: "center",
      marginBottom: 35,
      paddingTop: 10,
    },
    title: {
      fontSize: 26,
      fontWeight: "700",
      color: theme === "dark" ? "#ffffff" : "#1a1a1a",
      marginBottom: 8,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      color: theme === "dark" ? "#a0a0a0" : "#666666",
      textAlign: "center",
      fontWeight: "500",
    },
    card: {
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
      borderRadius: 18,
      padding: 24,
      marginBottom: 25,
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
    cardTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: theme === "dark" ? "#ffffff" : "#1a1a1a",
      marginBottom: 18,
      textAlign: "center",
    },
    typeSelector: {
      flexDirection: "row",
      marginBottom: 25,
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#f8f9fa",
      borderRadius: 12,
      padding: 4,
    },
    typeButton: {
      flex: 1,
      padding: 12,
      alignItems: "center",
      borderRadius: 8,
      marginHorizontal: 2,
    },
    typeButtonActive: {
      backgroundColor: theme === "dark" ? "#4CAF50" : "#2196F3",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    typeButtonInactive: {
      backgroundColor: "transparent",
    },
    typeButtonText: {
      fontSize: 15,
      fontWeight: "600",
    },
    typeButtonTextActive: {
      color: "#ffffff",
    },
    typeButtonTextInactive: {
      color: theme === "dark" ? "#a0a0a0" : "#666666",
    },
    inputContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 25,
    },
    inputGroup: {
      flex: 1,
      marginHorizontal: 6,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme === "dark" ? "#cccccc" : "#555555",
      marginBottom: 8,
      textAlign: "center",
    },
    input: {
      borderWidth: 2,
      borderColor: theme === "dark" ? "#3a3a3a" : "#e0e0e0",
      borderRadius: 12,
      padding: 14,
      fontSize: 16,
      color: theme === "dark" ? "#ffffff" : "#333333",
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#ffffff",
      textAlign: "center",
      fontWeight: "600",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 25,
    },
    button: {
      flex: 1,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      marginHorizontal: 6,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    convertButton: {
      backgroundColor: theme === "dark" ? "#4CAF50" : "#2196F3",
    },
    clearButton: {
      backgroundColor: theme === "dark" ? "#F44336" : "#FF5722",
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#ffffff",
    },
    resultCard: {
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#ffffff",
      borderRadius: 15,
      padding: 20,
      marginTop: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    resultTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme === "dark" ? "#ffffff" : "#333333",
      marginBottom: 15,
    },
    resultText: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme === "dark" ? "#4CAF50" : "#2196F3",
      textAlign: "center",
    },
    resultSubtext: {
      fontSize: 14,
      color: theme === "dark" ? "#cccccc" : "#666666",
      textAlign: "center",
      marginTop: 5,
    },
    resultCardBetter: {
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
      borderRadius: 18,
      padding: 28,
      marginTop: 15,
      marginBottom: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme === "dark" ? "#2a2a2a" : "#f0f0f0",
    },
    resultTitleBetter: {
      fontSize: 22,
      fontWeight: "700",
      color: theme === "dark" ? "#ffffff" : "#1a1a1a",
      marginBottom: 12,
      textAlign: "center",
    },
    resultTextBetter: {
      fontSize: 30,
      fontWeight: "800",
      color: theme === "dark" ? "#4CAF50" : "#2196F3",
      textAlign: "center",
      marginBottom: 6,
    },
    resultSubtextBetter: {
      fontSize: 16,
      color: theme === "dark" ? "#a0a0a0" : "#666666",
      textAlign: "center",
      marginBottom: 12,
      fontWeight: "500",
    },
    resultDualText: {
      fontSize: 18,
      color: theme === "dark" ? "#FFB300" : "#1976D2",
      fontWeight: "600",
      marginTop: 12,
      textAlign: "center",
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme === "dark" ? "#2a2a2a" : "#f0f0f0",
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
        style={{}}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: Platform.OS === "ios" ? 100 + insets.bottom : 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {language === "pa" ? "ਤਾਰੀਖ ਪਰਿਵਰਤਕ" : "Date Converter"}
          </Text>
          <Text style={styles.subtitle}>
            {language === "pa"
              ? `${fromType === "gregorian" ? "ਗ੍ਰੇਗੋਰੀਅਨ" : "ਨਾਨਕਸ਼ਾਹੀ"} ਤੋਂ ${
                  toType === "nanakshahi" ? "ਨਾਨਕਸ਼ਾਹੀ" : "ਗ੍ਰੇਗੋਰੀਅਨ"
                } ਵਿੱਚ ਬਦਲੋ`
              : `Convert from ${
                  fromType === "gregorian" ? "Gregorian" : "Nanakshahi"
                } to ${toType === "nanakshahi" ? "Nanakshahi" : "Gregorian"}`}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {language === "pa" ? "ਇਸ ਤੋਂ ਬਦਲੋ" : "Convert From"}
          </Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                fromType === "gregorian"
                  ? styles.typeButtonActive
                  : styles.typeButtonInactive,
              ]}
              onPress={() => {
                setFromType("gregorian");
                setToType("nanakshahi");
              }}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  fromType === "gregorian"
                    ? styles.typeButtonTextActive
                    : styles.typeButtonTextInactive,
                ]}
              >
                {language === "pa" ? "ਗ੍ਰੇਗੋਰੀਅਨ" : "Gregorian"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                fromType === "nanakshahi"
                  ? styles.typeButtonActive
                  : styles.typeButtonInactive,
              ]}
              onPress={() => {
                setFromType("nanakshahi");
                setToType("gregorian");
              }}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  fromType === "nanakshahi"
                    ? styles.typeButtonTextActive
                    : styles.typeButtonTextInactive,
                ]}
              >
                {language === "pa" ? "ਨਾਨਕਸ਼ਾਹੀ" : "Nanakshahi"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {language === "pa" ? "ਦਿਨ" : "Day"}
              </Text>
              <TextInput
                style={styles.input}
                value={day}
                onChangeText={setDay}
                placeholder="DD"
                placeholderTextColor={theme === "dark" ? "#666666" : "#999999"}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {language === "pa" ? "ਮਹੀਨਾ" : "Month"}
              </Text>
              <TextInput
                style={styles.input}
                value={month}
                onChangeText={setMonth}
                placeholder="MM"
                placeholderTextColor={theme === "dark" ? "#666666" : "#999999"}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {language === "pa" ? "ਸਾਲ" : "Year"}
              </Text>
              <TextInput
                style={styles.input}
                value={year}
                onChangeText={setYear}
                placeholder="YYYY"
                placeholderTextColor={theme === "dark" ? "#666666" : "#999999"}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.convertButton]}
              onPress={convertDate}
            >
              <Text style={styles.buttonText}>
                {language === "pa" ? "ਬਦਲੋ" : "Convert"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.clearButton]}
              onPress={clearFields}
            >
              <Text style={styles.buttonText}>
                {language === "pa" ? "ਮਿਟਾਓ" : "Clear"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {result && (
          <View style={styles.resultCardBetter}>
            <Text style={styles.resultTitleBetter}>
              {language === "pa"
                ? `${
                    toType === "nanakshahi" ? "ਨਾਨਕਸ਼ਾਹੀ" : "ਗ੍ਰੇਗੋਰੀਅਨ"
                  } ਵਿੱਚ ਨਤੀਜਾ`
                : `Result in ${
                    toType === "nanakshahi" ? "Nanakshahi" : "Gregorian"
                  }`}
            </Text>
            <Text style={styles.resultTextBetter}>
              {result.day}{" "}
              {toType === "nanakshahi"
                ? getMonthName(result.month)
                : result.monthName}{" "}
              {result.year}
              {toType === "nanakshahi" ? " 🗓️" : " 📅"}
            </Text>
            <Text style={styles.resultSubtextBetter}>
              {language === "pa"
                ? toType === "nanakshahi"
                  ? "ਨਾਨਕਸ਼ਾਹੀ"
                  : "ਗ੍ਰੇਗੋਰੀਅਨ"
                : toType === "nanakshahi"
                ? "Nanakshahi"
                : "Gregorian"}
            </Text>
            {/* Show the other system's date as well */}
            <Text style={styles.resultDualText}>
              {(() => {
                if (toType === "nanakshahi") {
                  const greg = nanakshahiToGregorian(result as NanakshahiDate);
                  return `${greg.day} ${greg.monthName} ${greg.year} 📅`;
                } else {
                  const nanak = gregorianToNanakshahi(
                    new Date(result.year, result.month - 1, result.day)
                  );
                  return `${nanak.day} ${getMonthName(nanak.month)} ${
                    nanak.year
                  } 🗓️`;
                }
              })()}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConverterScreen;
