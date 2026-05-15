import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// The app's primary dark-red brand color, reused throughout this screen.
const MAROON = '#5A1F1F';

// WelcomeScreen is the first screen users see when they open the app.
// It walks them through a two-step intro:
//   Step 0: Shows a "Welcome" greeting for a moment, then fades out automatically.
//   Step 1: Asks for the user's name, then lets them tap "Continue" to enter the app.
export default function WelcomeScreen() {
  // router lets us navigate to a different screen programmatically (without the user tapping a link).
  const router = useRouter();

  // step tracks which part of the welcome flow is currently showing (0 = greeting, 1 = name input).
  const [step, setStep] = useState(0);

  // name stores what the user types into the name field.
  const [name, setName] = useState('');

  // fade is an animated number between 0 (invisible) and 1 (fully visible).
  // It controls how transparent the content is during transitions.
  const fade = useRef(new Animated.Value(1)).current;

  // slide is an animated number controlling how far the content is shifted up or down (in pixels).
  // It creates a gentle slide-in effect when a new step appears.
  const slide = useRef(new Animated.Value(0)).current;

  // ─── STEP ANIMATION ─────────────────────
  // This effect runs every time `step` changes.
  // It instantly hides the content (fade=0, slide=10) then smoothly fades and slides it back in.
  useEffect(() => {
    fade.setValue(0);
    slide.setValue(10);

    // Run the fade-in and slide-up animations at the same time.
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, [step]);

  // ─── WELCOME DELAY (LONGER) ─────────────
  // This effect runs once when the screen first loads.
  // After holding the "Welcome" greeting for 1.8 seconds, it slowly fades out
  // and then advances to step 1 (the name input) automatically.
  useEffect(() => {
    const t = setTimeout(() => {
      // slower, more intentional transition
      Animated.timing(fade, {
        toValue: 0,
        duration: 1200, // 👈 slower fade-out
        useNativeDriver: true,
      }).start(() => {
        // Once the fade-out finishes, move to the next step.
        setStep(1);
      });
    }, 1800); // 👈 longer welcome hold

    // If this screen is removed before the timer fires, cancel it to avoid errors.
    return () => clearTimeout(t);
  }, []);

  // enterApp runs when the user taps "Continue" after entering their name.
  // It fades and slides the content away, then navigates to the main tab bar screen,
  // passing the user's name along so it can be displayed on the home screen.
  const enterApp = () => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: -20,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // small delay ensures navigator is mounted
      setTimeout(() => {
        router.replace({
          pathname: '/(tabs)',
          params: { name },
        });
      }, 50);
    });
  };

  return (
    // The full-screen dark-red background container.
    <View style={styles.container} pointerEvents="box-none">

      {/* Animated.View wraps the content so the fade and slide animations apply to everything inside. */}
      <Animated.View
        style={[
          styles.center,
          {
            opacity: fade,
            transform: [{ translateY: slide }],
          },
        ]}
      >

        {/* STEP 0 */}
        {/* This only shows when step === 0. It displays the initial "Welcome" greeting. */}
        {step === 0 && (
          <Text style={styles.title}>Welcome</Text>
        )}

        {/* STEP 1 */}
        {/* This only shows when step === 1. It displays the name-entry form. */}
        {step === 1 && (
          <>
            <Text style={styles.title}>What is your name?</Text>

            {/* TextInput is a field the user can type into. It updates the name variable as they type. */}
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#bbb"
              style={styles.input}
            />

            {/* The Continue button is disabled (grayed out) until the user types at least one character. */}
            <Pressable
              onPress={enterApp}
              disabled={!name.trim()}
              style={[
                styles.button,
                !name.trim() && styles.disabled,
              ]}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </Pressable>
          </>
        )}

      </Animated.View>
    </View>
  );
}

// ─── STYLES ─────────────────────────────
// All visual styling for this screen is defined here and referenced by name above.

const styles = StyleSheet.create({
  // The full-screen dark-red background that covers the whole phone.
  container: {
    flex: 1,
    backgroundColor: MAROON,
    justifyContent: 'center',
    padding: 24,
  },
  // Centers all child elements and adds space between them.
  center: {
    alignItems: 'center',
    gap: 18,
  },
  // Large white bold text for the greeting and the question.
  title: {
    color: 'white',
    fontSize: 36,
    fontWeight: '600',
    textAlign: 'center',
  },
  // The white text field where the user types their name.
  input: {
    width: '100%',
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
  },
  // The white "Continue" button.
  button: {
    marginTop: 20,
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 14,
  },
  // Text inside the Continue button — dark red to contrast with the white button background.
  buttonText: {
    color: MAROON,
    fontWeight: '600',
    fontSize: 16,
  },
  // Makes the button look faded/grayed out when it is disabled (no name typed yet).
  disabled: {
    opacity: 0.4,
  },
});
