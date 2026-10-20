import { invoke, isTauri } from "@tauri-apps/api/core";

/** Mirrors `AppInfo` in src-tauri/src/lib.rs. */
export interface AppInfo {
  name: string;
  version: string;
  os: string;
  arch: string;
}

export type BackendResult<T> = { ok: true; data: T } | { ok: false; reason: "no-backend" | "error"; message: string };

/**
 * Reads static build/runtime info from the Rust side.
 * Returns `no-backend` when running in a plain browser (`npm run dev`).
 */
export async function getAppInfo(): Promise<BackendResult<AppInfo>> {
  if (!isTauri()) {
    return { ok: false, reason: "no-backend", message: "Running outside Tauri. Backend unavailable." };
  }
  try {
    const data = await invoke<AppInfo>("app_info");
    return { ok: true, data };
  } catch (err) {
    return { ok: false, reason: "error", message: String(err) };
  }
}
