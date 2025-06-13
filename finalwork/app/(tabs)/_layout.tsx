import { StyleSheet, View, Dimensions, Platform, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { colors } from "@/constants/Colors";

import TabBar from "enhanced-fluid-bottom-navigation-bar";

// import HomeScreen from "./index";
import DashboardScreen from ".";
import MapScreen from "./map";
import ActivityScreen from "./activity";
import Header from "@/components/ui/Header";
import SettingsScreen from "./settings";

const Tab = createBottomTabNavigator();

export default function Layout() {
  return (
    <>
      <View style={styles.backgroundWrapper}>
        <Header></Header>
      </View>
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
              },
              {
                title: "Community",
                icon: "people-alt",
                iconSet: "MaterialIcons",
                size: 24,
              },
              {
                title: "Profiel",
                icon: "cat",
                iconSet: "FontAwesome5",
                size: 24,
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
        {/* <Tab.Screen name="Home" component={DashboardScreen} /> */}
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Activiteit" component={ActivityScreen} />

        <Tab.Screen name="Map" component={MapScreen} />
      </Tab.Navigator>
    </>
  );
}
const styles = StyleSheet.create({
  backgroundWrapper: {
    position: "absolute",
    // top: -150,
    // left: 0,
    // right: 0,
    width: 50,
    backgroundColor: "red",
  },
});
