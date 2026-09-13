# LCARS Pad

The Picard-pad PADD we always wanted — **Sudoku**, **2048**, and the **audio harness** on a Galaxy Z Fold 8 Ultra.

Fan-made LCARS-inspired interface. Not affiliated with Paramount or Star Trek.

| Display | Physical | CSS viewport | Ratio |
|---|---|---|---|
| Cover (folded) | 6.5" 1080×2520 | 412×960 | 22:9 tall PADD |
| Inner (open) | 8.0" 2256×2504 | 1080×1200 | 9:10 command table |

## Download APK

https://github.com/bjarkimg/lcars-pad/releases/latest

Sideload `lcars-pad-debug.apk` on the Fold. Not on Play Store yet.

## What’s in here

- **Sudoku** — LCARS logic grid
- **2048** — merge tiles
- **Audio harness** — LCARS tap / alert / warp library with haptics

No home-server bridge. No pantry, TV, Hue, or Yamaha. Those stay in `lcars-fold` / `lcars-app`.

## Play Store later

Possible as a **games / entertainment** listing if the store title and screenshots stay LCARS-inspired and **do not** claim to be official Star Trek / Picard merchandise. You’ll need a Play Console account, a signing key, a privacy policy URL, and Fold screenshots (cover + inner). This repo is the product; listing copy can wait.

## Dev

```bash
cd ~/.xo/projects/lcars-pad
npm install
npm test
npm run dev          # http://localhost:5175
npm run build:android
```

JDK 17 + Android SDK (same as `lcars-app` build).
