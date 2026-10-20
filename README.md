<p align="center">
  <img src="assets/icon.svg" width="96" height="96" alt="Lumo icon" />
</p>

<h1 align="center">Lumo</h1>

<p align="center">
  A local-first, read-only system monitor for Windows.<br />
  OLED black. Neon accents. Zero telemetry.
</p>

---

> **Status: Milestone 1 (foundation).** Lumo builds and opens a window. It does **not** monitor anything yet.
> The CPU, Memory, Disk and Network cards are placeholders and display no data.

## What works today

| Area | Status |
| --- | --- |
| Tauri 2 desktop shell (Rust + WebView) | Working. Built and launched on Linux in development. Windows build validated by CI. |
| React + TypeScript UI shell with the Lumo palette | Working |
| Frontend to backend IPC (`app_info`: name, version, OS, arch) | Working, unit tested on both sides |
| CPU, memory, disk, network metrics | **Not implemented** |
| Process list | **Not implemented** |
| Installers, signed releases, auto-update | **Not implemented.** No releases are published. |

## Principles

Lumo watches your machine. That earns it zero extra trust, so the rules are strict:

- **Local-first.** No network calls. No accounts. No cloud.
- **Read-only.** Lumo observes. It never changes system settings.
- **No telemetry.** None by default, and none planned without explicit opt-in.
- **No admin rights.** Runs as the current user (`asInvoker`). Installer is per-user.
- **No automatic process termination.** Lumo will never kill a process on its own.
- **No hidden persistence.** No autostart, services, scheduled tasks or registry run keys.

How each rule is enforced in code and config: [docs/SECURITY.md](docs/SECURITY.md).

## Stack

| Layer | Choice |
| --- | --- |
| Shell | [Tauri 2](https://v2.tauri.app) |
| Backend | Rust (stable) |
| Frontend | React 19, TypeScript 6 (strict), Vite 8 |
| Tests | Vitest + Testing Library, `cargo test` |
| Lint | ESLint, `cargo clippy`, `rustfmt` |
| Target | Windows 10/11 x64 with WebView2 |

## Quick start (Windows)

Prerequisites, once:

1. [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) with "Desktop development with C++".
2. WebView2 Runtime (preinstalled on Windows 11 and current Windows 10).
3. [Rust](https://rustup.rs) stable, MSVC toolchain.
4. [Node.js](https://nodejs.org) 22.22.2+ or 24 LTS.

Then:

```powershell
git clone https://github.com/NavilWorks/lumo.git
cd lumo
npm ci
npm run tauri:dev
```

Full setup, Linux notes and troubleshooting: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server only (browser, no backend) |
| `npm run tauri:dev` | Desktop app with hot reload |
| `npm run tauri:build` | Release build and installers (local only) |
| `npm run build` | Typecheck and build the frontend to `dist/` |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | ESLint |
| `npm test` | Frontend unit tests |
| `npm run check` | Typecheck, lint and test |

Rust checks run from `src-tauri/`: `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, `cargo test`.

## Project layout

```text
lumo/
├── src/                 React frontend
│   ├── components/      UI components
│   ├── lib/backend.ts   Typed IPC bridge to Rust
│   └── styles/          Design tokens and global CSS
├── src-tauri/           Rust backend and Tauri config
│   ├── src/lib.rs       IPC commands
│   ├── capabilities/    Window permissions (minimal)
│   └── tauri.conf.json  App, CSP and bundle config
├── docs/                Architecture, security, design, development
└── assets/              Source artwork
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Security model](docs/SECURITY.md)
- [Design system](docs/DESIGN.md)
- [Development setup](docs/DEVELOPMENT.md)

## License

[MIT](LICENSE) © 2026 Navil
