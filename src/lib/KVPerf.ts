// 纯运行时缓存（同进程内共享）
const cache = new Map<string, unknown>();

/** 写入：任意类型都可存（结构体/数组/类实例都行） */
export function set<T>(key: string, value: T): void {
  cache.set(key, value as unknown);
}

/** 读取：需要时在调用处用 <T> 指定返回类型 */
export function get<T>(key: string): T | undefined {
  return cache.get(key) as T | undefined;
}
