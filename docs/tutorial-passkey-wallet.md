# Tutorial 1: Passkey Wallet (Web, Vite)

Goal: Create a passkey-based smart wallet with LazorKit in a Vite React app.

## Prerequisites

- Node.js 18+
- A browser that supports Passkeys (Chrome, Edge, Safari)
- LazorKit Paymaster URL (optional)

---

## Step 1: Install dependencies

```bash
npm install @lazorkit/wallet @coral-xyz/anchor @solana/web3.js buffer
npm install -D vite-plugin-node-polyfills
```

---

## Step 2: Add Vite polyfills

`@lazorkit/wallet` depends on node globals like `Buffer` in some environments.

Create or update `vite.config.js`:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    nodePolyfills(),
    react()
  ]
});
```

Then, ensure `Buffer` exists in the browser:

```js
import { Buffer } from 'buffer';

if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
}
```

---

## Step 3: Add environment variables

Create `.env` and add:

```
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_LAZORKIT_PORTAL_URL=https://portal.lazor.sh
VITE_LAZORKIT_PAYMASTER_URL=https://kora.devnet.lazorkit.com
```

---

## Step 4: Wrap your app with LazorkitProvider

```jsx
import { LazorkitProvider } from '@lazorkit/wallet';

export default function App() {
  return (
    <LazorkitProvider
      rpcUrl="https://api.devnet.solana.com"
      portalUrl="https://portal.lazor.sh"
      paymasterConfig={{ paymasterUrl: "https://kora.devnet.lazorkit.com" }}
    >
      <YourApp />
    </LazorkitProvider>
  );
}
```

Required props from LazorKit docs:
- `rpcUrl` (string, required)
- `portalUrl` (string, optional)
- `paymasterConfig` (optional)

---

## Step 5: Connect with passkey

```jsx
import { useWallet } from '@lazorkit/wallet';

export function ConnectButton() {
  const { connect, disconnect, isConnected, wallet } = useWallet();

  if (isConnected && wallet) {
    return (
      <button onClick={() => disconnect()}>
        Disconnect ({wallet.smartWallet.slice(0, 6)}...)
      </button>
    );
  }

  return <button onClick={() => connect({ feeMode: 'paymaster' })}>Connect</button>;
}
```

What happens here:
1. `connect()` triggers a passkey prompt in the browser.
2. LazorKit creates a smart wallet (PDA) for the user.
3. You can read the wallet address from `wallet.smartWallet`.

---

## Step 6: Show session details (optional)

```jsx
const { isConnected, wallet } = useWallet();

return (
  <div>
    <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
    <p>Wallet: {wallet?.smartWallet || '-'}</p>
  </div>
);
```

---

## Done

You now have a passkey-based smart wallet session in your app.

Next tutorial: `docs/tutorial-token-transfer.md`
