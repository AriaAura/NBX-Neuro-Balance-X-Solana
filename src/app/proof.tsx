import { router, useLocalSearchParams } from 'expo-router';
import { Animated, Linking, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { explorerTxUrl } from '@/solana/config';
import { assets, NeuroOrb, PillButton, Screen, useFloat } from '@/ui/kit';
import { color, font } from '@/ui/theme';

/** Shown right after a check-in lands on-chain. Day 7 gets the streak badge. */
export default function Proof() {
  const { day, sig } = useLocalSearchParams<{ day: string; sig: string }>();
  const n = Number(day ?? 0);
  const float = useFloat(6);

  return (
    <Screen style={styles.root}>
      <View style={styles.hero}>
        {n === 7 ? (
          <Animated.View style={float}>
            <Image source={assets.badge} style={styles.badge} contentFit="contain" />
          </Animated.View>
        ) : (
          <NeuroOrb size={240} streak={n}>
            <Text style={styles.orbNumber}>{n}</Text>
          </NeuroOrb>
        )}
      </View>

      <View style={styles.copy}>
        <Text style={styles.title}>Day {n} recorded on Solana</Text>
        <View style={styles.rule} />
        <Text style={styles.sub}>1 meal unlocked in the Food Pool</Text>
        {sig ? (
          <Text style={styles.link} onPress={() => Linking.openURL(explorerTxUrl(sig))}>
            View your proof on Solana Explorer
          </Text>
        ) : null}
      </View>

      <PillButton label="Continue" onPress={() => router.back()} style={styles.cta} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', justifyContent: 'space-between', paddingVertical: 24 },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badge: { width: 280, height: 410 },
  orbNumber: {
    fontFamily: font.heavy,
    fontSize: 84,
    color: '#FFFFFF',
    letterSpacing: -3,
    textShadowColor: 'rgba(90,110,220,0.55)',
    textShadowRadius: 18,
  },
  copy: { alignItems: 'center', gap: 12, marginBottom: 28 },
  title: { fontFamily: font.semibold, fontSize: 26, color: color.ink, textAlign: 'center' },
  rule: { width: 220, height: 1, backgroundColor: color.hairline },
  sub: { fontFamily: font.medium, fontSize: 17, color: color.inkSoft },
  link: { fontFamily: font.medium, fontSize: 15, color: color.blue, marginTop: 6 },
  cta: { alignSelf: 'stretch', marginHorizontal: 40 },
});
