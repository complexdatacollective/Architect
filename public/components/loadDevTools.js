const log = require("./log");

const loadDevTools = () => {
	if (process.env.NODE_ENV !== "development" || process.env.DISABLE_DEV_TOOLS === "true") {
		return Promise.resolve(null);
	}

	// Only require electron-devtools-installer in development mode
	// This module is a devDependency and not available in production builds
	const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require("electron-devtools-installer");

	return Promise.all([installExtension(REACT_DEVELOPER_TOOLS), installExtension(REDUX_DEVTOOLS)])
		.then((tools) => log.info(`Added Extension:  ${tools.toString()}`))
		.catch((err) => {
			log.warn("An error occurred: ", err);
		});
};

module.exports = loadDevTools;
