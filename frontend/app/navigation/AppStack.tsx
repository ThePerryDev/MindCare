// app/navigation/AppStack.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import ChatBotScreen from '../screens/ChatBotScreen';
import { View, Text } from 'react-native';

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
      <Tab.Screen
        name='Trilha'
        component={() => (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text>Trilha em breve</Text>
          </View>
        )}
      />
      <Tab.Screen
        name='Perfil'
        component={() => (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text>Perfil em breve</Text>
          </View>
        )}
      />
    </Tab.Navigator>
  );
}
