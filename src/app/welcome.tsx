import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Logo, NeuroOrb, PillButton, Screen } from '@/ui/kit';
import { color, font } from '@/ui/theme';

// Splash. Each line of the promise carries one step of the blue → violet ramp,
// landing on slate for the last line, exactly as in the brand render.
const PROMISE: { text: string; tint: string }[] = [
  { text: 'Rewire your brain, fight', tint: color.blue },
  { text: 'your addictions, and', tint: color.indigo },
  { text: 'feed the world –', tint: color.violet },
  { text: 'one streak at a time.', tint: color.ink },
];

export default function Welcome() {
  return (
    <Screen style={styles.root}>
      <View style={styles.top}>
        <Logo size={56} />
        <View style={styles.promise}>
          {PROMISE.map((l) => (
            <Text key={l.text} style={[styles.line, { color: l.tint }]}>
              {l.text}
            </Text>
          ))}
        </View>
      </View>

      <NeuroOrb size={260} />
      <View style={styles.shadow} />

      <PillButton label="Get started" onPress={() => router.push('/avatar')} style={styles.cta} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', justifyContent: 'space-between', paddingVertical: 32 },
  top: { alignItems: 'center', gap: 36, marginTop: 24 },
  promise: { alignItems: 'center' },
  line: { fontFamily: font.medium, fontSize: 25, lineHeight: 36, textAlign: 'center' },
  shadow: {
    width: 150,
    height: 14,
    borderRadius: 100,
    marginTop: -40,
    boxShadow: '0px 18px 24px rgba(150,155,175,0.25)',
  },
  cta: { alignSelf: 'stretch', marginHorizontal: 32, marginBottom: 12 },
});
