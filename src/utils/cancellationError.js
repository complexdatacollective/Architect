export default class CancellationError extends Error {
  constructor() {
    super('canceled');
  }
}
