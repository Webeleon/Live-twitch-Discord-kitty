export class InsufficientResourceError extends Error {
  constructor(message = 'insufficient balance') {
    super(message);
  }
}
