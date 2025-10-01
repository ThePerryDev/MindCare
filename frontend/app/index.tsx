import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Está funcionando</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

//Testando componentes:

/*import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button/Button';
import Card from '../components/Card/Card';
import Input from '../components/Input/Input';
import Return_Button from '../components/Return_Button/Return_Button';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';


export default function HomeScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <SafeAreaView style={styles.container}>
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
        <Return_Button onPress={() => console.log('Login pressed')}>Voltar</Return_Button>
        <Button onPress={() => console.log('Login pressed')}>Login</Button>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignContent: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
});
*/
