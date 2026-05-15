import { Stack } from 'expo-router';

// This tells the auth navigator which screen to load first when someone enters this folder.
// "welcome" means the welcome.tsx screen is shown first.
export const unstable_settings = {
  initialRouteName: 'welcome',
};

// This is the navigation container for all authentication screens (the screens shown before logging in).
// Right now the only screen here is the welcome screen.
// headerShown: false hides the top navigation bar so the welcome screen has a clean, full-screen look.
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
