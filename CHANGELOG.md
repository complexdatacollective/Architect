# network-canvas-architect

## 6.6.3

- **Fixed a crash when editing stages.** Adding or opening a stage whose editor shows option
  cards (for example a Sociogram's background and layout mode) stopped with "Something went
  wrong. jsx is not defined". A broken release of a supporting library has been replaced, and
  these editors open normally again.
- **Fixed a crash when editing Information stages.** Opening an Information stage (for example
  the sample protocol's Welcome stage) stopped with "Objects are not valid as a React child",
  because the content-block layout loaded a second, incompatible copy of React. The editor
  opens normally again.
- **Fixed missing spaces in editor text.** The tie-strength census prompt guidance read "option
  valuesincluding"; it now reads correctly.
- **Fixed "Download Sample Protocol".** Downloading the sample protocol always failed with
  "Buffer is not defined". It now downloads, saves to the location you choose, and opens.
- **Fixed upgrading older protocols.** Choosing "Create upgraded copy" for a protocol made with
  an older version of Architect (schema 6 or earlier) failed with "Something went wrong" and
  saved nothing. The upgraded copy is now created and opens.
- **Fixed external data missing from the printable summary.** The summary did not list the
  variables in external data files (such as roster CSVs) and logged errors while it loaded. It
  now reads those files, and the summary window loads without errors.
- **Fixed an error when previewing a stage.** The Interviewer preview logged an error when it
  first cleared its temporary protocol folder. The preview itself was unaffected.
- **Fixed custom node labels in the stage preview.** A protocol's custom node label script
  (`nodeLabelWorker.js`) was looked for in the wrong folder during preview, so previewed nodes
  showed their plain names. The preview now uses the protocol's script, as Interviewer does.
- **Fixed a path traversal weakness when importing protocols.** Importing a protocol file
  (`.netcanvas`) used a ZIP extraction library with a known flaw: a specially crafted archive
  could write files outside the folder it was being unpacked into. It has been replaced with a
  maintained library that refuses these archives. Protocol files that contain links pointing
  outside their own folder, or repeated file names, now fail to import instead of being
  unpacked; ordinary protocols are unaffected.
- **Updated Electron to 43.7.** This brings in the Chromium and Node.js fixes shipped since
  Electron 43.0, including several security fixes for sandboxing and cross-origin file access.
- **Fixed out-of-date results appearing in variable and asset lists.** When the data source for
  a field changed quickly, a slow response for the old source could overwrite the newer one.
  Only the latest request is used now.
- **More reliable macOS signing.** The build tooling (electron-builder 26.16) unlocks the
  signing keychain correctly, so macOS builds are signed and notarized consistently.
- **Internal improvements.** Many editor panels (the variable picker, form sections, date
  picker, sociogram prompt settings and others) now derive their state while rendering instead
  of in a delayed update. Behaviour is unchanged.

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
