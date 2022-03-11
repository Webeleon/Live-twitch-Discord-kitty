export class NegativeAmountError extends Error {
  constructor() {
    super(`Amount need to be positive.`);
  }
}
