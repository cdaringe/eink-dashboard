export type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; value: E };

export function Ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

export function Err<E = string>(value: E): Result<never, E> {
  return { ok: false, value };
}
