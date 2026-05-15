import { Fonts } from '@/constants/theme';
import { Stack, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// The app's primary dark-red brand color, used for the header and accent text on this screen.
const MAROON = '#5A1F1F';

// AttentionScreen shows a list of passages organized under the "Attention" topic.
// The first card links to the real passage; the remaining cards are placeholders for future content.
export default function AttentionScreen() {
  // router lets us navigate to another screen when the user taps a card.
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* HEADER */}
      {/* Stack.Screen lets us customize the header bar at the top of this screen.
          This sets the title, background color, and removes the default bottom shadow line. */}
      <Stack.Screen
        options={{
          title: 'Attention',
          headerStyle: { backgroundColor: MAROON },
          headerTintColor: 'white',
          headerShadowVisible: false,
        }}
      />

      {/* ScrollView makes the list of cards scrollable if there are more than fit on screen. */}
      <ScrollView contentContainerStyle={styles.content}>

        {/* CARD 1 (REAL PASSAGE) */}
        {/* This is the only real passage card. Tapping it navigates to the full passage screen. */}
        <Pressable
          style={styles.card}
          onPress={() => router.push('/passage')}
        >
          <Text style={styles.title}>Guard the Senses</Text>
          <Text style={styles.desc}>
            [250] "All should take special care to guard with great diligence the gates of their senses...""
          </Text>
          <Text style={styles.readMore}>Tap to read more →</Text>
        </Pressable>

        {/* MOCK CARDS */}
        {/* These 6 cards are placeholders to show how the layout will look when more passages are added.
            Array.from({ length: 6 }) creates an array of 6 empty items, and .map() renders a card for each one. */}
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.title}>Title goes here</Text>
            <Text style={styles.desc}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.
            </Text>
            <Text style={styles.readMore}>Tap to read more →</Text>
          </View>
        ))}

      </ScrollView>
    </View>
  );
}

// All visual styling for this screen is defined here and referenced by name above.
const styles = StyleSheet.create({
  // The full-screen background container with a light blush color.
  container: { flex: 1, backgroundColor: '#FFF6F6' },

  // Inner padding so cards don't touch the edges of the screen.
  content: { padding: 20 },

  // Each passage card: white background, rounded corners, and a subtle drop shadow.
  card: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  // The passage title text at the top of each card.
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    fontFamily: Fonts?.serif ?? 'serif',
  },

  // The preview text (excerpt or placeholder) below the title.
  desc: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },

  // The "Tap to read more →" link text at the bottom of each card.
  readMore: {
    marginTop: 10,
    fontSize: 13,
    color: MAROON,
    fontWeight: '600',
  },
});
