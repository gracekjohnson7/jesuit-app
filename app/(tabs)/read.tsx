import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// This is the "Read" tab screen. It is currently a placeholder while the feature is being built.
// When finished, it will display the full text of the Jesuit Constitutions for reading.
export default function ReadScreen() {
  return (
    // SafeAreaView keeps content inside the visible area of the phone,
    // avoiding the camera notch at the top and the home-bar gesture area at the bottom.
    <SafeAreaView style={{ flex: 1 }}>
      {/* This View centers the placeholder text both horizontally and vertically on the screen. */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 17, opacity: 0.4 }}>Coming Soon: The Constitutions</Text>
      </View>
    </SafeAreaView>
  );
}
