import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View>
      <Text>Está funcionando</Text>
    </View>
  );
}

//Testando componentes:

/*
import Card from "../../components/Card/Card";
import Input from "../../components/Input/Input";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

export default function HomeScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <Card>
      <Input
        label="E-mail"
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
      />
      <Input
        label="Senha"
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F5F9FF",
  },
});
*/