# Design system

Pure black canvas. Light comes only from data. Every glow should mean something.

## Palette

| Token | Hex | Role | Contrast on `#000000` |
| --- | --- | --- | --- |
| `--lumo-black` | `#000000` | Background (OLED, true black) | n/a |
| `--lumo-cyan` | `#00F5FF` | Primary accent, CPU | 15.50 : 1 |
| `--lumo-violet` | `#A855F7` | Secondary accent, Memory | 5.31 : 1 |
| `--lumo-green` | `#39FF88` | Healthy / OK, Disk | 15.83 : 1 |
| `--lumo-amber` | `#FFB000` | Warning, Network | 11.46 : 1 |
| `--lumo-red` | `#FF3158` | Critical / error | 5.83 : 1 |

All six pass WCAG 2.x AA (4.5 : 1) for normal text on black. Violet and red are the weakest: avoid them for small body text.

Supporting neutrals: surface `#0A0A0C`, border `#1C1C22`, text `#F2F2F5` (18.79 : 1), muted `#8A8A96` (6.16 : 1).

Tokens live in `src/styles/tokens.css`. Components use semantic tokens (`--color-ok`, `--color-warn`, `--color-critical`), not raw hex.

## Rules

- **Black is the default.** Surfaces lift by a hair (`#0A0A0C`), never to grey.
- **Status colors are reserved.** Green, amber and red mean health states. Do not use them as decoration once metrics exist.
- **Never rely on color alone.** Pair status color with text or an icon.
- **Glow sparingly.** One glow per card, on the indicator dot.
- **No fake motion.** Charts animate only when real data changes. Respect `prefers-reduced-motion`.
- **Numbers in mono.** Metric values use `--font-mono` so digits do not jitter.

## Type

System stack, no web fonts (local-first): Segoe UI Variable on Windows 11, Segoe UI on Windows 10. Mono: Cascadia Mono, then Consolas.
