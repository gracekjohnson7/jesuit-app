import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

// ThemedViewProps extends the normal View props to allow optional custom colors
// for light mode and dark mode.
export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

// ThemedView is a reusable box/container component that automatically sets its background color
// based on whether the phone is in dark or light mode. Use it anywhere you'd normally use a <View>
// and want the background to adapt to the user's theme automatically.
export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  // Look up the correct background color for the current theme (light or dark).
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
