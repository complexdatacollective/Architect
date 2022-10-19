# Architect [![Build Status](https://travis-ci.org/complexdatacollective/Architect.svg?branch=master)](https://travis-ci.org/complexdatacollective/Architect)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fcomplexdatacollective%2FArchitect.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fcomplexdatacollective%2FArchitect?ref=badge_shield)

Technologies used:
ES6 (via Babel)
React
Redux
Electron
Cordova
SCSS
Jest (Testing suite)
React Scripts

# Operation

## Node/NPM Version

This project currently requires version `12.14.1` of node, and version `6.13.4` of npm. These are the only supported versions for this project.

As a convenience, the repository contains a `.node-version` file that enables convinient use of a node environment manager.

## Installation
This repository assumes that `npm` is installed. If you don't have it installed, here are [installation instructions](https://docs.npmjs.com/getting-started/installing-node).

0. Install the correct node and npm versions
1. Clone this repository.
2. Fetch submodules by typing `git submodule update --init --recursive -f`.
3. Enter the directory where the repository is cloned, and install the project dependencies by typing `npm install`.
4. Refer to the development tasks section below to learn how to test and build the app.

### Available commands:

|`npm run <script>`|Description|
|------------------|-----------|
|`start`|Serves your app at `localhost:3000`.|
|`start:architect:electron`|Serves your app for consumption by electron.|
|`start:network-canvas:electron`|Serves network canvas for consumption by previewer.|
|`electron:dev`|Runs electron window with contents of `start:architect:electron`  and `start:network-canvas:electron`(must be run concurrently)|
|`build`|Compiles assets and prepares app for production in the /build directory.|
|`lint`|Lints js/scss|
|`test`|Runs testing suite|
|`preflight`|Runs linting & testing. Useful as a prepush/build hook|
|`dist:mac`|Build and publish OS X verison|
|`dist:linux`|Build and publish Linux version|
|`dist:win`|Build and publish Windows version|
|`dist:all`|Build and publish all platforms|
|`update-submodules`|Update git submodules|

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
2. `npm run electron:dev` (in another terminal session)
  1. Copies the electron source to `./electron-dev`
  2. Runs the electron app from there

#### Dev tools

Electron supports [extensions to Chrome devtools](https://electronjs.org/docs/tutorial/devtools-extension) such as Redux DevTools.

In the development environment, these will be loaded if you provide one or more paths to your extensions (semicolon-separated) in the `NC_DEVTOOLS_EXTENSION_PATH` environment variable. The electron docs describe how to find the filepath for an extension once installed.

Example: enabling Redux Devtools on macOS:
```bash
NC_DEVTOOLS_EXTENSION_PATH=~/Library/Application\ Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.15.2_0 npm run electron:dev
```

#### Environment options

```bash
AUTO_OPEN_BROWSER=false  # Set to false to disable browser auto open on `npm run start`, Default: true
WEBPACK_DEV_SERVER_PORT=3003  # Configure port for dev server. Default: 3003
CSC_IDENTITY_AUTO_DISCOVERY=false  # Set to false to disable signing builds (speeds up build process)
```

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


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fcodaco%2FArchitect.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fcodaco%2FArchitect?ref=badge_large)
