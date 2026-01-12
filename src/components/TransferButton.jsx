import { useState } from 'react';
import { useWallet } from '@lazorkit/wallet';
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

import { config } from '../lib/config.js';

export function TransferButton() {
  const { signAndSendTransaction, smartWalletPubkey } = useWallet();
  const [recipient, setRecipient] = useState(config.recipientAddress || '');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleTransfer = async () => {
    setError('');
    setSignature('');

    if (!smartWalletPubkey) {
      setError('Connect a wallet before sending a transaction.');
      return;
    }

    if (!recipient) {
      setError('Enter a recipient address or set VITE_RECIPIENT_ADDRESS.');
      return;
    }

    setIsSending(true);

    try {
      // 1) Create the transfer instruction.
      const destination = new PublicKey(recipient);
      const lamports = Math.round(config.transferAmountSol * LAMPORTS_PER_SOL);

      const instruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: destination,
        lamports
      });

      const payload = {
        instructions: [instruction]
      };

      // 2) Sign and send via LazorKit.
      if (config.feeToken) {
        payload.transactionOptions = { feeToken: config.feeToken };
      }

      const txSignature = await signAndSendTransaction(payload);
      setSignature(txSignature);
    } catch (err) {
      setError(err?.message || 'Transfer failed.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="stack">
      <label className="field">
        <span className="field-label">Recipient address</span>
        <input
          className="input"
          type="text"
          value={recipient}
          onChange={(event) => setRecipient(event.target.value)}
          placeholder="Paste a devnet address"
        />
      </label>
      <button className="btn" onClick={handleTransfer} disabled={isSending}>
        {isSending ? 'Sending...' : `Send ${config.transferAmountSol} SOL`}
      </button>
      {signature ? (
        <p className="success">
          Confirmed: <span className="mono">{signature}</span>
        </p>
      ) : null}
      {error ? <p className="error">{error}</p> : null}
    </div>
  );
}
