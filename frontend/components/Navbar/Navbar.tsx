import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { router, usePathname } from 'expo-router';

export { NAVBAR_HEIGHT } from './styles';

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (route: string) => pathname === route;
  const go = (route: string) => () => {
    if (pathname !== route) router.push(route);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={go('/home')}>
        <Ionicons
          name='home'
          size={24}
          color={isActive('/home') ? '#8E54E9' : '#B5B5B5'}
        />
      </Pressable>

      <Pressable onPress={go('/trails')}>
        <Ionicons
          name='book-outline'
          size={24}
          color={isActive('/trails') ? '#8E54E9' : '#B5B5B5'}
        />
      </Pressable>

      <Pressable onPress={go('/chat')}>
        <Ionicons
          name='chatbubble-outline'
          size={26}
          color={isActive('/chat') ? '#8E54E9' : '#B5B5B5'}
        />
      </Pressable>

      <Pressable onPress={go('/profile')}>
        <Ionicons
          name='person-outline'
          size={24}
          color={isActive('/profile') ? '#8E54E9' : '#B5B5B5'}
        />
      </Pressable>

      <Pressable onPress={go('/settings')}>
        <Ionicons
          name='settings-outline'
          size={24}
          color={isActive('/settings') ? '#8E54E9' : '#B5B5B5'}
        />
      </Pressable>
    </View>
  );
}
