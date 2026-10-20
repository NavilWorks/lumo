# Architecture

Status: Milestone 1. Sections marked **Planned** describe intent, not shipped code.

## Overview

Lumo is a Tauri 2 app. Two processes, one trust boundary.

```text
Rust process (user privileges, no elevation)
  src-tauri/src/lib.rs     commands: app_info
  collectors (Planned)     read-only OS queries
          ▲
          │  IPC: invoke("app_info")
          │  gated by src-tauri/capabilities/default.json
          ▼
WebView2 (sandboxed, strict CSP)
  src/lib/backend.ts       typed wrappers around invoke()
  src/App.tsx              renders state, never touches the OS
```

## Responsibilities

| Layer | Owns | Must not |
| --- | --- | --- |
| Rust backend | All OS access, data collection, validation, rate limiting | Write system state, elevate, persist itself, phone home |
| IPC boundary | Typed, explicit commands only | Expose generic shell, fs or http access |
| React UI | Rendering, user preferences in memory | Assume data exists; it must handle "unavailable" and errors |

## IPC contract

Every command is declared in `src-tauri/src/lib.rs` and mirrored as a TypeScript type in `src/lib/backend.ts`.
Frontend calls return `BackendResult<T>`: either `{ ok: true, data }` or `{ ok: false, reason, message }`.
The UI renders all three states (loading, data, failure). No silent fallbacks to fake data.

| Command | Returns | Status |
| --- | --- | --- |
| `app_info` | `{ name, version, os, arch }` | Implemented, tested |

## Data flow (Planned)

1. A collector task in Rust samples metrics on a fixed interval (target: 1 s, configurable).
2. Samples go into a bounded ring buffer in memory. Nothing is written to disk by default.
3. The UI pulls snapshots via a command, or subscribes to a Tauri event. Choice deferred until measured.
4. Collector failure for one metric does not take down others. Each metric carries its own error state.

Candidate data sources, to be evaluated against the security rules before use:

- `sysinfo` crate for cross-platform CPU, memory, disk, network and process data.
- Win32 / `windows` crate (PDH, `GetSystemTimes`, `GlobalMemoryStatusEx`) where `sysinfo` is not enough.

Requirements any source must meet: works without administrator rights, read-only, no kernel driver, no WMI writes.

## Decisions log

| Decision | Why |
| --- | --- |
| Tauri over Electron | Smaller binary, Rust for OS access, capability-based permissions |
| No Tauri plugins in M1 | Each plugin widens the attack surface. Add only with a written need. |
| `core:app:default` only | Frontend needs nothing from window, event, path or tray APIs yet |
| npm, lockfiles committed | Reproducible installs in CI and locally |
| TypeScript 6.0.x, not 7 | typescript-eslint does not support TS 7 yet |
