const env = import.meta.env;

const config = {
  rpcUrl: env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  portalUrl: env.VITE_LAZORKIT_PORTAL_URL || 'https://portal.lazor.sh',
  paymasterUrl: env.VITE_LAZORKIT_PAYMASTER_URL || 'https://kora.devnet.lazorkit.com',
  paymasterApiKey: env.VITE_LAZORKIT_PAYMASTER_API_KEY || '',
  recipientAddress: env.VITE_RECIPIENT_ADDRESS || '',
  feeToken: env.VITE_FEE_TOKEN || 'USDC',
  transferAmountSol: Number(env.VITE_TRANSFER_AMOUNT_SOL || '0.01'),
  feeMode: env.VITE_FEE_MODE || 'paymaster'
};

const paymasterConfig = config.paymasterUrl
  ? {
      paymasterUrl: config.paymasterUrl,
      ...(config.paymasterApiKey ? { apiKey: config.paymasterApiKey } : {})
    }
  : undefined;

export { config, paymasterConfig };
