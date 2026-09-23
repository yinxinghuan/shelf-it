# Crazy Games build

Shelf It ships two static builds:

| | GitHub Pages / other hosts | Crazy Games |
| --- | --- | --- |
| Command | `npm run build` | `npm run build:crazygames` |
| Output | `dist/` | `dist-crazygames/`, copied to `artifacts/crazygames/` |
| Upload zip | — | `artifacts/shelf-it-crazygames.zip` (`index.html` at the zip root) |
| Asset paths | relative (`./`) | relative (`./`), safe for iframe hosting |
| AlterU / Aigram | optional; active only when the host passes `api_origin` and `telegram_id` | **off**. Guests play immediately. No login wall and no App Store link |

## Guest play

Crazy Games requires that guests can play and that the game does not add its own login (including AlterU / Aigram) before play. This build:

- Strips `https://images.aiwaves.tech/alteru/guest-shell.js` (the AlterU guest login shell). The default `npm run build` still includes it.
- Starts on the opening headliner pick. There is no account screen and no “download AlterU” / App Store gate.
- Saves progress and best net worth in `localStorage` on the device.
- Opens the leaderboard as a local note (“best net worth stays on this device”) instead of “Open in AlterU” / the App Store.
- Does not treat Crazy Games query parameters as an Aigram session.

The default `npm run build` path is unchanged for GitHub Pages and any AlterU/Aigram embed. `aigram-bridge.js` still runs on that build.

The Pages workflow publishes this guest build next to the root site, without replacing it:

https://yinxinghuan.github.io/shelf-it/crazygames/

Progress sync through the Crazy Games SDK Data module is not wired up. Local best net worth is enough for this version.

## Build the upload package

```bash
npm ci
npm run build:crazygames
```

Upload `artifacts/shelf-it-crazygames.zip` in the Crazy Games developer portal. Do not submit from this repository’s automation.

`artifacts/crazygames/` is the same unpacked folder (`index.html` plus `./assets/...`) if you need to preview it:

```bash
npx --yes serve artifacts/crazygames
```
