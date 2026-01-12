import { useState } from 'react';
import { useWallet } from '@lazorkit/wallet';

export function StatusPanel() {
  const { isConnected, isConnecting, wallet, smartWalletPubkey } = useWallet();
  const [copied, setCopied] = useState('');

  const smartWalletFromHook = smartWalletPubkey
    ? smartWalletPubkey.toBase58?.() || String(smartWalletPubkey)
    : '';

  const copyToClipboard = async (label, value) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(''), 1500);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <dl className="status">
      <div>
        <dt>Status</dt>
        <dd>{isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}</dd>
      </div>
      <div>
        <dt>Smart Wallet (from wallet)</dt>
        <dd className="mono">
          <span className="copy-row">
            <span>{wallet?.smartWallet || '-'}</span>
            <button
              className="copy-btn"
              type="button"
              onClick={() => copyToClipboard('wallet', wallet?.smartWallet)}
              disabled={!wallet?.smartWallet}
            >
              {copied === 'wallet' ? 'Copied' : 'Copy'}
            </button>
          </span>
        </dd>
      </div>
      <div>
        <dt>Smart Wallet (from hook)</dt>
        <dd className="mono">
          <span className="copy-row">
            <span>{smartWalletFromHook || '-'}</span>
            <button
              className="copy-btn"
              type="button"
              onClick={() => copyToClipboard('hook', smartWalletFromHook)}
              disabled={!smartWalletFromHook}
            >
              {copied === 'hook' ? 'Copied' : 'Copy'}
            </button>
          </span>
        </dd>
      </div>
      <div>
        <dt>Credential ID</dt>
        <dd className="mono">{wallet?.credentialId || '-'}</dd>
      </div>
      <div>
        <dt>Platform</dt>
        <dd>{wallet?.platform || '-'}</dd>
      </div>
      <div>
        <dt>Account Name</dt>
        <dd>{wallet?.accountName || '-'}</dd>
      </div>
    </dl>
  );
}
