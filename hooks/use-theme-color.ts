/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// useThemeColor is a helper function used throughout the app to pick the right color
// for the current theme. You pass it a color name (like 'text' or 'background') and
// optionally a custom light/dark color to use instead of the app's defaults.
export function useThemeColor(
  // props lets you pass a custom color for light mode and/or dark mode.
  // If you don't pass one, the app's default theme color is used instead.
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  // Find out if the device is in dark mode or light mode right now.
  const theme = useColorScheme() ?? 'light';

  // Check if a custom color was passed in for the current theme (light or dark).
  const colorFromProps = props[theme];

  // If a custom color was provided, use it. Otherwise, look up the color from the app's default palette.
  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
