# Development

## Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | 22.22.2+ or 24 LTS | `jsdom` requires at least 22.22.2 |
| Rust | stable (1.80+) | MSVC toolchain on Windows |
| C++ Build Tools | VS 2022 | "Desktop development with C++" workload |
| WebView2 Runtime | Evergreen | Preinstalled on Windows 11 |

Full official guide: <https://v2.tauri.app/start/prerequisites/>.

### Linux (contributors only)

Lumo targets Windows, but the code builds on Linux for development and review. Ubuntu 24.04:

```bash
sudo apt-get install -y libwebkit2gtk-4.1-dev libxdo-dev libssl-dev \
  libayatana-appindicator3-dev librsvg2-dev build-essential file
```

## Install and run

```bash
npm ci
npm run tauri:dev   # desktop app with hot reload
npm run dev         # browser only; the UI shows "backend unavailable"
```

## Checks

Run before every push. CI runs the same.

```bash
npm run check                       # typecheck + lint + tests
npm run build                       # production frontend build

cd src-tauri
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo test
```

## Builds

```bash
npm run tauri build -- --debug --no-bundle   # fast compile check, no installer
npm run tauri:build                          # release + NSIS and MSI installers
```

Output lands in `src-tauri/target/`, which is git-ignored. Do not commit build output or publish releases by hand.

## Regenerating icons

```bash
npx tauri icon assets/icon.svg -o src-tauri/icons
rm -rf src-tauri/icons/android src-tauri/icons/ios   # Windows target only
```

## Conventions

- Small commits, one concern each.
- Every new IPC command: Rust unit test, TypeScript type in `src/lib/backend.ts`, entry in `docs/ARCHITECTURE.md`.
- Every new permission or plugin: follow the checklist in `docs/SECURITY.md`.
- Never show mock metric values in the UI. Placeholder states only.
