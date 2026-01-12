import { useMemo, useState } from 'react';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@lazorkit/wallet';

import { config } from '../lib/config.js';

export function AirdropButton() {
  const { smartWalletPubkey } = useWallet();
  const [isAirdropping, setIsAirdropping] = useState(false);
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');

  const connection = useMemo(() => new Connection(config.rpcUrl, 'confirmed'), []);

  const handleAirdrop = async () => {
    setError('');
    setSignature('');

    if (!smartWalletPubkey) {
      setError('Connect a wallet before requesting an airdrop.');
      return;
    }

    setIsAirdropping(true);

    try {
      const sig = await connection.requestAirdrop(
        smartWalletPubkey,
        LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(sig, 'confirmed');
      setSignature(sig);
    } catch (err) {
      setError(err?.message || 'Airdrop failed.');
    } finally {
      setIsAirdropping(false);
    }
  };

  if (!smartWalletPubkey) {
    return null;
  }

  return (
    <div className="stack">
      <button className="btn" onClick={handleAirdrop} disabled={isAirdropping}>
        {isAirdropping ? 'Requesting Airdrop...' : 'Airdrop 1 SOL (Devnet)'}
      </button>
      {signature ? (
        <p className="success">
          Airdrop confirmed: <span className="mono">{signature}</span>
        </p>
      ) : null}
      {error ? (
        <p className="error">
          Airdrop failed. Try the devnet faucet:{" "}
          <a className="link" href="https://faucet.solana.com/?cluster=devnet" target="_blank" rel="noreferrer">
            https://faucet.solana.com
          </a>
        </p>
      ) : null}
    </div>
  );
}
