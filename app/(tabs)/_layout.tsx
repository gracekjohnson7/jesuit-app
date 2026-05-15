import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

// The app's main dark-red brand color, used for the tab bar background.
const MAROON = '#5A1F1F';

// TabLayout defines the bottom tab bar — the row of buttons at the bottom of the screen
// that lets the user switch between the three main sections of the app.
export default function TabLayout() {
  // Detect dark or light mode (not currently used for tab styling, but available if needed).
  const colorScheme = useColorScheme();

  return (
    // Tabs renders the bottom navigation bar and manages switching between tab screens.
    <Tabs
      screenOptions={{
        // Hide the top header bar — each tab screen handles its own header.
        headerShown: false,

        // Use our custom HapticTab button so the phone vibrates softly when tabs are tapped on iPhone.
        tabBarButton: HapticTab,

        // 🔥 MAIN CHANGE: styling the bar itself
        // Visual styling for the tab bar at the bottom of the screen.
        tabBarStyle: {
          backgroundColor: MAROON,
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 18,
          paddingTop: 10,
        },

        // active/inactive colors
        // The selected tab's icon and label appear in white; unselected tabs appear in faded white.
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
      }}
    >

      {/* LEFT TAB */}
      {/* The "Read" tab — will eventually display the full Jesuit Constitutions text. */}
      <Tabs.Screen
        name="read"
        options={{
          title: 'Read',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="book.fill" color={color} />
          ),
        }}
      />

      {/* The "Reflect" tab — the main home screen where users see the daily passage. */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Reflect',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="square.and.pencil" color={color} />
          ),
        }}
      />

      {/* The "Ask AI" tab — will eventually let users ask questions using AI. */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Ask AI',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="bubble.left.and.bubble.right.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
