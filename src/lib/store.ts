// src/lib/store.ts
import { Store } from "@tauri-apps/plugin-store";

let _store: Store | null = null;
export async function getStore() {
  if (!_store) _store = new Store(".settings.dat");
  return _store!;
}

export async function load<T>(key: string, fallback: T): Promise<T> {
  const s = await getStore();
  return ((await s.get<T>(key)) ?? fallback) as T;
}

export async function save<T>(key: string, value: T) {
  const s = await getStore();
  await s.set(key, value);
  await s.save();
}
