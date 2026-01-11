# Architect [![Build Status](https://travis-ci.org/complexdatacollective/Architect.svg?branch=master)](https://travis-ci.org/complexdatacollective/Architect)

Network Canvas Architect is a survey design tool for the [Network Canvas](https://networkcanvas.com) suite of applications. It is built on [Electron](https://electronjs.org/) and [React](https://reactjs.org/).

**This tool is in maintainance mode.** We are not actively developing new features, but will continue to fix bugs and accept pull requests. Community contributions are very welcome!

See the [Network Canvas](https://networkcanvas.com) website for more information.

For questions and support, please visit the [Network Canvas User Community](https://community.networkcanvas.com/).

## Setting up a development environment

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v22.x LTS) - Use [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm) for version management
- [pnpm](https://pnpm.io/) (v9.x) - Install via `corepack enable` or `npm install -g pnpm`
- [Git](https://git-scm.com/)
- [Python](https://www.python.org/) (v3.10+) - For native module compilation

### Installation

1. Clone the repository

```sh
git clone https://github.com/complexdatacollective/Architect.git
```

2. Fetch submodules

```sh
git submodule update --init --recursive -f
```

3. Install packages with pnpm

```sh
pnpm install
```

Note: The `.npmrc` file configures x64 architecture for Electron (required until Electron upgrade is complete).

# Operation

| `pnpm run <script>`             | Description                                                                                                                                  |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `start:architect:electron`      | Serves your app for consumption by electron.                                                                                                 |
| `preelectron:dev`               | Copies the electron source to `./electron-dev` (must be run only when setting up the repo for the first time, or bumping the version number) |
| `dev:electron`                  | Runs electron window with contents of `start:architect:electron` (must be run concurrently)                                                  |
| `build`                         | Compiles assets and prepares app for production in the /build directory.                                                                     |
| `lint`                          | Lints js/scss                                                                                                                                |
| `test`                          | Runs testing suite                                                                                                                           |
| `preflight`                     | Runs linting & testing. Useful as a prepush/build hook                                                                                       |
| `dist:mac`                      | Build and publish macOS version                                                                                                              |
| `dist:linux`                    | Build and publish Linux version                                                                                                              |
| `dist:win`                      | Build and publish Windows version                                                                                                            |
| `dist:all`                      | Build and publish all platforms                                                                                                              |
| `update-submodules`             | Update git submodules                                                                                                                        |

> **Note:** Preview functionality is temporarily disabled pending security modernization of the network-canvas submodule.

### Bump version

Supply a version mask with x for unchanged values:

`npm run [x.x.1] [codename]`

e.g.

`npm run x.1.0 NameOfVersion`

### Development workflow in Electron

To run the app in development mode:

1. `pnpm run start:architect:electron` - Start the webpack dev server (runs on port 3003)

2. `pnpm run preelectron:dev` - Copy electron source to `./electron-dev` (only needed on first setup or after version bump)

3. `pnpm run dev:electron` - Run the Electron app (in another terminal)

## Application Structure

```
.
├── build                    # Prod assets
├── config                   # Project and build configurations (webpack, env config)
├── public                   # Static public assets
│   └── index.html           # Static entry point
├── src                      # Application source code
│   ├── index.js             # Application bootstrap and rendering
│   ├── routes.js            # App Route Definitions
│   ├── components           # Contains directories for components
│   ├── containers           # Contains directories for containers for native and base classes
│   ├── reducers             # Reducers for data stores
│   ├── ducks                # Middleware, modules (ducks-style with actions, reducers, and action creators), and store
│   └── utils                # Helpers and utils
```
