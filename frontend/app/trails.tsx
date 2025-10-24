// frontend/app/trails.tsx
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';
export default function Trails() {
  return (
    <SafeAreaView
      // eslint-disable-next-line react-native/no-inline-styles
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <Text>Trilhas (em breve)</Text>
    </SafeAreaView>
  );
}
