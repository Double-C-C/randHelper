// src/lib/store.ts
import { Store } from "@tauri-apps/plugin-store";

// 预先启动一次加载，得到一个 Promise；后面统一 await 它即可
const storePromise = Store.load(".settings.dat");

export async function getStore() {
  return await storePromise;
}

export async function load<T>(key: string, fallback: T): Promise<T> {
  const s = await storePromise;
  const v = await s.get<T>(key);
  return (v ?? fallback) as T;
}

export async function save<T>(key: string, value: T) {
  const s = await storePromise;
  await s.set(key, value);
  await s.save();
}
