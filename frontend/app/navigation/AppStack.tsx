// app/navigation/AppStack.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import ChatBotScreen from '../screens/ChatBotScreen';
import TrilhaScreen from '../screens/TrilhaScreen/TrilhaScreen';
import PerfilScreen from '../screens/PerfilScreen/PerfilScreen';

const Tab = createBottomTabNavigator();

export default function AppStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Chat' component={ChatBotScreen} />
      <Tab.Screen name='Trilha' component={TrilhaScreen} />
      <Tab.Screen name='Perfil' component={PerfilScreen} />
    </Tab.Navigator>
  );
}
