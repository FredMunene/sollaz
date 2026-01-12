import { useState } from 'react';
import { useWallet } from '@lazorkit/wallet';

import { config } from '../lib/config.js';

export function ConnectButton() {
  const { connect, disconnect, isConnected, isConnecting, wallet } = useWallet();
  const [error, setError] = useState('');

  const handleConnect = async () => {
    setError('');
    try {
      await connect({ feeMode: config.feeMode });
    } catch (err) {
      setError(err?.message || 'Failed to connect.');
    }
  };

  const handleDisconnect = async () => {
    setError('');
    try {
      await disconnect();
    } catch (err) {
      setError(err?.message || 'Failed to disconnect.');
    }
  };

  if (isConnected && wallet) {
    return (
      <div className="stack">
        <button className="btn" onClick={handleDisconnect}>
          Disconnect ({wallet.smartWallet.slice(0, 6)}...)
        </button>
        {error ? <p className="error">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="stack">
      <button className="btn" onClick={handleConnect} disabled={isConnecting}>
        {isConnecting ? 'Connecting...' : 'Connect Passkey Wallet'}
      </button>
      {error ? <p className="error">{error}</p> : null}
    </div>
  );
}
