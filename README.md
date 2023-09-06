# Architect [![Build Status](https://travis-ci.org/complexdatacollective/Architect.svg?branch=master)](https://travis-ci.org/complexdatacollective/Architect)

Network Canvas Architect is a survey design tool for the [Network Canvas](https://networkcanvas.com) suite of applications. It is built on [Electron](https://electronjs.org/) and [React](https://reactjs.org/).

**This tool is in maintainance mode.** We are not actively developing new features, but will continue to fix bugs and accept pull requests. Community contributions are very welcome!

See the [Network Canvas](https://networkcanvas.com) website for more information.

For questions and support, please visit the [Network Canvas User Community](https://community.networkcanvas.com/).

## Setting up a development environment

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v14.21.3)
- [npm](https://www.npmjs.com/) (v8.3.2)
- [Git](https://git-scm.com/)
- [Python](https://www.python.org/) (v3.10.12)

### Installation

1. Clone the repository

```sh
git clone https://github.com/complexdatacollective/Architect.git
```

2. Fetch submodules

```sh
git submodule update --init --recursive -f
```

3. Install NPM packages

```sh
npm install
```

Note: for Apple Silicon users, you need to install the `electron` package manually:

```sh
  npm install electron --arch=x86
```

# Operation

| `npm run <script>`              | Description                                                                                                                    |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `start:architect:electron`      | Serves your app for consumption by electron.                                                                                   |
| `start:network-canvas:electron` | Serves network canvas for consumption by previewer.                                                                            |
| `electron:dev`                  | Runs electron window with contents of `start:architect:electron` and `start:network-canvas:electron`(must be run concurrently) |
| `build`                         | Compiles assets and prepares app for production in the /build directory.                                                       |
| `lint`                          | Lints js/scss                                                                                                                  |
| `test`                          | Runs testing suite                                                                                                             |
| `preflight`                     | Runs linting & testing. Useful as a prepush/build hook                                                                         |
| `dist:mac`                      | Build and publish OS X verison                                                                                                 |
| `dist:linux`                    | Build and publish Linux version                                                                                                |
| `dist:win`                      | Build and publish Windows version                                                                                              |
| `dist:all`                      | Build and publish all platforms                                                                                                |
| `update-submodules`             | Update git submodules                                                                                                          |

### Bump version

Supply a version mask with x for unchanged values:

`npm run [x.x.1] [codename]`

e.g.

`npm run x.1.0 NameOfVersion`

### Development workflow in Electron

There are two additional tasks to enable development within an electron app natively:

1. `npm run start:architect:electron`: to start the webpack dev server

- Note: must be running on port 3003.

1. `npm run start:network-canvas:electron`: to start the webpack dev server

- Note: must be running on port 3000.

2. `npm run preelectron:dev` (in another terminal session)

- Copies the electron source to `./electron-dev`

3. `npm run dev:electron` Runs the electron app from there

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
