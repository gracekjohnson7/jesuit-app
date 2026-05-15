import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Image } from 'react-native';

import { Fonts } from '@/constants/theme';

import { useLocalSearchParams } from 'expo-router';


// HomeScreen is the main "Reflect" tab — the central screen users see after completing the welcome flow.
// It shows the daily passage, a grid of topic buttons, and a news section.
export default function HomeScreen() {
  // router lets us navigate to other screens when the user taps something.
  const router = useRouter();

  // insets gives us the safe area measurements for this device (e.g. how tall the notch is
  // and how much space the home-bar gesture area takes at the bottom).
  const insets = useSafeAreaInsets();

  // name is the user's name that was passed in from the welcome screen.
  // useLocalSearchParams reads the URL-style parameters that were attached when navigating here.
  const { name } = useLocalSearchParams();

  // handlePassagePress runs when the user taps the daily passage card.
  // On iPhone it first triggers a medium-strength vibration, then opens the passage screen.
  const handlePassagePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push('/passage');
  };

  return (
    <View style={styles.screen}>

      {/* HERO */}
      {/* The dark-red header strip at the top of the screen.
          paddingTop uses the inset value so the content starts below the phone's notch. */}
      <View style={[styles.hero, { paddingTop: insets.top + 16 }]}>

        {/* heroRow lays out the greeting and the streak badge side by side. */}
        <View style={styles.heroRow}>

          {/* The personalized greeting — shows the user's name, or "there" if no name was provided. */}
          <Text style={styles.heroTitle}>
            Hello, {name || 'there'}!
          </Text>

          {/* The streak badge — a yellow pill showing the user's current reading streak. */}
          <View style={styles.streak}>
            <View style={styles.starBadge}>
              <Text style={styles.starText}>⭐</Text>
              <Text style={styles.starNumber}>7</Text>
            </View>
          </View>
        </View>
      </View>

      {/* CONTENT */}
      {/* The scrollable body of the screen.
          bounces={false} and overScrollMode="never" prevent the rubbery bounce effect when scrolling past the edges. */}
      <ScrollView
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >

        {/* PASSAGE */}
        {/* The section label and daily passage card. Tapping the card navigates to the full passage screen. */}
        <Text style={styles.sectionLabel}>Paragraph of the Day</Text>

        <Pressable onPress={handlePassagePress} style={styles.passageCard}>
          <Text style={styles.passageTitle}>Guard the Senses</Text>

          {/* A short excerpt from the passage to entice the user to read more. */}
          <Text style={styles.passagePreview}>
            [250] "All should take special care to guard with great diligence the gates of their senses…"
          </Text>
          

          <Text style={styles.readMore}>Tap to read more →</Text>
        </Pressable>

        {/* TOPICS */}
        {/* The section label and grid of topic buttons.
            Each button navigates to its topic screen; currently only "Attention" is wired up. */}
        <Text style={styles.sectionLabel}>Browse Paragraphs by Topic</Text>

        {/* The grid lays out topic buttons in rows of 3, wrapping to the next row when full. */}
       <View style={styles.grid}>
        {[
          'Attention',
          'Availability',
          'Community',
          'Devotion',
          'Dialogue',
          'Formation',
          'Mission',
          'Obedience',
          'Poverty',
        ].map((item) => (
          // Each item in the array becomes a tappable button tile.
          <Pressable
            key={item}
            style={styles.gridButton}
            onPress={() => {
              // Only "Attention" is linked to a real screen right now; the rest do nothing yet.
              if (item === 'Attention') {
                router.push('/attention');
              }
            }}
          >
            <Text style={styles.gridText}>{item}</Text>
          </Pressable>
        ))}
      </View>

        {/* NEWS */}
        {/* The section label and news card, which groups multiple articles together in one card. */}
        <Text style={styles.sectionLabel}>News</Text>

        <View style={styles.newsCard}>

          {/* ARTICLE 1 */}
          {/* A tappable news article row with a thumbnail image on the left and text on the right. */}
          <Pressable style={styles.newsRow}>
            <Image
              source={require('../../assets/images/pope.jpg')}
              style={styles.newsImage}
            />

            <View style={styles.newsText}>
              <Text style={styles.newsTitle}>
                Vatican Reflection on Modern Devotion
              </Text>
              <Text style={styles.newsDescription}>
                A renewed call for simplicity, attention, and spiritual clarity in daily life.
              </Text>
            </View>
          </Pressable>

          {/* DIVIDER */}
          {/* A thin horizontal line separating the two articles. */}
          <View style={styles.newsDivider} />

          {/* ARTICLE 2 */}
          {/* A second tappable news article row. */}
          <Pressable style={styles.newsRow}>
            <Image
              source={require('../../assets/images/vatican.jpg')}
              style={styles.newsImage}
            />

            <View style={styles.newsText}>
              <Text style={styles.newsTitle}>
                Pilgrims Gather in St. Peter's Square
              </Text>
              <Text style={styles.newsDescription}>
                Thousands gather in Rome for prayer, reflection, and global unity.
              </Text>
            </View>
          </Pressable>

          {/* VIEW MORE */}
          {/* A thin divider and a "view more" link at the bottom of the news card. */}
          <View style={styles.newsDivider} />

          <Pressable style={styles.viewMore}>
            <Text style={styles.viewMoreText}>Tap to view more →</Text>
          </Pressable>

        </View>
      </ScrollView>
    </View>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────
// All visual styling for this screen is defined here and referenced by name above.

// The app's primary dark-red brand color.
const MAROON = '#5A1F1F';

// The light blush background color used behind cards.
const CARD = '#FFF6F6';

const styles = StyleSheet.create({
  // The full-screen background container.
  screen: {
    flex: 1,
    backgroundColor: CARD,
  },

  // HERO
  // The dark-red header strip at the top.
  hero: {
    backgroundColor: MAROON,
    paddingHorizontal: 24,
    paddingBottom: 22,

    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  // Lays out the greeting and streak badge side by side.
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // The large "Hello, [name]!" text in the header.
  heroTitle: {
    color: 'white',
    fontSize: 34,
    fontFamily: Fonts?.serif ?? 'serif',
    fontWeight: '600',
  },
  // Container for the streak badge, centered vertically.
  streak: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // The yellow pill badge showing the star and streak number.
  starBadge: {
    backgroundColor: '#FFD54A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,

    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,

    shadowColor: '#FFD54A',
    shadowOpacity: 0.7,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  // The star emoji inside the badge.
  starText: {
    fontSize: 23,
  },
  // The streak count number inside the badge.
  starNumber: {
    fontSize: 23,
    fontWeight: '700',
    color: '#3E2F00',
  },
  streakNumber: {
    color: 'white',
    fontSize: 25,
    fontWeight: '600',
  },
  fire: {
    fontSize: 35,
  },

  // CONTENT
  // Padding around the scrollable body content.
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // The small uppercase section label that appears above each group of content.
  sectionLabel: {
    fontSize: 18,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#6B4B4B',
    marginTop: 20,
    marginBottom: 16,
    fontWeight: '600',
  },

  // PASSAGE CARD
  // The white rounded card for the daily passage.
  passageCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 18,

    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  // The passage title text.
  passageTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    fontFamily: Fonts?.serif ?? 'serif',
  },
  // The short excerpt text below the title.
  passagePreview: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.75,
  },
  // The "Tap to read more →" link text.
  readMore: {
    marginTop: 10,
    fontSize: 13,
    color: MAROON,
    fontWeight: '600',
  },

  // GRID (BIGGER TILES)
  // The grid container — lays out buttons in rows, wrapping automatically.
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  // Each individual topic button tile — takes up roughly 1/3 of the row.
  gridButton: {
    width: '31%',
    backgroundColor: 'white',
    paddingVertical: 32,
    marginBottom: 14,
    borderRadius: 18,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  // The topic label text inside each grid button.
  gridText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },

  // NEWS
  // The white rounded card that wraps all news articles.
  newsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginTop: 10,
    overflow: 'visible',

    paddingTop: 8,
    paddingBottom: 6,

    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  // A single news article row (thumbnail image + text side by side).
  newsRow: {
    flexDirection: 'row',
    padding: 15,
  },
  // The article headline text.
  newsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  newsSub: {
    fontSize: 14,
    opacity: 0.6,
  },
  newsContainer: {
    marginTop: 10,
  },
  newsItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  // The thumbnail image on the left of each news row.
  newsImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  // The text container on the right of each news row — takes up the remaining space.
  newsText: {
    flex: 1,
    justifyContent: 'center',
  },
  newsTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  // The article description text below the headline.
  newsDescription: {
    fontSize: 15,
    opacity: 0.6,
    lineHeight: 20,
  },
  // The "Tap to view more" button at the bottom of the news card.
  viewMore: {
    marginTop: 4,
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewMoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5A1F1F',
  },
  // A thin horizontal line separating news articles inside the card.
  newsDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginHorizontal: 14,
  },
});
