import { clusterApiUrl, PublicKey } from '@solana/web3.js';

/** Which Solana network NBX talks to. Devnet until the dApp Store launch. */
export const CLUSTER = 'devnet' as const;
export const CHAIN = 'solana:devnet' as const;
export const RPC_ENDPOINT = clusterApiUrl(CLUSTER);

/** How NBX introduces itself in the wallet's approval sheet. */
export const APP_IDENTITY = {
  name: 'NBX',
  uri: 'https://nomadslab.agency',
  icon: 'favicon.ico', // resolved relative to `uri`
} as const;

/** SPL Memo program: records a short UTF-8 note on-chain with each check-in. */
export const MEMO_PROGRAM_ID = new PublicKey(
  'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr',
);

export function explorerTxUrl(signature: string): string {
  return `https://explorer.solana.com/tx/${signature}?cluster=${CLUSTER}`;
}

export function explorerAddressUrl(address: string): string {
  return `https://explorer.solana.com/address/${address}?cluster=${CLUSTER}`;
}
