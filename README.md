# Sollaz LazorKit Passkey + Transfer Demo

This repo is a **documentation-first** example of how to integrate the LazorKit React SDK in a Vite app. It demonstrates:

- Passkey-based authentication (seedless onboarding)
- Smart wallet creation + address display
- A basic SOL transfer flow signed with a passkey

This is **not** a full product. It is a focused integration template you can copy or adapt.

Paymaster (gasless) is **not** included in this demo. If you have Paymaster access, you can enable it via env config, but the core example does not depend on it.

> NOTE: LazorKit is pre-audit. Do not use in production environments.

---

## What you get

- **Working Vite example** with LazorKit provider + UI
- **Two step-by-step tutorials** in `docs/`
- **Clear env setup** for devnet + paymaster
- **Minimal, readable code** with only essential abstractions

---

## Quick start (Vite)

1) Install dependencies
```bash
npm install
```

2) Create your `.env`
```bash
cp .env.example .env
```

3) Update required values
- `VITE_RECIPIENT_ADDRESS` must be a valid devnet address.
- Paymaster settings are optional and only needed if you have access.

4) Run the app
```bash
npm run dev
```

5) Open the local URL printed by Vite (usually `http://localhost:5173`).

---

## Project structure

```
.
├── docs/
│   ├── tutorial-passkey-wallet.md
│   └── tutorial-token-transfer.md
├── src/
│   ├── components/
│   │   ├── ConnectButton.jsx
│   │   ├── StatusPanel.jsx
│   │   └── TransferButton.jsx
│   ├── lib/
│   │   └── config.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

---

## LazorKit integration overview

### 1) Provider setup (required)
`LazorkitProvider` must wrap your app. The required prop is `rpcUrl`.

From LazorKit docs:
- `rpcUrl` (required): full Solana RPC URL
- `portalUrl` (optional, default `https://portal.lazor.sh`)
- `paymasterConfig` (optional): `{ paymasterUrl: string, apiKey?: string }`

See `src/App.jsx` for the actual usage.

### 2) Passkey connect flow
The connection flow is handled by the `useWallet` hook:

```js
const { connect } = useWallet();
await connect({ feeMode: 'paymaster' });
```

This triggers the passkey creation or authentication in the browser and connects the smart wallet.

See `src/components/ConnectButton.jsx`.

### 3) Transaction flow (standard SOL transfer)
To send a transaction:

```js
const { signAndSendTransaction } = useWallet();
const signature = await signAndSendTransaction({
  instructions: [/* Solana instructions */]
});
```

Supported `transactionOptions` (from LazorKit types):
- `feeToken?: string` (requires a Paymaster service)
- `addressLookupTableAccounts?: AddressLookupTableAccount[]`
- `computeUnitLimit?: number`
- `clusterSimulation?: 'devnet' | 'mainnet'`

See `src/components/TransferButton.jsx`.

---

## Environment variables (devnet)

All config lives in `.env` and is read by `src/lib/config.js`.

| Variable | Required | Example | Purpose |
| --- | --- | --- | --- |
| `VITE_SOLANA_RPC_URL` | Yes | `https://api.devnet.solana.com` | RPC endpoint |
| `VITE_LAZORKIT_PORTAL_URL` | No | `https://portal.lazor.sh` | LazorKit auth portal |
| `VITE_LAZORKIT_PAYMASTER_URL` | No | `https://kora.devnet.lazorkit.com` | Paymaster endpoint (optional) |
| `VITE_LAZORKIT_PAYMASTER_API_KEY` | No | `...` | Paymaster auth |
| `VITE_RECIPIENT_ADDRESS` | Yes | `F8...` | Devnet destination address |
| `VITE_FEE_TOKEN` | No | `USDC` | Gas token label/address (optional, Paymaster only) |
| `VITE_TRANSFER_AMOUNT_SOL` | No | `0.01` | Transfer amount |
| `VITE_FEE_MODE` | No | `paymaster` | Connect fee mode |

---

## Demo flow (what happens in the UI)

1. Click **Connect Passkey Wallet**
2. Browser prompts for passkey creation or reuse
3. The smart wallet address appears in **Current Session**
4. Click **Airdrop 1 SOL (Devnet)** to fund the wallet (optional)
5. Click **Send 0.01 SOL** to trigger a transfer (fees require SOL on devnet)
5. A transaction signature is displayed

---

## Tutorials

- `docs/tutorial-passkey-wallet.md`
- `docs/tutorial-token-transfer.md`

These are step-by-step and meant to be copied into your own project or onboarding docs.

---

## Deployment (Devnet)

This is a static Vite app. You can deploy it to any static host (Vercel, Netlify, Cloudflare Pages, Render).

1) Build
```bash
npm run build
```

2) Deploy the `dist/` folder

3) Set the same environment variables in your hosting provider

---

## Tests

```bash
npm run test
```

---

## Troubleshooting

- **Blank page**: make sure `npm install` completed and `npm run dev` is running.
- **Connect fails**: check that your browser supports WebAuthn/Passkeys.
- **Transaction fails**: confirm `VITE_RECIPIENT_ADDRESS` is valid and you are on devnet.
- **Transfer fails**: ensure the wallet has SOL on devnet for fees.

---

## References

- LazorKit docs: https://docs.lazorkit.com/
- LazorKit repo: https://github.com/lazor-kit/lazor-kit
- LazorKit Telegram: https://t.me/lazorkit

---

## License

MIT (see `LICENSE` in the upstream LazorKit repo if you reuse any of their code directly).
