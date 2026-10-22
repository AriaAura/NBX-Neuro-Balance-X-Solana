import { Redirect } from 'expo-router';

import { useStreak } from '@/state/streak';

export default function Index() {
  const { ready, onboarded } = useStreak();
  if (!ready) return null;
  return <Redirect href={onboarded ? '/home' : '/welcome'} />;
}
