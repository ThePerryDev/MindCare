// AnimatedLoader.native.tsx
import LottieView from 'lottie-react-native';
import type { AnimationObject } from 'lottie-react-native';
import type { StyleProp, ViewStyle } from 'react-native';

type AnimatedLoaderProps = {
  source: string | { uri: string } | AnimationObject;
  style?: StyleProp<ViewStyle>;
};

export default function AnimatedLoader({ source, style }: AnimatedLoaderProps) {
  return <LottieView source={source} autoPlay loop style={style} />;
}
