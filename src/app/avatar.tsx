import { router } from 'expo-router';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { assets, PillButton, Screen, useFloat } from '@/ui/kit';
import { color, font } from '@/ui/theme';

export default function MeetAvatar() {
  const float = useFloat(6, 3400);
  return (
    <Screen style={styles.root} filaments={false}>
      <View style={styles.head}>
        <Text style={styles.brand}>NBX</Text>
        <Text style={styles.title}>Meet your avatar</Text>
      </View>

      <Animated.View style={[styles.figureWrap, float]}>
        <Image source={assets.avatar} style={styles.figure} contentFit="contain" />
      </Animated.View>

      <Text style={styles.caption}>
        It starts dim. Every clean day lights up more of its network.
      </Text>

      <PillButton label="Continue" onPress={() => router.push('/modules')} style={styles.cta} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', paddingVertical: 24 },
  head: { alignItems: 'center', gap: 10, marginTop: 16 },
  brand: { fontFamily: font.bold, fontSize: 52, color: color.ink, letterSpacing: -1 },
  title: { fontFamily: font.medium, fontSize: 30, color: color.ink },
  figureWrap: { flex: 1, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' },
  figure: { width: '100%', height: '100%' },
  caption: {
    fontFamily: font.regular,
    fontSize: 15,
    lineHeight: 22,
    color: color.inkMuted,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: 18,
  },
  cta: { alignSelf: 'stretch', marginHorizontal: 40, marginBottom: 12 },
});
