import { router } from 'expo-router';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { useStreak } from '@/state/streak';
import { assets, LogoChip, Screen, useFloat } from '@/ui/kit';
import { color, font } from '@/ui/theme';

/**
 * Food Pool. One verified (on-chain) check-in = one meal funded from NBX
 * revenue. This is a revenue commitment, never an in-app donation flow.
 */
export default function FoodPool() {
  const { proofs } = useStreak();
  const meals = proofs.length;
  const float = useFloat(5, 4000);

  return (
    <Screen style={styles.root} filaments={false}>
      <LogoChip onPress={() => router.back()} />
      <Text style={styles.title}>Food Pool impact</Text>

      <Animated.View style={[styles.globeWrap, float]}>
        <View style={styles.halo} />
        <Image source={assets.globe} style={styles.globe} contentFit="contain" />
      </Animated.View>

      <View style={styles.copy}>
        <Text style={styles.lead}>Your streak has funded</Text>
        <Text style={styles.big}>
          {meals} {meals === 1 ? 'meal' : 'meals'}
        </Text>
        <Text style={styles.note}>
          Every meal is matched to a check-in recorded on Solana, and paid for from NBX revenue.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { paddingTop: 8, paddingBottom: 32, alignItems: 'center' },
  title: {
    fontFamily: font.medium,
    fontSize: 26,
    letterSpacing: 1.2,
    color: '#4A5565',
    textTransform: 'uppercase',
    marginTop: 18,
  },
  globeWrap: { flex: 1, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' },
  halo: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(200,205,215,0.6)',
  },
  globe: { width: 320, height: 320 },
  copy: { alignItems: 'center', gap: 6, maxWidth: 320 },
  lead: { fontFamily: font.regular, fontSize: 22, color: '#5B6574' },
  big: { fontFamily: font.bold, fontSize: 38, color: color.ink, letterSpacing: -0.5 },
  note: {
    fontFamily: font.regular,
    fontSize: 15,
    lineHeight: 22,
    color: color.inkMuted,
    textAlign: 'center',
    marginTop: 14,
  },
});
