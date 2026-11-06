// Gift and coin rules for the gift sheet and the wallet.

export function giftTotal(price: number, qty: number): number {
  return price * qty;
}

export function canAfford(balance: number, price: number, qty: number): boolean {
  return balance >= giftTotal(price, qty);
}

// Creator earnings: coins to USD at the payout rate (100 coins = $1, creator keeps 70%).
export function coinsToUsd(coins: number, share = 0.7): number {
  return Math.round(coins * share) / 100;
}
