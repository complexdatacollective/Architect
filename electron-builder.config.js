/**
 * Electron Builder Configuration
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
  appId: 'org.complexdatacollective.networkcanvas.architect',
  productName: 'Network Canvas Architect',
  copyright: 'Copyright © 2024 Complex Data Collective',

  // Directories
  directories: {
    buildResources: 'build-resources',
    output: 'release-builds',
  },

  // Files to include in the app
  files: [
    'dist/**/*',
    '!dist/main/_dummy.js',
    'node_modules/**/*',
    // Nested node_modules MUST be included: electron-builder resolves version
    // conflicts by nesting the losing version under its dependent (e.g.
    // lazystream needs readable-stream@2 for its `readable-stream/passthrough`
    // require, while archiver hoists readable-stream@4 to the root). Excluding
    // `node_modules/**/node_modules/**` strips those copies and crashes the
    // packaged app at launch with "Cannot find module".
    '!**/*.{map,ts,md}',
    '!**/test/**',
    '!**/tests/**',
    '!**/__tests__/**',
    '!**/.*',
  ],

  // Extra files to include (not in asar)
  extraResources: [
    {
      from: 'public/icons',
      to: 'icons',
    },
    // The preview window renders the Interviewer app. Bundle its built renderer
    // and preload (produced by `@codaco/interviewer-classic#build`) into
    // resources/interviewer; createPreviewWindow.js loads them from
    // process.resourcesPath in packaged builds. This consumes interviewer-
    // classic's BUILD OUTPUT, not its source, so turbo.json gives
    // `@codaco/architect-classic#build` an explicit dependsOn entry for
    // `@codaco/interviewer-classic#build` — the source-first `^topo` edge
    // alone would not build it.
    {
      from: 'interviewer-preview/renderer',
      to: 'interviewer/renderer',
    },
    {
      from: 'interviewer-preview/preload',
      to: 'interviewer/preload',
    },
  ],

  // Asar archive
  asar: true,
  asarUnpack: [
    '**/*.node',
    '**/node_modules/sharp/**',
    '**/node_modules/@img/**',
  ],

  // File associations
  fileAssociations: [
    {
      ext: 'netcanvas',
      name: 'Network Canvas Protocol',
      description: 'Network Canvas interview protocol',
      mimeType: 'application/x-netcanvas',
      icon: 'file',
      role: 'Editor',
    },
  ],

  // macOS configuration
  mac: {
    category: 'public.app-category.education',
    icon: 'build-resources/icon.icns',
    hardenedRuntime: true,
    gatekeeperAssess: false,
    entitlements: 'build-resources/entitlements.mac.inherit.plist',
    entitlementsInherit: 'build-resources/entitlements.mac.inherit.plist',
    target: [
      {
        target: 'dmg',
        arch: ['x64', 'arm64'],
      },
      {
        target: 'zip',
        arch: ['x64', 'arm64'],
      },
    ],
    // Notarize via electron-builder's built-in notarytool when credentials are
    // present — either App Store Connect API key (APPLE_API_KEY/APPLE_API_KEY_ID/
    // APPLE_API_ISSUER) or Apple ID (APPLE_ID/APPLE_APP_SPECIFIC_PASSWORD/
    // APPLE_TEAM_ID). Evaluates to false on local/unsigned builds, skipping it.
    notarize: Boolean(process.env.APPLE_API_KEY || process.env.APPLE_ID),
  },

  // DMG configuration
  dmg: {
    contents: [
      {
        x: 130,
        y: 220,
      },
      {
        x: 410,
        y: 220,
        type: 'link',
        path: '/Applications',
      },
    ],
    sign: false,
  },

  // Windows configuration
  win: {
    icon: 'build-resources/icon.ico',
    target: [
      {
        target: 'nsis',
        arch: ['x64'],
      },
    ],
    // Windows builds ship unsigned (no code-signing certificate configured).
  },

  // NSIS installer configuration
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: false,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
  },

  // Linux configuration
  linux: {
    icon: 'build-resources',
    category: 'Education',
    maintainer: 'Complex Data Collective <info@networkcanvas.com>',
    target: [
      {
        target: 'AppImage',
        arch: ['x64', 'arm64'],
      },
      {
        target: 'deb',
        arch: ['x64', 'arm64'],
      },
      {
        target: 'rpm',
        arch: ['x64', 'arm64'],
      },
      {
        target: 'tar.gz',
        arch: ['x64', 'arm64'],
      },
    ],
  },

  // AppImage configuration
  appImage: {
    artifactName: '${productName}-${version}-${arch}.${ext}',
  },

  // Publish configuration
  publish: [
    {
      provider: 'github',
      owner: 'complexdatacollective',
      repo: 'architect',
      releaseType: 'draft',
    },
  ],

  // Artifact naming
  artifactName: '${productName}-${version}-${os}-${arch}.${ext}',
};
