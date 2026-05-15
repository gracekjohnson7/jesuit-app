import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

// RootLayout is the outermost wrapper for the entire app.
// Every screen in the app lives inside this component. It sets up two things:
// 1. The color theme (dark or light) that all screens inherit.
// 2. The navigation stack, which controls which screens exist and how to move between them.
export default function RootLayout() {
  // Detect whether the phone is currently in dark mode or light mode.
  const colorScheme = useColorScheme();

  return (
    // ThemeProvider wraps everything so every screen automatically gets the right colors.
    // If the phone is in dark mode it uses DarkTheme; otherwise it uses the default light theme.
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

      {/* Stack manages the list of screens the user can navigate between.
          headerShown: false hides the default navigation bar — each screen controls its own header. */}
      <Stack screenOptions={{ headerShown: false }}>

        {/* MAIN APP */}
        {/* This loads the main tab bar and all tabs (Read, Reflect, Ask AI). */}
        <Stack.Screen name="(tabs)" />

        {/* OTHER SCREENS */}
        {/* The full passage reading screen — shows a header bar with a back button. */}
        <Stack.Screen
          name="passage"
          options={{
            headerShown: true,
            title: 'Passage of the Day',
            headerBackTitle: 'Reflect',
          }}
        />

        {/* The Attention topic screen — shows a header bar with a back button labeled "Home". */}
        <Stack.Screen name="attention" options={{ headerShown: true, headerBackTitle: 'Home', }} />

        {/* The modal screen — slides up from the bottom as an overlay sheet. */}
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />

      </Stack>

      {/* StatusBar controls the appearance of the system status bar at the top of the phone
          (where the clock, battery, and signal icons are). "auto" adapts it to the current theme. */}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
