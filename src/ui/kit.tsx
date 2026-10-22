import * as Haptics from 'expo-haptics';
import { useEffect, useRef, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import { color, font, radius, shadow } from './theme';

export const assets = {
  logo: require('../../assets/nbx/logo.png'),
  orb: require('../../assets/nbx/orb.png'),
  avatar: require('../../assets/nbx/avatar.png'),
  globe: require('../../assets/nbx/globe.png'),
  badge: require('../../assets/nbx/badge.png'),
  iconLock: require('../../assets/nbx/icon-lock.png'),
  iconLeaf: require('../../assets/nbx/icon-leaf.png'),
  iconTarget: require('../../assets/nbx/icon-target.png'),
  iconMolecule: require('../../assets/nbx/icon-molecule.png'),
};

/** Full-screen clay background with the faint neural filaments from the renders. */
export function Screen({
  children,
  style,
  filaments = true,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  filaments?: boolean;
}) {
  return (
    <View style={styles.screen}>
      {filaments && <Filaments />}
      <SafeAreaView style={[styles.safe, style]}>{children}</SafeAreaView>
    </View>
  );
}

function Filaments() {
  return (
    <Svg style={StyleSheet.absoluteFill} viewBox="0 0 400 860" preserveAspectRatio="xMidYMid slice">
      {[
        'M-20 300 C 60 330, 120 420, 200 470',
        'M420 250 C 340 300, 290 380, 200 470',
        'M-10 620 C 70 560, 140 520, 200 470',
        'M410 700 C 330 620, 260 540, 200 470',
        'M60 120 C 90 200, 110 250, 150 300',
        'M330 820 C 300 740, 260 680, 240 600',
      ].map((d, i) => (
        <Path key={i} d={d} stroke="#C9D2E0" strokeOpacity={0.45} strokeWidth={1} fill="none" />
      ))}
      <Circle cx={72} cy={322} r={3} fill={color.blue} opacity={0.45} />
      <Circle cx={352} cy={300} r={3} fill={color.violet} opacity={0.35} />
      <Circle cx={330} cy={650} r={3} fill={color.blue} opacity={0.4} />
    </Svg>
  );
}

/** Raised clay pill — the button shape used across every reference screen. */
export function PillButton({
  label,
  onPress,
  disabled,
  tone = 'default',
  style,
  textStyle,
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  tone?: 'default' | 'muted' | 'urge';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress?.();
      }}
      disabled={disabled}
      style={({ pressed }) => [
        styles.pill,
        { boxShadow: pressed ? shadow.pressed : shadow.raised },
        pressed && { transform: [{ scale: 0.98 }] },
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      <Text
        style={[
          styles.pillText,
          tone === 'muted' && { color: color.inkMuted },
          tone === 'urge' && { color: color.urge },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/** Pressable clay card. */
export function ClayCard({
  children,
  onPress,
  selected,
  style,
}: {
  children: ReactNode;
  onPress?: () => void;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.card,
        { boxShadow: pressed ? shadow.pressed : shadow.raised },
        selected && { borderColor: 'rgba(63,155,234,0.35)' },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

/** The NBX lockup: brain mark + wordmark. */
export function Logo({ size = 44, wordmark = true }: { size?: number; wordmark?: boolean }) {
  return (
    <View style={styles.logoRow}>
      <Image source={assets.logo} style={{ width: size * 1.1, height: size }} contentFit="contain" />
      {wordmark && (
        <Text style={[styles.wordmark, { fontSize: size * 0.95 }]}>NBX</Text>
      )}
    </View>
  );
}

/** Small raised logo chip (top-left of Focus Mode). */
export function LogoChip({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel="Back to home"
      style={[styles.chip, { boxShadow: shadow.raisedSoft }]}
    >
      <Image source={assets.logo} style={{ width: 30, height: 27, opacity: 0.55 }} contentFit="contain" />
      <Text style={styles.chipText}>NBX</Text>
    </Pressable>
  );
}

/** Gentle 3s float used for the orb and the avatar. Respects nothing fancy: one loop. */
export function useFloat(distance = 8, duration = 3000) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [v, duration]);
  return {
    transform: [
      { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -distance] }) },
      { scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] }) },
    ],
  };
}

/** The Neuro Orb. Brightness follows the streak (dim → building → bright → radiant). */
export function NeuroOrb({ size, streak = 30, children }: { size: number; streak?: number; children?: ReactNode }) {
  const float = useFloat(size * 0.03);
  const opacity = streak <= 3 ? 0.55 : streak <= 13 ? 0.8 : 1;
  return (
    <Animated.View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, float]}>
      <View
        style={{
          position: 'absolute',
          width: size * 0.7,
          height: size * 0.7,
          borderRadius: size,
          boxShadow: streak >= 14 ? '0px 0px 60px rgba(140,130,255,0.55)' : '0px 0px 30px rgba(140,160,255,0.3)',
        }}
      />
      <Image source={assets.orb} style={{ width: size, height: size, opacity, position: 'absolute' }} />
      {children}
    </Animated.View>
  );
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  safe: { flex: 1, paddingHorizontal: 24 },
  pill: {
    minHeight: 64,
    paddingHorizontal: 36,
    borderRadius: radius.pill,
    backgroundColor: color.surface,
    borderWidth: 1.5,
    borderColor: color.rim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontFamily: font.medium,
    fontSize: 19,
    letterSpacing: 1.6,
    color: color.inkSoft,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: color.surface,
    borderRadius: radius.card,
    borderWidth: 1.5,
    borderColor: color.rim,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  wordmark: { fontFamily: font.bold, color: color.ink, letterSpacing: -1 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    backgroundColor: color.surface,
    borderWidth: 1.5,
    borderColor: color.rim,
  },
  chipText: { fontFamily: font.bold, fontSize: 20, color: color.inkMuted },
});
