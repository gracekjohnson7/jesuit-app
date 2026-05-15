import { Stack } from 'expo-router';
import { useRef } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Image } from 'react-native';

import { Fonts } from '@/constants/theme';

// ─── Data ────────────────────────────────────────────────────────────────────

// PassageLine describes the shape of each individual line of the scripture passage.
// id: a unique number to identify the line; text: the actual words.
type PassageLine = { id: number; text: string };

// ArticleSection describes one commentary block below the passage.
// id: unique number; highlightedLines: which passage line numbers light up for this section;
// heading: the section title; body: the commentary paragraph text.
type ArticleSection = {
  id: number;
  highlightedLines: number[];
  heading: string;
  body: string;
};

// The scripture passage broken into individual lines (chunks).
// Each line can be independently highlighted as the user scrolls through the commentary.
const PASSAGE_LINES: PassageLine[] = [
  { id: 0, text: '[250] \"All should take special care to guard with great diligence the gates of their senses' },
  { id: 1, text: '(especially the eyes, ears, and tongue)' },
  { id: 2, text: 'from all disorder,' },
  { id: 3, text: 'and to show this by their silence when it should be kept and, when they must speak,' },
  { id: 4, text: 'by the discretion and edification of their words, the modesty of their countenance, the maturity of their walk, and all their movements, without giving any sign of impatience or pride.\"' },
];

