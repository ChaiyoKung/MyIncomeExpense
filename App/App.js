import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// screens
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import AddScreen from "./screens/AddScreen";
import ViewRecordsScreen from "./screens/ViewRecordsScreen";

// global for all files
import global from "./global";

// disable warning message on running by expo client
console.disableYellowBox = true;

const Stack = createStackNavigator();

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Add" component={AddScreen} />
          <Stack.Screen name="ViewRecords" component={ViewRecordsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const MyTheme = {
  dark: true,
  colors: {
    primary: global.color.primary,
    background: global.color.white,
    card: global.color.primary,
    text: global.color.white,
    border: global.color.light,
  },
};
