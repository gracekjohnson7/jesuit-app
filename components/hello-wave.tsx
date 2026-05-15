import Animated from 'react-native-reanimated';

// HelloWave renders a waving-hand emoji that plays a small rotation animation,
// making the hand look like it's waving back and forth.
export function HelloWave() {
  return (
    // Animated.Text is like a regular text element, but it can be animated.
    // The animationName here defines a keyframe: at 50% through the animation,
    // the emoji rotates 25 degrees, creating the waving motion.
    <Animated.Text
      style={{
        fontSize: 28,
        lineHeight: 32,
        marginTop: -6,
        animationName: {
          '50%': { transform: [{ rotate: '25deg' }] },
        },
        animationIterationCount: 4,
        animationDuration: '300ms',
      }}>
      👋
    </Animated.Text>
  );
}