// The commentary sections — one per scroll stop.
// Each section specifies which passage line(s) it discusses (highlightedLines),
// so those lines glow while the user reads that part of the article.
const ARTICLE_SECTIONS: ArticleSection[] = [
  {
    id: 0,
    highlightedLines: [0, 1, 2, 3, 4],
    heading: 'Guard the Senses',
    body:
      'This paragraph reflects a discipline of attention — not as restriction, but as formation. It suggests that what we allow into perception shapes the inner life itself. This paragraph reflects a discipline of attention — not as restriction, but as formation. It suggests that what we allow into perception shapes the inner life itself.',
  },
  {
    id: 1,
    highlightedLines: [0, 2],
    heading: 'Attention as Formation',
    body: 'There\'s a quiet assumption here that attention is not neutral — it forms you. What you allow yourself to see, hear, and absorb slowly becomes the architecture of your inner life. \n\nIn that sense, "disorder" isn\'t just external noise. It\'s anything that scatters the mind away from clarity, patience, or intention. The line suggests that discipline begins not in action, but in what we permit to enter us. \n\nAt its core, this is less about restriction and more about coherence — the idea that a centered life is built through selective openness.',
  },
  {
    id: 2,
    highlightedLines: [1],
    heading: 'The World Enters in Fragments',
    body: 'The senses are not just passive receivers; they are active thresholds between inner and outer life. What we see, what we hear, and what we say are the primary ways the world gets re-written inside us. \n\nThis line quietly collapses the distance between input and identity. It suggests that the self is porous — shaped continuously by what it consumes and repeats.',
  },
  {
    id: 3,
    highlightedLines: [3],
    heading: 'Silence as Choice',
    body: 'Silence is not presented as absence, but as an active decision. Knowing when not to speak becomes a kind of intelligence — a way of resisting impulsivity and performance. Speech, then, is framed as something earned rather than automatic. The pause before speaking is where intention is tested. \n\nThere\'s also an ethical dimension here: restraint is not withdrawal from others, but respect for them — and for the weight of words themselves.',
  },
  {
    id: 4,
    highlightedLines: [4],
    heading: 'The Body as Language',
    body: 'Character is not confined to speech. It extends into posture, expression, movement — the entire visible self becomes communicative. What stands out is the idea that interior discipline is measurable externally. Not in perfection, but in tone: patience instead of impatience, humility instead of pride. \n\nThis is less about self-surveillance and more about coherence — the alignment between inner intention and outward presence, where even ordinary movement becomes a kind of ethical expression.',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function PassageScreen() {
  // insets gives the safe area sizes (notch height, home bar height) so content isn't hidden.
  const insets = useSafeAreaInsets();

  // windowHeight is the total visible height of the phone screen in pixels.
  const { height: windowHeight } = useWindowDimensions();

  //const panelBg = isDark ? '#1C1C1E' : '#FFFFFF';
  // Background colors used on this screen.
  const panelBg = '#F8EAEA';
  const screenBg = '#FFFAFA';
  const articleText = '#1A1A1A';
  const borderColor = 'rgba(0,0,0,0.08)';

  // Scroll tracking
  // scrollY is an animated number that always reflects how far the user has scrolled down (in pixels).
  const scrollY = useSharedValue(0);

  // scrollHandler is attached to the ScrollView and updates scrollY on every scroll event.
  // 'worklet' means this code runs on the animation thread (not the main JS thread) for smoothness.
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      'worklet';
      scrollY.value = event.contentOffset.y;
    },
  });

  // Section offset measurement (JS ref + mirrored shared value)
  // N is the total number of commentary sections.
  const N = ARTICLE_SECTIONS.length;

  // sectionOffsetsRef stores each section's vertical position on screen (measured in pixels from the top).
  // It's a regular JavaScript reference array — fast to write to from layout events.
  const sectionOffsetsRef = useRef<number[]>(new Array(N).fill(0));

  // sectionOffsets is the animated version of the same array, readable from the animation thread.
  const sectionOffsets = useSharedValue<number[]>(new Array(N).fill(0));

  // Trigger point: 35% down the visible scroll area
  // When the user's scroll position passes a section's offset minus this trigger distance,
  // that section becomes "active" and its highlighted lines light up.
  const triggerOffset = useSharedValue(windowHeight * 0.35);

  // Derive which passage line is active
  // activeLines automatically recalculates which passage lines should be highlighted
  // based on where the user has scrolled. It returns an array of line IDs to highlight.
  const activeLines = useDerivedValue(() => {
  'worklet';

    const offsets = sectionOffsets.value;
    // y is the effective scroll position, shifted by the trigger point.
    const y = scrollY.value + triggerOffset.value;

    let activeSection = 0;

    // Loop through each section's position. Whichever section's top edge is at or above
    // the trigger point is considered the currently active section.
    for (let i = 0; i < offsets.length; i++) {
      if (offsets[i] <= y) {
        activeSection = i;
      }
    }

    return ARTICLE_SECTIONS[activeSection].highlightedLines;
  });

  // One progress shared value per passage line (0 = dim, 1 = highlighted)
  // Each of these five values controls how highlighted one specific line of the passage is.
  // 0 = fully dimmed (gray), 1 = fully highlighted (black).
  const progress0 = useSharedValue(1);
  const progress1 = useSharedValue(0);
  const progress2 = useSharedValue(0);
  const progress3 = useSharedValue(0);
  const progress4 = useSharedValue(0);

  // An array holding all five progress values so they can be looped over.
  const progresses = [
    progress0, progress1, progress2, progress3, progress4,
  ];

  // Drive highlight transitions when activeIndex changes
  // useAnimatedReaction watches activeLines and responds whenever it changes.
  // For each passage line, it smoothly animates the highlight on (1) or off (0) over 350ms.
  useAnimatedReaction(
  () => activeLines.value,
  (lines) => {
    'worklet';

    const allProgresses = [
      progress0,
      progress1,
      progress2,
      progress3,
      progress4,
    ];

    for (let i = 0; i < allProgresses.length; i++) {
      // Check whether this line's ID is in the current section's highlighted list.
      const shouldHighlight = lines.includes(i);

        // Animate the line's progress value to 1 (highlight) or 0 (dim) smoothly.
        allProgresses[i].value = withTiming(
          shouldHighlight ? 1 : 0,
          { duration: 350 }
        );
      }
    }
  );

  // Animated styles — one per line (hooks must be called unconditionally at top level)
  // Each style calculates the opacity and color for one passage line based on its progress value.
  // When progress = 0: opacity is 0.22 (dim) and color is gray (#9A9A9A).
  // When progress = 1: opacity is 1.0 (fully visible) and color is black (#000000).
  const line0Style = useAnimatedStyle(() => ({
    opacity: interpolate(progress0.value, [0, 1], [0.22, 1]),
    color: interpolateColor(progress0.value, [0, 1], ['#9A9A9A', '#000000']),
  }));
  const line1Style = useAnimatedStyle(() => ({
    opacity: interpolate(progress1.value, [0, 1], [0.22, 1]),
    color: interpolateColor(progress1.value, [0, 1], ['#9A9A9A', '#000000']),
  }));
  const line2Style = useAnimatedStyle(() => ({
    opacity: interpolate(progress2.value, [0, 1], [0.22, 1]),
    color: interpolateColor(progress2.value, [0, 1], ['#9A9A9A', '#000000']),
  }));
  const line3Style = useAnimatedStyle(() => ({
    opacity: interpolate(progress3.value, [0, 1], [0.22, 1]),
    color: interpolateColor(progress3.value, [0, 1], ['#9A9A9A', '#000000']),
  }));
  const line4Style = useAnimatedStyle(() => ({
    opacity: interpolate(progress4.value, [0, 1], [0.22, 1]),
    color: interpolateColor(progress4.value, [0, 1], ['#9A9A9A', '#000000']),
  }));

  // Collect all five line styles in order so they can be accessed by index.
  const lineStyles = [
    line0Style, line1Style, line2Style, line3Style, line4Style,
  ];

  return (
    <View style={[styles.screen, { backgroundColor: screenBg }]}>

      {/* Stack.Screen customizes the navigation header bar for this screen. */}
      <Stack.Screen options={{
        title: 'Paragraph of the Day',
        headerBackTitle: 'Home',

        headerStyle: {
          backgroundColor: '#F8EAEA', // same maroon as hero/tab bar
        },

        headerTintColor: 'white', // back arrow + title
        headerTitleStyle: {
          color: 'black',
          fontFamily: Fonts?.serif ?? 'serif',
        },

        headerShadowVisible: false, // removes default divider line
      }}
    />

      {/* Sticky passage panel */}
      {/* This panel stays fixed at the top of the screen while the article scrolls beneath it.
          It displays all the passage lines; each line fades in or out as the user scrolls. */}
      <View
        style={[
          styles.passagePanel,
          {
            backgroundColor: panelBg,
            borderBottomColor: borderColor,
            paddingTop: 12,
          },
        ]}
      >
        {/* Render each passage line as an Animated.Text so it can be faded/colored independently. */}
        <Text style={styles.passageBlock}>
          {PASSAGE_LINES.map((line, i) => (
            <Animated.Text key={line.id} style={lineStyles[i]}>
              {line.text + ' '}
            </Animated.Text>
          ))}
        </Text>
      </View>

      {/* Scrollable article */}
      {/* The commentary sections scroll beneath the sticky passage panel.
          scrollEventThrottle={16} means scroll position is reported up to 60 times per second (every 16ms). */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: insets.bottom + 48 }}
      >
        {/* Render each commentary section. onLayout fires when the section first appears on screen
            and records its vertical position so the highlight system knows where each section starts. */}
        {ARTICLE_SECTIONS.map((section) => (
          <View
            key={section.id}
            style={[styles.section, { borderBottomColor: borderColor }]}
            onLayout={(e) => {
              // Save the vertical position of this section for the highlight trigger calculation.
              sectionOffsetsRef.current[section.id] = e.nativeEvent.layout.y;
              sectionOffsets.value = [...sectionOffsetsRef.current];
            }}
          >

            {/* The author row only appears on the very first section (id === 0).
                It shows a circular author photo, the author's name, and the date. */}
            {section.id === 0 && (
              <View style={{ marginBottom: 20 }}>
                {/* AUTHOR ROW */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Image
                    source={require('../assets/images/author.png')}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      marginRight: 10,
                    }}
                  />

                  <View>
                    <Text style={{ fontSize: 15, opacity: 0.6 }}>
                      COMMENTARY BY
                    </Text>
                    <Text style={{ fontSize: 17, fontWeight: '600' }}>
                      Fr. János Lukács SJ
                    </Text>
                    <Text style={{ fontSize: 15, opacity: 0.6 }}>
                      May 4, 2026
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* The section heading (bold title) for this commentary block. */}
            <Text style={[styles.sectionHeading, { color: articleText }]}>
              {section.heading}
            </Text>

            {/* The body paragraph for this commentary block. */}
            <Text style={[styles.sectionBody, { color: articleText }]}>
              {section.body}
            </Text>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
// All visual styling for this screen is defined here and referenced by name above.

const styles = StyleSheet.create({
  // The full-screen background container.
  screen: {
    flex: 1,
  },

  // The sticky panel at the top that holds the passage text.
  // The shadow makes it appear to float above the scrollable article below.
  passagePanel: {
    paddingHorizontal: 24,
    paddingBottom: 18,

    backgroundColor: '#F8EAEA',

    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',

    // shadow (iOS)
    shadowColor: '#000',
    shadowOpacity: 0.23,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    // shadow (Android)
    elevation: 14,
  },

  // Styling for a small source label (currently unused but available).
  passageSource: {
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#999',
    marginBottom: 10,
  },

  // Each commentary section block — tall enough to fill most of the screen
  // so scrolling feels intentional between sections.
  section: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    minHeight: 240,
    //borderBottomWidth: StyleSheet.hairlineWidth,
  },

  // The bold section heading text for each commentary block.
  sectionHeading: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 14,
    letterSpacing: -0.3,
  },

  // The body paragraph text for each commentary block.
  sectionBody: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 17,
    lineHeight: 28,
    opacity: 0.85,
  },

  // The passage text block in the sticky panel — larger line spacing for readability.
  passageBlock: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 16,
    lineHeight: 27,
    letterSpacing: 0.2,
  },
});
