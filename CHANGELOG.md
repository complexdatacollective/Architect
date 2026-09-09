# network-canvas-architect

## 6.6.2

- **Fixed the variable picker opening behind the field editor.** Clicking "Select Variable" or
  "Change Variable" in a form field editor appeared to do nothing because the variable picker
  was being drawn underneath the field editor. It now opens above it, as it did in earlier
  versions.
- **Fixed oversized node previews in the entity select field.** Node previews in the entity
  select field editor were rendered at full interview size instead of the smaller preview size.
  They are now shown at the intended size again.

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
