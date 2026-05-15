import { Href, Link } from 'expo-router';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { type ComponentProps } from 'react';

// Props is the list of settings this component accepts. It's the same as a normal Link,
// except the href (the URL) must also be a plain string (not just any route object).
type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

// ExternalLink is a link component that opens URLs inside the app using an in-app browser,
// instead of jumping out to the phone's default browser. This keeps the user inside the app.
export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        // On a phone (not web), override the default link behavior.
        if (process.env.EXPO_OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
    />
  );
}
