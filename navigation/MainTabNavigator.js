import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "react-navigation-tabs";
import {createStackNavigator} from 'react-navigation-stack';
import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/HomeScreen";
import {createAppContainer} from "react-navigation";
//import LinksScreen from "../screens/LinksScreen";
//import SettingsScreen from "../screens/SettingsScreen";

const AppNavigator = createStackNavigator({
  Home: {
      screen: HomeScreen,
      navigationOptions: {
          title: 'NFL Picks'
      }
  }
}, { headerLayoutPreset : 'center'}
);

// HomeStack.navigationOptions = {
//     tabBarLabel: "New",
//     screen: HomeScreen,
//     navigationOptions: {
//         title: 'NFL Picks'
//     }
  // tabBarIcon: ({ focused }) => (
  //   <TabBarIcon
  //     focused={focused}
  //     name={
  //       Platform.OS === "ios"
  //         ? `ios-add-circle${focused ? "" : "-outline"}`
  //         : "md-add-circle"
  //     }
  //   />
  // )
// };

// const LinksStack = createStackNavigator({
//   Links: LinksScreen
// });
//
// LinksStack.navigationOptions = {
//   tabBarLabel: "Current",
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={
//         Platform.OS === "ios"
//           ? `ios-mail${focused ? "-open" : ""}`
//           : `md-mail${focused ? "-open" : ""}`
//       }
//     />
//   )
// };
//
// const SettingsStack = createStackNavigator({
//   Settings: SettingsScreen
// });
//
// SettingsStack.navigationOptions = {
//   tabBarLabel: "Completed",
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={
//         Platform.OS === "ios"
//           ? "ios-checkmark-circle-outline"
//           : "md-checkmark-circle-outline"
//       }
//     />
//   )
// };

export default createAppContainer(AppNavigator);
