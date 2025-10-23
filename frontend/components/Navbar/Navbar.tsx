import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { router, usePathname } from 'expo-router';

export { NAVBAR_HEIGHT } from './styles';

type NavRoute = '/home' | '/trails' | '/chat' | '/profile' | '/settings';

type NavItem = {
  route: NavRoute;
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
};

const NAV_ITEMS: NavItem[] = [
  { route: '/home', icon: 'home', size: 24 },
  { route: '/trails', icon: 'book-outline', size: 24 },
  { route: '/chat', icon: 'chatbubble-outline', size: 26 },
  { route: '/profile', icon: 'person-outline', size: 24 },
  { route: '/settings', icon: 'settings-outline', size: 24 },
];

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (route: NavRoute) => pathname === route;

  const go = (route: NavRoute) => () => {
    if (pathname !== route) {
      router.push(route as Parameters<typeof router.push>[0]);
    }
  };

  return (
    <View style={styles.container}>
      {NAV_ITEMS.map(({ route, icon, size = 24 }) => (
        <Pressable key={route} onPress={go(route)}>
          <Ionicons
            name={icon}
            size={size}
            color={isActive(route) ? '#8E54E9' : '#B5B5B5'}
          />
        </Pressable>
      ))}
    </View>
  );
}
