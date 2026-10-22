import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useStreak } from '@/state/streak';
import { Dial } from '@/ui/Dial';
import { LogoChip, PillButton, Screen } from '@/ui/kit';
import { color, font, shadow } from '@/ui/theme';

const PRESETS = [
  { minutes: 25, name: 'Pomodoro' },
  { minutes: 50, name: 'Deep work' },
  { minutes: 15, name: 'Short' },
];

function fmt(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function Focus() {
  const { recordFocusSession } = useStreak();
  const { width } = useWindowDimensions();
  const dial = Math.min(330, width - 88);
  const [preset, setPreset] = useState(0);
  const length = PRESETS[preset].minutes * 60;
  const [left, setLeft] = useState(length);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    timer.current = setInterval(() => {
      setLeft((t) => {
        if (t <= 1) {
          setRunning(false);
          recordFocusSession();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [running, recordFocusSession]);

  function choose(i: number) {
    setRunning(false);
    setPreset(i);
    setLeft(PRESETS[i].minutes * 60);
  }

  const done = left === 0;

  return (
    <Screen style={styles.root}>
      <LogoChip onPress={() => router.back()} />

      <View style={[styles.titlePill, { boxShadow: shadow.raised }]}>
        <Text style={styles.titleText}>Focus mode</Text>
      </View>

      <View style={styles.dialRow}>
        <Dial size={dial} progress={1 - left / length}>
          <Text style={styles.time}>{fmt(left)}</Text>
          <Text style={styles.presetName}>{done ? 'Session complete' : PRESETS[preset].name}</Text>
        </Dial>

        <View style={styles.presets}>
          {PRESETS.map((p, i) => (
            <Pressable
              key={p.minutes}
              accessibilityLabel={`${p.minutes} minute ${p.name}`}
              onPress={() => choose(i)}
              hitSlop={12}
              style={[
                styles.presetDot,
                i === preset && { backgroundColor: '#DCEBFA', boxShadow: shadow.inset },
              ]}
            />
          ))}
        </View>
      </View>

      <PillButton
        label={done ? 'Again' : running ? 'Pause' : left < length ? 'Resume' : 'Start'}
        tone="muted"
        onPress={() => (done ? choose(preset) : setRunning((r) => !r))}
        style={styles.cta}
      />

      <Pressable
        accessibilityLabel="End focus session"
        onPress={() => router.back()}
        style={[styles.power, { boxShadow: shadow.raisedSoft }]}
      >
        <Svg width={26} height={26} viewBox="0 0 24 24">
          <Path d="M12 3v8" stroke="#B5BCC8" strokeWidth={2} strokeLinecap="round" />
          <Path
            d="M6.3 6.6a8 8 0 1 0 11.4 0"
            stroke="#B5BCC8"
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { paddingTop: 8, paddingBottom: 20 },
  titlePill: {
    alignSelf: 'center',
    marginTop: 26,
    width: '76%',
    height: 64,
    borderRadius: 999,
    backgroundColor: color.surface,
    borderWidth: 2,
    borderColor: color.rim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: font.medium,
    fontSize: 22,
    letterSpacing: 3,
    color: color.inkMuted,
    textTransform: 'uppercase',
  },
  dialRow: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  time: {
    fontFamily: font.medium,
    fontSize: 64,
    color: '#6E7888',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  presetName: { fontFamily: font.medium, fontSize: 13, color: color.inkMuted, marginTop: 2 },
  presets: { position: 'absolute', right: 0, gap: 18 },
  presetDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#C9CFD9',
    backgroundColor: color.surface,
  },
  cta: { alignSelf: 'center', width: '58%', marginBottom: 28 },
  power: {
    position: 'absolute',
    left: 24,
    bottom: 28,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: color.surface,
    borderWidth: 1.5,
    borderColor: color.rim,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
