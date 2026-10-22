import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { useStreak } from '@/state/streak';
import { Dial } from '@/ui/Dial';
import { PillButton, Screen } from '@/ui/kit';
import { color, font, shadow } from '@/ui/theme';

// Craving Mode: name it → ride the 90-second wave → redirect → win.
// Labelling an urge and waiting out its peak are the two best-evidenced moves.
const WAVE_SECONDS = 90;
const URGES = ['Bored', 'Stressed', 'Lonely', 'Tired', 'Triggered', 'Habit'];
const REDIRECTS = ['Breathe 4-7-8', 'Walk for 5 minutes', 'Cold water on your face', 'Write it down'];

type Step = 'name' | 'wave' | 'redirect' | 'won';

export default function Craving() {
  const { recordCravingBeaten } = useStreak();
  const { width } = useWindowDimensions();
  const dial = Math.min(290, width - 80);
  const [step, setStep] = useState<Step>('name');
  const [urge, setUrge] = useState<string | null>(null);
  const [left, setLeft] = useState(WAVE_SECONDS);

  useEffect(() => {
    if (step !== 'wave') return;
    const t = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          setStep('redirect');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [step]);

  function win() {
    recordCravingBeaten();
    setStep('won');
  }

  return (
    <Screen style={styles.root}>
      <Text style={styles.close} onPress={() => router.back()} accessibilityRole="button">
        Close
      </Text>

      {step === 'name' ? (
        <View style={styles.body}>
          <Text style={styles.title}>Name the urge</Text>
          <Text style={styles.sub}>Putting a word on it takes some of its power away.</Text>
          <View style={styles.chips}>
            {URGES.map((u) => (
              <Pressable
                key={u}
                onPress={() => setUrge(u)}
                style={[
                  styles.chip,
                  { boxShadow: urge === u ? shadow.pressed : shadow.raisedSoft },
                ]}
              >
                <Text style={[styles.chipText, urge === u && { color: color.ink }]}>{u}</Text>
              </Pressable>
            ))}
          </View>
          <PillButton label="Ride the wave" disabled={!urge} onPress={() => setStep('wave')} />
        </View>
      ) : null}

      {step === 'wave' ? (
        <View style={styles.body}>
          <Text style={styles.title}>Ride the wave</Text>
          <Text style={styles.sub}>
            {urge} urges peak and fade in about 90 seconds. Breathe slowly and watch it pass.
          </Text>
          <View style={styles.dial}>
            <Dial size={dial} tint="urge" progress={1 - left / WAVE_SECONDS}>
              <Text style={styles.count}>{left}</Text>
              <Text style={styles.countLabel}>seconds</Text>
            </Dial>
          </View>
        </View>
      ) : null}

      {step === 'redirect' ? (
        <View style={styles.body}>
          <Text style={styles.title}>The peak has passed</Text>
          <Text style={styles.sub}>Pick one thing to do with your body for the next few minutes.</Text>
          <View style={styles.list}>
            {REDIRECTS.map((r) => (
              <PillButton
                key={r}
                label={r}
                onPress={win}
                textStyle={{ textTransform: 'none', letterSpacing: 0, fontSize: 17 }}
              />
            ))}
          </View>
        </View>
      ) : null}

      {step === 'won' ? (
        <View style={styles.body}>
          <View style={styles.dial}>
            <Dial size={dial - 30} tint="victory" progress={1}>
              <Text style={[styles.count, { color: color.victory }]}>Won</Text>
            </Dial>
          </View>
          <Text style={styles.title}>You rode it out</Text>
          <Text style={styles.sub}>That's real rewiring. Your streak is safe.</Text>
          <PillButton label="Back to home" onPress={() => router.back()} />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { paddingTop: 8, paddingBottom: 24 },
  close: {
    alignSelf: 'flex-end',
    fontFamily: font.medium,
    fontSize: 16,
    color: color.inkMuted,
    padding: 8,
  },
  body: { flex: 1, justifyContent: 'center', gap: 20 },
  title: { fontFamily: font.bold, fontSize: 32, color: color.ink, textAlign: 'center', letterSpacing: -0.5 },
  sub: {
    fontFamily: font.regular,
    fontSize: 17,
    lineHeight: 25,
    color: color.inkMuted,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 14, marginVertical: 18 },
  chip: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 999,
    backgroundColor: color.surface,
    borderWidth: 1.5,
    borderColor: color.rim,
  },
  chipText: { fontFamily: font.medium, fontSize: 16, color: color.inkSoft },
  dial: { alignItems: 'center', marginVertical: 12 },
  count: {
    fontFamily: font.medium,
    fontSize: 64,
    color: '#7A6E72',
    fontVariant: ['tabular-nums'],
  },
  countLabel: { fontFamily: font.medium, fontSize: 14, color: color.inkMuted },
  list: { gap: 16, marginTop: 8 },
});
