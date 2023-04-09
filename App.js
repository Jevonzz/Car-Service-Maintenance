import Colors from './components/const/color';
import {getCurrentUser} from './firebase/firebase-config';

//Auth
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';

//Shared
import SplashScreen from './components/shared/SplashScreen';

//Admin
import AdminScreen from './components/admin/AdminScreen';
import ManageCrew from './components/admin/ManageCrew';
import ManageStock from './components/admin/ManageStock';
import UpdateCC from './components/admin/UpdateCC';
import AddStock from './components/admin/AddStock';
import UpdateStock from './components/admin/UpdateStock';

//Crew
import CrewScreen from './components/crew/CrewScreen';
import ManageAppointment from './components/crew/ManageAppointment';
import UpdateStatus from './components/crew/UpdateStatus';
import RecordCSI from './components/crew/RecordCSI';
import CreateCSB from './components/crew/CreateCSB';

//User
import UserScreen from './components/user/UserScreen';

import 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {Component, useState, useEffect} from 'react';
import {StatusBar, Text, Dimensions} from 'react-native';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {onAuthStateChanged} from 'firebase/auth';
import {LogBox} from 'react-native';
import {and} from 'react-native-reanimated';
import {Provider} from 'react-redux';
import UpdateCrew from './components/admin/UpdateCrew';
import AddCrew from './components/admin/AddCrew';

const StackNav = createStackNavigator();
const Tab = createBottomTabNavigator();
const TopTabs = createMaterialTopTabNavigator();

const Auth = () => {
  return (
    <StackNav.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Login">
      <StackNav.Screen name="Login" component={LoginScreen} />
      <StackNav.Screen name="Register" component={RegisterScreen} />
      <StackNav.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </StackNav.Navigator>
  );
};

const User = () => {
  return (
    <StackNav.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="User">
      <StackNav.Screen name="User" component={UserScreen}></StackNav.Screen>
    </StackNav.Navigator>
  );
};

const Crew = () => {
  return (
    <StackNav.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Crew">
      <StackNav.Screen name="Crew" component={CrewScreen}></StackNav.Screen>
      <StackNav.Screen
        name="ManageAppointment"
        component={ManageAppointment}></StackNav.Screen>
      <StackNav.Screen
        name="UpdateStatus"
        component={UpdateStatus}></StackNav.Screen>
      <StackNav.Screen name="RecordCSI" component={RecordCSI}></StackNav.Screen>
      <StackNav.Screen name="CreateCSB" component={CreateCSB}></StackNav.Screen>
    </StackNav.Navigator>
  );
};

const Admin = () => {
  return (
    <StackNav.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Admin">
      <StackNav.Screen name="Admin" component={AdminScreen}></StackNav.Screen>
      <StackNav.Screen
        name="ManageStock"
        component={ManageStock}></StackNav.Screen>
      <StackNav.Screen name="AddStock" component={AddStock}></StackNav.Screen>
      <StackNav.Screen
        name="UpdateStock"
        component={UpdateStock}></StackNav.Screen>

      <StackNav.Screen name="UpdateCC" component={UpdateCC}></StackNav.Screen>
      <StackNav.Screen
        name="ManageCrew"
        component={ManageCrew}></StackNav.Screen>
      <StackNav.Screen
        name="UpdateCrew"
        component={UpdateCrew}></StackNav.Screen>
      <StackNav.Screen name="AddCrew" component={AddCrew}></StackNav.Screen>
    </StackNav.Navigator>
  );
};

const App = () => {
  //   useEffect(() => {
  //     getCurrentUser();
  //   }, []);

  return (
    <NavigationContainer>
      <StackNav.Navigator screenOptions={{headerShown: false}}>
        <StackNav.Screen name="Splash" component={SplashScreen} />
        <StackNav.Screen name="Auth" component={Auth} />
        <StackNav.Screen name="UserScreen" component={User} />
        <StackNav.Screen name="CrewScreen" component={Crew} />
        <StackNav.Screen name="AdminScreen" component={Admin} />
      </StackNav.Navigator>
    </NavigationContainer>
  );
};

export default App;
