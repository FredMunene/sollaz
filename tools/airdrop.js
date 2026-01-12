import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

const rpcUrls = [
  'https://api.devnet.solana.com',
  'https://rpc.ankr.com/solana_devnet',
  'https://solana-devnet.g.alchemy.com/v2/demo',
  process.env.VITE_SOLANA_RPC_URL
].filter(Boolean);

const address = process.env.VITE_RECIPIENT_ADDRESS;
if (!address) {
  console.error('VITE_RECIPIENT_ADDRESS is required.');
  process.exit(1);
}

const target = new PublicKey(address);

for (const rpcUrl of rpcUrls) {
  try {
    const connection = new Connection(rpcUrl, 'confirmed');
    console.log(`Requesting airdrop from: ${rpcUrl}`);
    const signature = await connection.requestAirdrop(target, LAMPORTS_PER_SOL);
    await connection.confirmTransaction(signature, 'confirmed');
    console.log(`Airdrop confirmed: ${signature}`);
    process.exit(0);
  } catch (error) {
    console.error(`Airdrop failed on ${rpcUrl}:`, error?.message || error);
  }
}

console.error('All airdrop attempts failed.');
process.exit(1);
