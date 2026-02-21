import fs from "node:fs";
import { Ok, Result } from "./types";

type CacheEntry<T> = {
  value: T;
  fetchedAtMs: number;
};

type FileCacheOptions<T> = {
  filepath: string;
  ttlMs: number;
  fetch: () => Promise<Result<T>>;
};

export type CacheOutput<T> = {
  result: Result<T>;
  retryInMs: number | undefined;
};

export function createFileCache<T>(
  opts: FileCacheOptions<T>,
): () => Promise<CacheOutput<T>> {
  const read = (): CacheEntry<T> | undefined => {
    try {
      const raw = fs.readFileSync(opts.filepath, "utf-8");
      return JSON.parse(raw) as CacheEntry<T>;
    } catch {
      return undefined;
    }
  };

  const write = (entry: CacheEntry<T>): void => {
    try {
      fs.writeFileSync(opts.filepath, JSON.stringify(entry));
    } catch {
      // best effort
    }
  };

  return async (): Promise<CacheOutput<T>> => {
    const now = Date.now();
    const cached = read();

    const isFresh = cached && now - cached.fetchedAtMs < opts.ttlMs;
    if (isFresh) {
      return {
        result: Ok(cached.value),
        retryInMs: cached.fetchedAtMs + opts.ttlMs - now,
      };
    }

    const result = await opts.fetch();

    if (result.ok) {
      write({ value: result.value, fetchedAtMs: now });
      return { result, retryInMs: undefined };
    }

    return cached
      ? { result: Ok(cached.value), retryInMs: opts.ttlMs }
      : { result, retryInMs: opts.ttlMs };
  };
}
