export class OnCooldownError extends Error {
  constructor(public cooldown: number, message = 'Pet on cooldown for') {
    super(`${message} ${cooldown}`);
  }
}
