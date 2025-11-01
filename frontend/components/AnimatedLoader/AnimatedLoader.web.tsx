import { View, ActivityIndicator, StyleProp, ViewStyle } from 'react-native';

interface AnimatedLoaderProps {
  style?: StyleProp<ViewStyle>;
}

export default function AnimatedLoader({ style }: AnimatedLoaderProps) {
  return (
    <View style={style}>
      <ActivityIndicator size='large' />
    </View>
  );
}
