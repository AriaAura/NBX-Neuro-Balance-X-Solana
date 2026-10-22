import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { requestDevnetSol } from '@/solana/wallet';
import { MODULES, useStreak } from '@/state/streak';
import { assets, LogoChip, NeuroOrb, PillButton, Screen } from '@/ui/kit';
import { color, font, shadow } from '@/ui/theme';

function shortAddress(a: string) {
  return `${a.slice(0, 4)}…${a.slice(-4)}`;
}

/** Turns wallet/RPC errors into one plain sentence and the fix. */
function explain(e: unknown): { text: string; needsSol: boolean } {
  const raw = e instanceof Error ? e.message : String(e);
  if (/no record of a prior credit|insufficient|0x1\b/i.test(raw)) {
    return { text: 'Your wallet needs a little devnet SOL to pay the network fee.', needsSol: true };
  }
  if (/declined|rejected|cancel/i.test(raw)) {
    return { text: 'Check-in cancelled in the wallet. Nothing was recorded.', needsSol: false };
  }
  if (/no wallet|not found|ERROR_WALLET_NOT_FOUND/i.test(raw)) {
    return { text: 'No Solana wallet found on this phone. Open the Seeker wallet once, then try again.', needsSol: false };
  }
  return { text: raw, needsSol: false };
}

export default function Home() {
  const s = useStreak();
  const [busy, setBusy] = useState<null | 'connect' | 'checkin' | 'sol'>(null);
  const [note, setNote] = useState<{ text: string; needsSol: boolean } | null>(null);

  async function run(kind: 'connect' | 'checkin' | 'sol', fn: () => Promise<void>) {
    setBusy(kind);
    setNote(null);
    try {
      await fn();
    } catch (e) {
      setNote(explain(e));
    } finally {
      setBusy(null);
    }
  }

  const checkIn = () =>
    run('checkin', async () => {
      const p = await s.checkIn();
      router.push({ pathname: '/proof', params: { day: String(p.day), sig: p.signature } });
    });

  const getSol = () =>
    run('sol', async () => {
      if (!s.wallet) return;
      await requestDevnetSol(s.wallet.address);
      setNote({ text: '1 devnet SOL received. You can check in now.', needsSol: false });
    });

  const last = s.proofs[0];

  return (
    <Screen style={styles.root}>
      <View style={styles.topRow}>
        <LogoChip onPress={() => router.push('/modules')} />
        <Pressable
          onPress={() => (s.wallet ? null : run('connect', s.connect))}
          style={[styles.walletChip, { boxShadow: shadow.raisedSoft }]}
          accessibilityRole="button"
        >
          <View style={[styles.dot, { backgroundColor: s.wallet ? color.blue : '#C5CBD6' }]} />
          <Text style={styles.walletText}>
            {busy === 'connect' ? 'Opening wallet…' : s.wallet ? shortAddress(s.wallet.address) : 'Connect wallet'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.streakBlock}>
        <Text style={styles.module}>{MODULES[s.module]}</Text>
        <Text style={styles.day}>Day {s.streak}</Text>
      </View>

      <NeuroOrb size={210} streak={s.streak} />

      <View style={styles.actions}>
        <PillButton
          label={
            busy === 'checkin'
              ? 'Waiting for wallet…'
              : s.checkedInToday
                ? `Day ${s.streak} is on-chain`
                : 'Check in on Solana'
          }
          onPress={s.checkedInToday && last
            ? () => router.push({ pathname: '/proof', params: { day: String(last.day), sig: last.signature } })
            : checkIn}
          disabled={busy !== null}
        />

        {busy === 'sol' && <ActivityIndicator color={color.blue} />}
        {note && (
          <View style={styles.note}>
            <Text style={styles.noteText}>{note.text}</Text>
            {note.needsSol && s.wallet && (
              <Text style={styles.noteAction} onPress={getSol}>Get 1 devnet SOL</Text>
            )}
          </View>
        )}

        <View style={styles.tiles}>
          <Tile label="Focus" image={assets.iconTarget} onPress={() => router.push('/focus')} />
          <Tile label="Food Pool" image={assets.globe} onPress={() => router.push('/food-pool')} />
          <Tile
            label={`${s.cravingsBeaten} urges beaten`}
            image={assets.iconMolecule}
            onPress={() => router.push('/craving')}
          />
        </View>

        <PillButton
          label="I feel an urge"
          tone="urge"
          onPress={() => router.push('/craving')}
          textStyle={{ textTransform: 'none', letterSpacing: 0.2, fontFamily: font.semibold }}
        />
      </View>
    </Screen>
  );
}

function Tile({ label, image, onPress }: { label: string; image: number; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        { boxShadow: pressed ? shadow.pressed : shadow.raisedSoft },
      ]}
    >
      <Image source={image} style={styles.tileImage} contentFit="contain" />
      <Text style={styles.tileLabel} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { paddingTop: 8, paddingBottom: 16, justifyContent: 'space-between' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  walletChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: color.surface,
    borderWidth: 1.5,
    borderColor: color.rim,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  walletText: { fontFamily: font.medium, fontSize: 15, color: color.inkSoft },
  streakBlock: { alignItems: 'center', marginTop: 4 },
  module: { fontFamily: font.medium, fontSize: 16, color: color.inkMuted },
  day: {
    fontFamily: font.heavy,
    fontSize: 64,
    color: color.ink,
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
  },
  actions: { gap: 18 },
  note: { alignItems: 'center', gap: 6 },
  noteText: { fontFamily: font.regular, fontSize: 14, lineHeight: 20, color: color.inkSoft, textAlign: 'center' },
  noteAction: { fontFamily: font.semibold, fontSize: 15, color: color.blue },
  tiles: { flexDirection: 'row', gap: 14 },
  tile: {
    flex: 1,
    height: 104,
    borderRadius: 24,
    backgroundColor: color.surface,
    borderWidth: 1.5,
    borderColor: color.rim,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 6,
  },
  tileImage: { width: 52, height: 52 },
  tileLabel: { fontFamily: font.medium, fontSize: 13, color: color.inkSoft },
});
