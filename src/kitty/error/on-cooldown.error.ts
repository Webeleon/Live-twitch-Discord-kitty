export class OnCooldownError extends Error {
  constructor(public cooldown: number) {
    super(`Pet on cooldown for ${cooldown}`);
  }
}
