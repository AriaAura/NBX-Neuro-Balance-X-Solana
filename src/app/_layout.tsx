import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { StreakProvider } from '@/state/streak';
import { color } from '@/ui/theme';

// Inter is embedded at build time by the expo-font config plugin (see app.json),
// so there is no font-loading state here.
export default function RootLayout() {
  return (
    <StreakProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: color.bg },
        }}
      >
        <Stack.Screen name="craving" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="proof" options={{ animation: 'fade_from_bottom' }} />
      </Stack>
    </StreakProvider>
  );
}
