// TEMPORARY functional screen for testing the Solana flow on a Seeker.
// The real NBX screens replace this once the design references are in.
import { useState } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { explorerTxUrl } from '@/solana/config';
import { requestDevnetSol } from '@/solana/wallet';
import { useStreak } from '@/state/streak';

export default function Home() {
  const s = useStreak();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function run(action: () => Promise<string | void>) {
    setBusy(true);
    setMessage(null);
    try {
      const result = await action();
      if (result) setMessage(result);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  if (!s.ready) return null;

  const last = s.proofs[0];

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>NBX</Text>
      <Text style={styles.streak}>Day {s.streak}</Text>

      <Text style={styles.line}>
        Wallet: {s.wallet ? `${s.wallet.address.slice(0, 4)}…${s.wallet.address.slice(-4)}` : 'not connected'}
      </Text>

      {!s.wallet && (
        <Button label="Connect wallet" onPress={() => run(s.connect)} disabled={busy} />
      )}
      {s.wallet && (
        <Button
          label="Get devnet SOL"
          onPress={() => run(async () => {
            await requestDevnetSol(s.wallet!.address);
            return 'Received 1 devnet SOL.';
          })}
          disabled={busy}
        />
      )}
      <Button
        label={s.checkedInToday ? 'Checked in today' : 'Check in on Solana'}
        onPress={() => run(async () => {
          const p = await s.checkIn();
          return `Day ${p.day} recorded on Solana.`;
        })}
        disabled={busy || s.checkedInToday}
      />

      {busy && <ActivityIndicator style={{ marginTop: 16 }} />}
      {message && <Text style={styles.line}>{message}</Text>}
      {last && (
        <Text style={styles.link} onPress={() => Linking.openURL(explorerTxUrl(last.signature))}>
          View day {last.day} proof on Solana Explorer
        </Text>
      )}
    </SafeAreaView>
  );
}

function Button(props: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      onPress={props.onPress}
      disabled={props.disabled}
      style={[styles.button, props.disabled && { opacity: 0.4 }]}
    >
      <Text style={styles.buttonText}>{props.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 24, backgroundColor: '#EEF0F7' },
  title: { fontSize: 28, fontWeight: '800' },
  streak: { fontSize: 56, fontWeight: '800', marginVertical: 16 },
  line: { fontSize: 15, marginVertical: 8 },
  link: { fontSize: 15, marginTop: 12, color: '#5B6CF6', textDecorationLine: 'underline' },
  button: { backgroundColor: '#5B6CF6', padding: 16, borderRadius: 18, marginTop: 12 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '700', textAlign: 'center' },
});
