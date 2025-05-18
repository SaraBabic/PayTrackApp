import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import Index from "./(tabs)/index";
import ListIncomes from "./(tabs)/listIncomes";
import CreateIncome from "./(tabs)/createIncome"; // Dodaj ako ga koristiš
import NotFoundScreen from "./+not-found";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#ff7f50",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#1c1c1e" },
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Incomes") {
            iconName = "cash-outline";
          } else if (route.name === "Create") {
            iconName = "add-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Index} />
      <Tab.Screen name="Incomes" component={ListIncomes} />
      <Tab.Screen name="Create" component={CreateIncome} />
    </Tab.Navigator>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="Root"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="NotFound" component={NotFoundScreen} />
        {/* Dodaj ovde ostale screenove ako nisu deo tabova */}
      </Stack.Navigator>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
