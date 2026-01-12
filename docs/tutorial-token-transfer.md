# Tutorial 2: Standard SOL Transfer (No Paymaster)

Goal: Send a basic SOL transfer from the LazorKit smart wallet. This is a **standard** Solana transaction and requires SOL for fees.

---

## Step 1: Ensure the wallet is connected

Use the passkey flow from Tutorial 1 to connect a LazorKit smart wallet. You need a connected session and a smart wallet address.

---

## Step 2: Build a transfer instruction

```jsx
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

const destination = new PublicKey('RECIPIENT_ADDRESS');
const instruction = SystemProgram.transfer({
  fromPubkey: smartWalletPubkey,
  toPubkey: destination,
  lamports: 0.01 * LAMPORTS_PER_SOL
});
```

---

## Step 3: Sign and send with LazorKit

```jsx
import { useWallet } from '@lazorkit/wallet';

const { signAndSendTransaction } = useWallet();

const signature = await signAndSendTransaction({
  instructions: [instruction]
});
```

This prompts the passkey UI and submits the transaction once the user approves.

---

## Step 4: Handle success and errors

```jsx
try {
  const signature = await signAndSendTransaction({ instructions: [instruction] });
  console.log('Transaction confirmed:', signature);
} catch (error) {
  console.error('Transfer failed:', error);
}
```

---

## Notes

- This is a **standard** Solana transaction.
- The smart wallet must have enough SOL to cover network fees.
- If you later get access to a Paymaster service, you can add `transactionOptions.feeToken`.

---

## Done

You now have a standard SOL transfer flow signed with passkeys.
