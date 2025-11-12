// app/navigation/AuthStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen/SplashScreen';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import CadastroDadosPessoaisScreen from '../screens/CadastroScreen/CadastroDadosPessoaisScreen/CadastroDadosPessoaisScreen';
import CadastroSegurancaScreen from '../screens/CadastroScreen/CadastroSegurancaScreen/CadastroSegurancaScreen';
import CadastroConfirmacaoScreen from '../screens/CadastroScreen/CadastroConfirmacaoScreen/CadastroConfirmacaoScreen';
import CadastroFinalizadoScreen from '../screens/CadastroScreen/CadastroFinalizadoScreen/CadastroFinalizadoScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Splash' component={SplashScreen} />
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen
        name='CadastroDadosPessoais'
        component={CadastroDadosPessoaisScreen}
      />
      <Stack.Screen
        name='CadastroSeguranca'
        component={CadastroSegurancaScreen}
      />
      <Stack.Screen
        name='CadastroConfirmacao'
        component={CadastroConfirmacaoScreen}
      />
      <Stack.Screen
        name='CadastroFinalizado'
        component={CadastroFinalizadoScreen}
      />
    </Stack.Navigator>
  );
}
