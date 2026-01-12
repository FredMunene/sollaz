import { LazorkitProvider } from '@lazorkit/wallet';

import { config, paymasterConfig } from './lib/config.js';
import { ConnectButton } from './components/ConnectButton.jsx';
import { TransferButton } from './components/TransferButton.jsx';
import { AirdropButton } from './components/AirdropButton.jsx';
import { StatusPanel } from './components/StatusPanel.jsx';

const providerProps = {
  rpcUrl: config.rpcUrl,
  portalUrl: config.portalUrl,
  ...(paymasterConfig ? { paymasterConfig } : {})
};

export default function App() {
  return (
    <LazorkitProvider {...providerProps}>
      <div className="page">
        <header className="hero">
          <p className="eyebrow">LazorKit + Solana (Devnet)</p>
          <h1>Passkey Wallet + SOL Transfer (Vite)</h1>
          <p className="subhead">
            A focused example that shows passkey authentication, a smart wallet address,
            and a standard SOL transfer signed with a passkey.
          </p>
        </header>

        <main className="grid">
          <section className="card">
            <h2>1) Passkey Wallet</h2>
            <p>
              Create or reconnect a passkey-based smart wallet. This does not require a browser
              extension or seed phrase.
            </p>
            <ConnectButton />
            <AirdropButton />
          </section>

          <section className="card">
            <h2>2) Standard Transfer</h2>
            <p>
              Send a small SOL transfer from the smart wallet. This is a standard devnet transfer
              and requires the wallet to have SOL for fees.
            </p>
            <TransferButton />
          </section>

          <section className="card">
            <h2>Current Session</h2>
            <StatusPanel />
          </section>
        </main>
      </div>
    </LazorkitProvider>
  );
}
