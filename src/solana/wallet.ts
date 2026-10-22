import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import {
  transact,
  type Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { Buffer } from 'buffer';

import { APP_IDENTITY, CHAIN, MEMO_PROGRAM_ID, RPC_ENDPOINT } from './config';

export const connection = new Connection(RPC_ENDPOINT, 'confirmed');

export type WalletSession = {
  address: string; // base58
  authToken: string;
  label?: string;
};

/** MWA returns base64 addresses; the rest of Solana speaks base58. */
function toPublicKey(base64Address: string): PublicKey {
  return new PublicKey(Buffer.from(base64Address, 'base64'));
}

async function authorize(
  wallet: Web3MobileWallet,
  previous?: WalletSession | null,
): Promise<WalletSession> {
  const result = await wallet.authorize({
    chain: CHAIN,
    identity: APP_IDENTITY,
    auth_token: previous?.authToken,
  });
  const account = result.accounts[0];
  return {
    address: toPublicKey(account.address).toBase58(),
    authToken: result.auth_token,
    label: 'label' in account ? account.label : undefined,
  };
}

/** Opens the Seeker wallet (or any MWA wallet) and asks the user to connect NBX. */
export async function connectWallet(
  previous?: WalletSession | null,
): Promise<WalletSession> {
  return transact((wallet) => authorize(wallet, previous));
}

export async function getBalanceSol(address: string): Promise<number> {
  const lamports = await connection.getBalance(new PublicKey(address));
  return lamports / LAMPORTS_PER_SOL;
}

/**
 * Devnet only: asks the public faucet for 1 SOL so the wallet can pay fees.
 * The public faucet is rate-limited; if it refuses, use https://faucet.solana.com.
 */
export async function requestDevnetSol(address: string): Promise<string> {
  const signature = await connection.requestAirdrop(
    new PublicKey(address),
    LAMPORTS_PER_SOL,
  );
  const latest = await connection.getLatestBlockhash();
  await connection.confirmTransaction({ signature, ...latest }, 'confirmed');
  return signature;
}

export type ProofOfStreak = {
  day: number;
  module: string;
  date: string; // YYYY-MM-DD, the user's local day
};

/** The exact text written on-chain. Short, readable, and holds no personal data. */
export function proofMemo(proof: ProofOfStreak): string {
  return `NBX proof-of-streak v1 | day ${proof.day} | ${proof.module} | ${proof.date}`;
}

/**
 * Proof of Streak: the user signs one memo transaction per day with their own
 * wallet. The memo records the streak day; the signature is the receipt.
 * Returns the transaction signature.
 */
export async function sendProofOfStreak(
  session: WalletSession,
  proof: ProofOfStreak,
): Promise<{ signature: string; session: WalletSession }> {
  const latest = await connection.getLatestBlockhash();

  return transact(async (wallet) => {
    const fresh = await authorize(wallet, session);
    const payer = new PublicKey(fresh.address);

    const tx = new Transaction({
      feePayer: payer,
      blockhash: latest.blockhash,
      lastValidBlockHeight: latest.lastValidBlockHeight,
    }).add(
      new TransactionInstruction({
        programId: MEMO_PROGRAM_ID,
        keys: [{ pubkey: payer, isSigner: true, isWritable: false }],
        data: Buffer.from(proofMemo(proof), 'utf8'),
      }),
    );

    const [signature] = await wallet.signAndSendTransactions({
      transactions: [tx],
    });
    return { signature, session: fresh };
  });
}
