import React from "react";
import { View, Text } from "react-native";
import Card from "@/components/Card/Card";
import { styles } from "./styles";

export default function WeeklyResults() {
  const results = [
    { label: "Dias Ativos", value: "0/7" },
    { label: "Humor Médio", value: "0.0" },
    { label: "Atividades Feitas", value: "0/7" },
    { label: "Trilhas Feitas", value: "0/10" },
  ];

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Resultado Semanal</Text>

      <View style={styles.row}>
        {results.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}
