import { Platform, Dimensions } from "react-native";

export interface DeviceInfo {
  platform: "ios" | "android";
  screenHeight: number;
  screenWidth: number;
  hasNavigationBar: boolean;
  hasNotch: boolean;
  recommendedBottomOffset: number;
}

export const getDeviceInfo = (): DeviceInfo => {
  const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
  const platform = Platform.OS as "ios" | "android";

  // Detect navigation bar (Android)
  const hasNavigationBar = platform === "android" && screenHeight > 700;

  // Detect notch (simplified detection)
  const hasNotch = platform === "ios" && screenHeight > 800;

  // Calculate recommended bottom offset
  let recommendedBottomOffset = 20; // Default

  if (platform === "ios") {
    // iOS devices
    if (hasNotch) {
      recommendedBottomOffset = 0; // Use safe area
    } else {
      recommendedBottomOffset = 20; // Older iOS devices
    }
  } else {
    // Android devices
    if (hasNavigationBar) {
      recommendedBottomOffset = 40; // Devices with navigation bar
    } else {
      recommendedBottomOffset = 20; // Devices without navigation bar
    }
  }

  return {
    platform,
    screenHeight,
    screenWidth,
    hasNavigationBar,
    hasNotch,
    recommendedBottomOffset,
  };
};

export const logDeviceInfo = () => {
  const deviceInfo = getDeviceInfo();
  console.log("Device Compatibility Info:", deviceInfo);
  return deviceInfo;
};
