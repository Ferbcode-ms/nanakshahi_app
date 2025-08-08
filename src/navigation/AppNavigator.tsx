import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getDeviceInfo } from "../utils/deviceCompatibility";
import HomeScreen from "../screens/HomeScreen";
import CalendarScreen from "../screens/CalendarScreen";
import ConverterScreen from "../screens/ConverterScreen";
import { RootStackParamList } from "../types";
import { MaterialIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  // Get device-specific bottom offset
  const deviceInfo = getDeviceInfo();
  const bottomOffset = deviceInfo.recommendedBottomOffset;

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: theme === "dark" ? "#2a2a2a" : "#ffffff",
            borderTopColor: theme === "dark" ? "#3a3a3a" : "#e0e0e0",
            borderTopWidth: 1,
            paddingBottom: Platform.OS === "ios" ? insets.bottom : 10,
            paddingTop: 0,
            height: Platform.OS === "ios" ? 80 + insets.bottom : 70,
            position: "absolute",
            bottom: bottomOffset,
            left: 0,
            right: 0,
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
          },
          tabBarActiveTintColor: theme === "dark" ? "#4CAF50" : "#2196F3",
          tabBarInactiveTintColor: theme === "dark" ? "#cccccc" : "#666666",
          headerStyle: {
            backgroundColor: theme === "dark" ? "#2a2a2a" : "#ffffff",
          },
          headerTintColor: theme === "dark" ? "#ffffff" : "#333333",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            marginTop: 5,
          },
          tabBarIconStyle: {
            marginTop: 5,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: t("home"),
            tabBarLabel: t("home"),
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" color={color} size={size || 24} />
            ),
          }}
        />
        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{
            title: t("calendar"),
            tabBarLabel: t("calendar"),
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons
                name="calendar-today"
                color={color}
                size={size || 24}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Converter"
          component={ConverterScreen}
          options={{
            title: t("converter"),
            tabBarLabel: t("converter"),
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons
                name="swap-horiz"
                color={color}
                size={size || 24}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
