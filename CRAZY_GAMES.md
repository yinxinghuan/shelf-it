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

- Strips every `images.aiwaves.tech/alteru` and `alteru.app` script tag, including `guest-shell.js` (the AlterU banner, email login, and coupon bar). The default `npm run build` still includes `guest-shell.js`.
- Hides and removes `#alteru-guest-banner`, `#alteru-guest-login`, `#alteru-guest-coupon`, and `#alteru-guest-coupon-claim` if something injects them after load. That scrubber is Crazy Games HTML only.
- Starts on the opening headliner pick. There is no account screen and no “download AlterU” / App Store gate.
- Saves progress and best net worth in `localStorage` on the device.
- Opens the leaderboard as a local note (“best net worth stays on this device”) instead of “Open in AlterU” / the App Store.
- Does not treat Crazy Games query parameters as an Aigram session.
- Serves `<html lang="en" class="cg-guest">` with `<title>Shelf It</title>`. A Chinese browser language (or a saved `shelfit_locale`) still switches the in-game strings. With neither set, the UI is English.
- Fails `npm run build:crazygames` if the output still contains the guest shell, an App Store link, “Open in AlterU”, or an `AIGRAM` watermark.

Left in the guest build on purpose:

- The in-game **SHELF · IT** wordmark. That is the game title, matching the Crazy Games listing name Shelf It.
- Gameplay, the English copy for non-zh browsers, and guest play with no login wall.
- `aigram-bridge.js` and `alteru-storage-scope.js`. They are not drawn on screen. Saves stay on the device. Removing the bridge is not required for the watermark pass.

The default `npm run build` path is unchanged for GitHub Pages and any AlterU/Aigram embed. That build still loads `guest-shell.js`, still shows the AlterU banner, and still offers the AlterU leaderboard link. `aigram-bridge.js` still runs on that build.

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

On that preview, and on https://yinxinghuan.github.io/shelf-it/crazygames/ after this merges to `master`:

- The first screen is the SHELF · IT headliner pick. There is no AlterU pill, “Create game” button, email login, or coupon bar.
- Pick a category and the shift starts. The HUD is cash, day, and the clock. No AIGRAM badge.
- Leaderboard (from the end-of-day receipt) says the best net worth stays on this device and has no outbound link.
- The root site, https://yinxinghuan.github.io/shelf-it/, still loads `guest-shell.js` and still shows the AlterU banner.
