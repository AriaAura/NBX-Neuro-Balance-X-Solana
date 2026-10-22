import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  connectWallet,
  sendProofOfStreak,
  type WalletSession,
} from '@/solana/wallet';

export type ModuleId = 'quit-porn' | 'quit-weed' | 'adhd-focus' | 'dopamine-reset';

export const MODULES: Record<ModuleId, string> = {
  'quit-porn': 'Quit Porn',
  'quit-weed': 'Quit Weed',
  'adhd-focus': 'ADHD Focus',
  'dopamine-reset': 'Dopamine Reset',
};

export type ProofRecord = {
  day: number;
  date: string;
  signature: string;
};

type Stored = {
  module: ModuleId;
  streak: number;
  lastCheckIn: string | null; // YYYY-MM-DD
  cravingsBeaten: number;
  proofs: ProofRecord[];
  wallet: WalletSession | null;
};

const STORAGE_KEY = 'nbx/state/v1';

const initial: Stored = {
  module: 'dopamine-reset',
  streak: 0,
  lastCheckIn: null,
  cravingsBeaten: 0,
  proofs: [],
  wallet: null,
};

export function localDate(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function daysBetween(a: string, b: string): number {
  const ms = new Date(`${b}T00:00:00`).getTime() - new Date(`${a}T00:00:00`).getTime();
  return Math.round(ms / 86_400_000);
}

type StreakApi = Stored & {
  ready: boolean;
  checkedInToday: boolean;
  setModule: (m: ModuleId) => void;
  connect: () => Promise<void>;
  disconnect: () => void;
  /** Signs today's Proof of Streak on Solana and advances the streak. */
  checkIn: () => Promise<ProofRecord>;
  recordCravingBeaten: () => void;
};

const StreakContext = createContext<StreakApi | null>(null);

export function StreakProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Stored>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        const saved = { ...initial, ...(JSON.parse(raw) as Partial<Stored>) };
        // A missed day breaks the streak.
        if (saved.lastCheckIn && daysBetween(saved.lastCheckIn, localDate()) > 1) {
          saved.streak = 0;
        }
        setState(saved);
      })
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, ready]);

  const today = localDate();
  const checkedInToday = state.lastCheckIn === today;

  const connect = useCallback(async () => {
    const wallet = await connectWallet(state.wallet);
    setState((s) => ({ ...s, wallet }));
  }, [state.wallet]);

  const checkIn = useCallback(async () => {
    if (checkedInToday) throw new Error('You already checked in today.');
    let wallet = state.wallet;
    if (!wallet) wallet = await connectWallet();
    const day = state.streak + 1;
    const { signature, session } = await sendProofOfStreak(wallet, {
      day,
      module: state.module,
      date: today,
    });
    const record: ProofRecord = { day, date: today, signature };
    setState((s) => ({
      ...s,
      wallet: session,
      streak: day,
      lastCheckIn: today,
      proofs: [record, ...s.proofs].slice(0, 60),
    }));
    return record;
  }, [checkedInToday, state.wallet, state.streak, state.module, today]);

  const api = useMemo<StreakApi>(
    () => ({
      ...state,
      ready,
      checkedInToday,
      setModule: (module) => setState((s) => ({ ...s, module })),
      connect,
      disconnect: () => setState((s) => ({ ...s, wallet: null })),
      checkIn,
      recordCravingBeaten: () =>
        setState((s) => ({ ...s, cravingsBeaten: s.cravingsBeaten + 1 })),
    }),
    [state, ready, checkedInToday, connect, checkIn],
  );

  return <StreakContext.Provider value={api}>{children}</StreakContext.Provider>;
}

export function useStreak(): StreakApi {
  const ctx = useContext(StreakContext);
  if (!ctx) throw new Error('useStreak must be used inside <StreakProvider>');
  return ctx;
}
