const { BrowserWindow, Menu, MenuItem } = require("electron");
const path = require("node:path");
const log = require("./log");

const isMacOS = () => process.platform === "darwin";

const titlebarParameters = isMacOS() ? { titleBarStyle: "hidden", frame: false } : {};

global.appWindow = null;

function getPreloadPath() {
	// __dirname is dist/main/components/, preload is at dist/preload/
	return path.join(__dirname, "../../preload/app.js");
}

function createAppWindow() {
	return new Promise((resolve) => {
		if (global.appWindow) {
			Promise.resolve(global.appWindow);
		}

		// Create the browser window.
		const windowParameters = Object.assign(
			{
				width: 1440,
				height: 900,
				minWidth: 1280,
				minHeight: 800,
				center: true,
				title: "Network Canvas Architect",
				show: true,
				webPreferences: {
					nodeIntegration: false,
					contextIsolation: true,
					preload: getPreloadPath(),
				},
			},
			titlebarParameters,
		);

		global.appWindow = new BrowserWindow(windowParameters);

		// Enable right click menu for spelling suggestions
		global.appWindow.webContents.on("context-menu", (_, params) => {
			const menu = new Menu();

			// Add each spelling suggestion
			params.dictionarySuggestions.forEach((suggestion) => {
				menu.append(
					new MenuItem({
						label: suggestion,
						click: () => global.appWindow.webContents.replaceMisspelling(suggestion),
					}),
				);
			});

			// Allow users to add the misspelled word to the dictionary
			if (params.misspelledWord) {
				menu.append(
					new MenuItem({
						label: "Add to dictionary",
						// eslint-disable-next-line max-len
						click: () => global.appWindow.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord),
					}),
				);
			}

			menu.popup();
		});

		// Prevent new windows from being opened (e.g., shift|cmd-click)
		global.appWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));

		// For now, any navigation off the SPA is unneeded
		global.appWindow.webContents.on("will-navigate", (evt) => {
			evt.preventDefault();
		});

		global.appWindow.on("closed", () => {
			global.appWindow = null;
		});

		global.appWindow.webContents.on("did-finish-load", () => {
			resolve(global.appWindow);
		});

		// Load the app URL based on environment
		// electron-vite sets ELECTRON_RENDERER_URL in development
		if (process.env.ELECTRON_RENDERER_URL) {
			log.info("Loading renderer from dev server:", process.env.ELECTRON_RENDERER_URL);
			global.appWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
		} else {
			// Production: load from built files
			// __dirname is dist/main/components, renderer is at dist/renderer
			const indexPath = path.join(__dirname, "../../renderer/index.html");
			log.info("Loading renderer from file:", indexPath);
			global.appWindow.loadFile(indexPath);
		}

		if (process.env.NODE_ENV === "development") {
			global.appWindow.openDevTools();
		}
	});
}

module.exports = createAppWindow;
