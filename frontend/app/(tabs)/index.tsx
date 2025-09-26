/*import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View>
      <Text>Está funcionando</Text>
    </View>
  );
}*/

//Testando componentes:

import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import Input from '../../components/Input/Input';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <Card>
      <Input
        label='E-mail'
        placeholder='Digite seu e-mail'
        value={email}
        onChangeText={setEmail}
      />
      <Input
        label='Senha'
        placeholder='Digite sua senha'
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <Button onPress={() => console.log('Login pressed')}>Login</Button>
    </Card>
  );
}
