const HANDLED_ERROR_NAME = 'HandledError';

export function isHandledError(value: unknown): value is HandledError {
  return value instanceof Error && value.name === HANDLED_ERROR_NAME;
}

export default class HandledError extends Error {
  constructor(message: string) {
    super(message);
    this.name = HANDLED_ERROR_NAME;
  }
}
