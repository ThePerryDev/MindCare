import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

export default function Navbar() {
  return (
    <View style={styles.container}>
      <Ionicons name='home' size={24} color='#8E54E9' />
      <Ionicons name='book-outline' size={24} color='#B5B5B5' />
      <Ionicons name='chatbubble-outline' size={28} color='#8E54E9' />
      <Ionicons name='person-outline' size={24} color='#B5B5B5' />
      <Ionicons name='settings-outline' size={24} color='#B5B5B5' />
    </View>
  );
}
