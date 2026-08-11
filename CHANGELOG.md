# network-canvas-architect

## 6.6.1

- **Fixed a crash on launch.** Version 6.6.0 could fail to start with a "Cannot find module
  'readable-stream/passthrough'" error, caused by required dependency files being left out of
  the packaged app. The app now starts correctly, and protocol import/export functionality
  affected by the same packaging issue has been restored.

## 6.6.0

- **Updated core dependencies.** The technology the app is built on has been brought up to
  date, which improves stability and performance and lays the groundwork for future
  improvements.
- **Compatibility with upcoming macOS versions.** This release ensures the app continues to
  run smoothly on the latest and upcoming versions of macOS.
- **Improved security.** We've adopted current security best practices for building and
  distributing the app — including properly signed and notarized macOS builds — so you can be
  confident the software you download is genuine and safe to run.
