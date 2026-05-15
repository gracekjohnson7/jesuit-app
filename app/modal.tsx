import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

// ThemedText and ThemedView are custom components that automatically switch colors
// for dark mode and light mode — you don't have to handle that manually.
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// This is a placeholder modal screen. A "modal" is a pop-up sheet that slides up from the bottom
// and sits on top of whatever screen the user was already on.
export default function ModalScreen() {
  return (
    // ThemedView is a box/container that automatically uses the right background color for dark or light mode.
    <ThemedView style={styles.container}>
      <ThemedText type="title">This is a modal</ThemedText>

      {/* This link closes the modal and sends the user back to the home screen. */}
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Go to home screen</ThemedText>
      </Link>
    </ThemedView>
  );
}

// All visual styling (sizes, spacing, alignment) is defined here and referenced by name above.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
