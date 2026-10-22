import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { StreakProvider } from '@/state/streak';

export default function RootLayout() {
  return (
    <StreakProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </StreakProvider>
  );
}
