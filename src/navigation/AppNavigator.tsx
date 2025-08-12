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
import EventsScreen from "../screens/EventsScreen";
import SettingsScreen from "../screens/SettingsScreen";
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
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            backgroundColor: theme === "dark" ? "#1f1f1f" : "#ffffff",
            borderTopColor: "transparent",
            borderTopWidth: 0,
            paddingBottom:
              Platform.OS === "ios" ? Math.max(insets.bottom, 8) : 10,

            height:
              Platform.OS === "ios" ? 70 + Math.max(insets.bottom, 8) : 64,
            position: "absolute",
            bottom: bottomOffset + 0,
            left: 16,
            right: 16,
            borderRadius: 20,

            elevation: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            overflow: "hidden",
          },
          tabBarItemStyle: {
            borderRadius: 12,
            marginHorizontal: 6,
            marginVertical: 6,
          },
          tabBarActiveTintColor: theme === "dark" ? "#4CAF50" : "#1976D2",
          tabBarInactiveTintColor: theme === "dark" ? "#bdbdbd" : "#9e9e9e",
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "700",
            marginBottom: 0,
          },
          tabBarIconStyle: {
            marginTop: 0,
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
        <Tab.Screen
          name="Events"
          component={EventsScreen}
          options={{
            title: t("events"),
            tabBarLabel: t("events"),
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="event" color={color} size={size || 24} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: t("settings"),
            tabBarLabel: t("settings"),
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="settings" color={color} size={size || 24} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
