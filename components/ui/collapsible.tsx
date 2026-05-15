import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Collapsible is a component that shows a title row the user can tap to expand or collapse
// a hidden section of content underneath it. Like an accordion drawer.
export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  // isOpen tracks whether the content section is currently expanded (true) or collapsed (false).
  const [isOpen, setIsOpen] = useState(false);

  // Detect whether the phone is in light or dark mode so the arrow icon gets the right color.
  const theme = useColorScheme() ?? 'light';

  return (
    <ThemedView>
      {/* TouchableOpacity is a tappable button that fades slightly when pressed.
          Tapping it flips isOpen between true and false, toggling the section open/closed. */}
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>

        {/* The chevron (›) arrow icon rotates 90° when the section is open,
            so it points down when expanded and to the right when collapsed. */}
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />

        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>

      {/* The content (children) only renders when isOpen is true — otherwise nothing is shown. */}
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

// Styles for the heading row and the content area below it.
const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
