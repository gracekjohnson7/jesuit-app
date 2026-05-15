import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

// HapticTab is a custom tab bar button that adds a gentle vibration (haptic feedback)
// when the user presses a tab on iPhone. On Android and web it behaves like a normal button.
export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      // onPressIn fires the moment the user's finger touches the button, before they lift it.
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        // Also call the original onPressIn from the tab navigator (if one was provided).
        props.onPressIn?.(ev);
      }}
    />
  );
}
