# Security model

Lumo reads sensitive information about a machine. The default answer to any new capability is no.

## Rules and how they are enforced

| Rule | Enforcement today | Verify |
| --- | --- | --- |
| **Local-first** | CSP `connect-src` allows only Tauri IPC. No http plugin. No remote URLs in config. Fonts are system fonts. | `src-tauri/tauri.conf.json` |
| **Read-only monitoring** | Only command is `app_info`, which reads compile-time constants. No fs, shell or process plugins. | `src-tauri/src/lib.rs`, `Cargo.toml` |
| **No telemetry by default** | No analytics, crash reporting or update-check code or dependencies. | `package.json`, `Cargo.toml` |
| **No unnecessary admin privileges** | Default Windows manifest is `asInvoker`. NSIS installer uses `installMode: currentUser`. | `tauri.conf.json` → `bundle.windows` |
| **No automatic process termination** | No code path terminates processes. Any future kill action must be user-initiated, per process, with confirmation. | Code review |
| **No hidden persistence** | No autostart plugin, no service, no scheduled task, no registry writes. | `Cargo.toml`, `capabilities/` |

## WebView hardening

- Content Security Policy: `default-src 'self'`, `script-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`, `form-action 'none'`.
- `style-src` allows `'unsafe-inline'` for React inline styles. Revisit once styling settles.
- `freezePrototype: true` blocks prototype pollution of JS builtins.
- `withGlobalTauri: false`. The Tauri API is only reachable through bundled imports.
- Capability `default` grants `core:app:default` to the `main` window only.

## Adding a capability: checklist

Before adding a plugin, permission or command:

1. Write down which feature needs it and why nothing narrower works.
2. Scope it to the smallest permission set and the `main` window only.
3. Confirm it works without administrator rights.
4. Confirm it does not write system state or persist across reboots.
5. Document it in this file and in `docs/ARCHITECTURE.md`.

## Repository hygiene

- `.gitignore` blocks `.env*`, keys and certificates (`*.pem`, `*.key`, `*.pfx`, `*.p12`), build output and dependencies.
- CI runs with `permissions: contents: read` and uses no secrets.
- No release or signing workflow exists. Code-signing keys must never enter the repo.

## Reporting a vulnerability

Do not open a public issue. Use GitHub's private vulnerability reporting on this repository, or contact the maintainer directly.
