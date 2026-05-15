// This file re-exports React Native's built-in hook for detecting whether the phone
// is currently in dark mode or light mode. Other parts of the app import useColorScheme
// from here so all color-scheme detection flows through one central place.
export { useColorScheme } from 'react-native';
