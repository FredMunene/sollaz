import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import { TransferButton } from './TransferButton.jsx';
import { config } from '../lib/config.js';

const mockSignAndSendTransaction = vi.fn();
const mockTransfer = vi.fn();

vi.mock('@lazorkit/wallet', () => ({
  useWallet: () => ({
    signAndSendTransaction: mockSignAndSendTransaction,
    smartWalletPubkey: 'smart-wallet-pubkey'
  })
}));

vi.mock('../lib/config.js', () => {
  const config = {
    recipientAddress: '',
    transferAmountSol: 0.01,
    feeToken: ''
  };
  return { config };
});

vi.mock('@solana/web3.js', () => ({
  SystemProgram: {
    transfer: (args) => {
      mockTransfer(args);
      return { kind: 'transfer', args };
    }
  },
  PublicKey: class PublicKey {
    constructor(value) {
      this.value = value;
    }
  },
  LAMPORTS_PER_SOL: 1_000_000_000
}));

beforeEach(() => {
  mockSignAndSendTransaction.mockReset();
  mockTransfer.mockReset();
  config.recipientAddress = '';
  config.transferAmountSol = 0.01;
  config.feeToken = '';
});

afterEach(() => {
  cleanup();
});

it('prefills the recipient input from config', () => {
  config.recipientAddress = 'RecipientFromEnv';
  render(<TransferButton />);

  expect(screen.getByLabelText('Recipient address')).toHaveValue('RecipientFromEnv');
});

it('shows an error when recipient is empty', async () => {
  render(<TransferButton />);

  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Send 0.01 SOL' }));

  expect(
    screen.getByText('Enter a recipient address or set VITE_RECIPIENT_ADDRESS.')
  ).toBeInTheDocument();
  expect(mockSignAndSendTransaction).not.toHaveBeenCalled();
});

it('sends a transfer with the configured fee token when provided', async () => {
  config.recipientAddress = 'RecipientFromEnv';
  config.feeToken = 'USDC';
  mockSignAndSendTransaction.mockResolvedValue('sig123');

  render(<TransferButton />);

  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Send 0.01 SOL' }));

  await waitFor(() => {
    expect(mockSignAndSendTransaction).toHaveBeenCalledWith({
      instructions: [
        {
          kind: 'transfer',
          args: expect.objectContaining({
            fromPubkey: 'smart-wallet-pubkey',
            toPubkey: expect.any(Object),
            lamports: 10_000_000
          })
        }
      ],
      transactionOptions: {
        feeToken: 'USDC'
      }
    });
  });
});
