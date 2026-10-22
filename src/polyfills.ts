// Polyfills required by @solana/web3.js and Mobile Wallet Adapter.
// Imported first from index.ts so they exist before any app code runs.
import 'react-native-get-random-values';
import { Buffer } from 'buffer';

const g = globalThis as { Buffer?: typeof Buffer };
if (typeof g.Buffer === 'undefined') {
  g.Buffer = Buffer;
}
