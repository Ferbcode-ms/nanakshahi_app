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
} from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
    },
    scrollView: {},
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
    card: {
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
    cardTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme === "dark" ? "#ffffff" : "#333333",
      marginBottom: 15,
    },
    typeSelector: {
      flexDirection: "row",
      marginBottom: 20,
    },
    typeButton: {
      flex: 1,
      padding: 15,
      alignItems: "center",
      borderRadius: 10,
      marginHorizontal: 5,
    },
    typeButtonActive: {
      backgroundColor: theme === "dark" ? "#4CAF50" : "#2196F3",
    },
    typeButtonInactive: {
      backgroundColor: theme === "dark" ? "#3a3a3a" : "#e0e0e0",
    },
    typeButtonText: {
      fontSize: 16,
      fontWeight: "600",
    },
    typeButtonTextActive: {
      color: "#ffffff",
    },
    typeButtonTextInactive: {
      color: theme === "dark" ? "#ffffff" : "#333333",
    },
    inputContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    inputGroup: {
      flex: 1,
      marginHorizontal: 5,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: theme === "dark" ? "#cccccc" : "#666666",
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: theme === "dark" ? "#3a3a3a" : "#e0e0e0",
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: theme === "dark" ? "#ffffff" : "#333333",
      backgroundColor: theme === "dark" ? "#3a3a3a" : "#ffffff",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },
    button: {
      flex: 1,
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      marginHorizontal: 5,
    },
    convertButton: {
      backgroundColor: theme === "dark" ? "#4CAF50" : "#2196F3",
    },
    clearButton: {
      backgroundColor: theme === "dark" ? "#F44336" : "#FF5722",
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "600",
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
      backgroundColor: theme === "dark" ? "#23272f" : "#f8f9fa",
      borderRadius: 16,
      padding: 24,
      marginTop: 20,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
      alignItems: "center",
    },
    resultTitleBetter: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme === "dark" ? "#fff" : "#222",
      marginBottom: 10,
    },
    resultTextBetter: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme === "dark" ? "#4CAF50" : "#2196F3",
      textAlign: "center",
      marginBottom: 4,
    },
    resultSubtextBetter: {
      fontSize: 15,
      color: theme === "dark" ? "#cccccc" : "#666666",
      textAlign: "center",
      marginBottom: 8,
    },
    resultDualText: {
      fontSize: 16,
      color: theme === "dark" ? "#FFB300" : "#1976D2",
      fontWeight: "600",
      marginTop: 8,
      textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={{}}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: Platform.OS === "ios" ? 100 + insets.bottom : 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t("dateConverter")}</Text>
          <Text style={styles.subtitle}>
            {t("convertFrom")} {t(fromType)} {t("convertTo")} {t(toType)}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t("convertFrom")}</Text>
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
                {t("gregorian")}
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
                {t("nanakshahi")}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Day</Text>
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
              <Text style={styles.inputLabel}>Month</Text>
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
              <Text style={styles.inputLabel}>Year</Text>
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
              <Text style={styles.buttonText}>{t("convert")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.clearButton]}
              onPress={clearFields}
            >
              <Text style={styles.buttonText}>{t("cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {result && (
          <View style={styles.resultCardBetter}>
            <Text style={styles.resultTitleBetter}>
              {t("convertTo")} {t(toType)}
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
    </View>
  );
};

export default ConverterScreen;
