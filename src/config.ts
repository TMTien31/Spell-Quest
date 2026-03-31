export const CONFIG = {
  STARTING_HP: Number(import.meta.env.VITE_STARTING_HP) || 100,
  DEDUCTED_HP_ON_LOSS: Number(import.meta.env.VITE_DEDUCTED_HP_ON_LOSS) || 20,
  STARTING_COINS: Number(import.meta.env.VITE_STARTING_COINS) || 0,
  COINS_PER_LEVEL: Number(import.meta.env.VITE_COINS_PER_LEVEL) || 20,
  COINS_ON_COMPLETION: Number(import.meta.env.VITE_COINS_ON_COMPLETION) || 100,

  PRICE_HINT: Number(import.meta.env.VITE_PRICE_HINT) || 50,
  PRICE_SHIELD: Number(import.meta.env.VITE_PRICE_SHIELD) || 100,
  PRICE_REVEAL_LETTER: Number(import.meta.env.VITE_PRICE_REVEAL_LETTER) || 150,
  PRICE_LUCKY_SPIN: Number(import.meta.env.VITE_PRICE_LUCKY_SPIN) || 100,
  PRICE_CANDY: Number(import.meta.env.VITE_PRICE_CANDY) || 300,
  PRICE_CHOCOLATE: Number(import.meta.env.VITE_PRICE_CHOCOLATE) || 450,
  PRICE_CAKE: Number(import.meta.env.VITE_PRICE_CAKE) || 600,

  LUCKY_SPIN_COIN_1: Number(import.meta.env.VITE_LUCKY_SPIN_COIN_1) || 70,
  LUCKY_SPIN_COIN_2: Number(import.meta.env.VITE_LUCKY_SPIN_COIN_2) || 100,
  LUCKY_SPIN_COIN_3: Number(import.meta.env.VITE_LUCKY_SPIN_COIN_3) || 130,
};
