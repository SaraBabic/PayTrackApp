import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="createIncome"
        options={{
          title: "Add Income",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="money-bill-trend-up" size={24} color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="manage"
        options={{
          title: "Manage",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="sliders" size={24} color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="listIncomes"
        options={{
          title: "Edit",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="view-dashboard-edit"
              size={24}
              color={color}
            />
          ),
        }}
      /> */}
    </Tabs>
  );
}
