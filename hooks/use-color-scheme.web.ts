import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
// This version of useColorScheme is only used when the app runs in a web browser.
// On the web, the app first renders on the server (where the browser's theme is unknown),
// then re-renders once inside the browser. hasHydrated tracks whether that second render has happened.
export function useColorScheme() {
  // hasHydrated starts as false. It switches to true once the browser has fully loaded the app.
  const [hasHydrated, setHasHydrated] = useState(false);

  // This runs once after the app loads in the browser, marking that hydration is complete.
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Ask React Native what the current color scheme is (dark or light).
  const colorScheme = useRNColorScheme();

  // Once the browser has loaded, return the real color scheme the user has set on their device.
  if (hasHydrated) {
    return colorScheme;
  }

  // Before the browser finishes loading, default to 'light' to avoid a flash of wrong colors.
  return 'light';
}
