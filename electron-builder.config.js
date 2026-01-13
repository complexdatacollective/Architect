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
    'network-canvas/dist/**/*',
    'node_modules/**/*',
    '!node_modules/**/node_modules/**',
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
    notarize: false,
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

  // After sign hook for notarization
  afterSign: 'build-resources/scripts/afterSignHook.js',

  // Windows configuration
  win: {
    icon: 'build-resources/icon.ico',
    target: [
      {
        target: 'nsis',
        arch: ['x64'],
      },
    ],
    certificateSubjectName: 'Complex Data Collective',
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
