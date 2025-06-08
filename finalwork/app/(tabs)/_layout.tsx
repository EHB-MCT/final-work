import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { colors } from "@/constants/Colors";

import TabBar from "enhanced-fluid-bottom-navigation-bar";

import HomeScreen from "./index";
import DashboardScreen from "./home";
import MapScreen from "./map";

const Tab = createBottomTabNavigator();

export default function Layout() {
  return (
    <Tab.Navigator
      tabBar={(props) => (
        <TabBar
          backgroundColor={colors.primary}
          selectColor={colors.primary}
          tintColor={colors.secondary}
          values={[
            {
              title: "Dashboard",
              icon: "home",
              iconSet: "Ionicons",
              size: 24,
              color: "red",
            },
            {
              title: "Activiteit",
              icon: "activity",
              iconSet: "Feather",
              size: 24,
            },
            {
              title: "Map",
              icon: "map",
              iconSet: "Ionicons",
              size: 24,

              color: (focused: boolean) => (focused ? "#E1B048" : "#888888"),
            },
            {
              title: "Community",
              icon: "people-alt",
              iconSet: "MaterialIcons",
              size: 24,
              color: (focused: boolean) => (focused ? "#E1B048" : "#888888"),
            },
            {
              title: "Profiel",
              icon: "cat",
              iconSet: "FontAwesome5",
              size: 24,
              color: (focused: boolean) => (focused ? "#E1B048" : "#888888"),
            },
          ]}
          onPress={(index: number) => {
            const { name } = props.state.routes[index];
            props.navigation.navigate(name);
          }}
        />
      )}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
    </Tab.Navigator>
  );
}
