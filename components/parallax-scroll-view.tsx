import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

// How tall the header image area is at the top of the screen (in pixels).
const HEADER_HEIGHT = 250;

// Props describes what this component expects to receive:
// - headerImage: the image element to show in the header
// - headerBackgroundColor: background colors for dark and light mode
// - children: the scrollable page content that appears below the header
type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

// ParallaxScrollView is a scrollable page with a large image header at the top.
// As the user scrolls down, the header image moves at a slower speed than the content,
// creating a "parallax" depth effect (like looking through a window while moving).
export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  // Get the background color for the current theme (dark or light).
  const backgroundColor = useThemeColor({}, 'background');
  const colorScheme = useColorScheme() ?? 'light';

  // scrollRef is a reference to the scroll view so we can read its position.
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  // scrollOffset tracks how many pixels the user has scrolled down.
  const scrollOffset = useScrollOffset(scrollRef);

  // headerAnimatedStyle calculates how the header image should move and scale
  // based on how far the user has scrolled, creating the parallax effect.
  // When scrolling down, the header moves up more slowly than the content.
  // When pulling down (overscroll), the header zooms in slightly.
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    // The outer scroll view covers the full screen and uses the theme background color.
    <Animated.ScrollView
      ref={scrollRef}
      style={{ backgroundColor, flex: 1 }}
      scrollEventThrottle={16}>

      {/* The header image sits at the top and moves with the parallax animation. */}
      <Animated.View
        style={[
          styles.header,
          { backgroundColor: headerBackgroundColor[colorScheme] },
          headerAnimatedStyle,
        ]}>
        {headerImage}
      </Animated.View>

      {/* The main page content appears below the header and scrolls at normal speed. */}
      <ThemedView style={styles.content}>{children}</ThemedView>
    </Animated.ScrollView>
  );
}

// Styles for the container, header image area, and content area below it.
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
});
