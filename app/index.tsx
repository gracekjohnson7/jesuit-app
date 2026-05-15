// This is the app's very first entry point. Its only job is to immediately send
// the user to the welcome screen as soon as the app opens. Nothing is displayed here.
import { Redirect } from 'expo-router';

// When this screen mounts, it instantly redirects to /welcome without showing anything.
export default function Index() {
  return <Redirect href="/welcome" />;
}
