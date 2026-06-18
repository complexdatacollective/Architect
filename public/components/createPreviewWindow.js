/**
 * Creates the preview window for Network Canvas.
 *
 * The preview window renders the Interviewer app, consumed as the
 * `network-canvas-interviewer` workspace package. The Interviewer's preload
 * bridges Architect's `remote:preview`/`remote:reset` IPC into the interview;
 * Architect's main process hosts the renderer's IPC (fs, dialog, asset://, …).
 *
 *  - Development: load the Interviewer's Vite dev server (live reload) and its
 *    preload source (plain CommonJS, no build step needed).
 *  - Packaged: load the Interviewer's built renderer + preload, bundled into
 *    resources/interviewer at pack time (see electron-builder.config.js
 *    `extraResources`).
 */
const { BrowserWindow, Menu, app, net } = require("electron");
const path = require("node:path");
const log = require("./log");
const getPreviewMenu = require("./previewMenu");

// The Interviewer's renderer dev server (apps/interviewer electron.vite.config).
const INTERVIEWER_DEV_URL = "http://localhost:3000";

// Resolve the Interviewer's preload script and renderer URL for the current
// environment.
function getInterviewerSources() {
	if (app.isPackaged) {
		const base = path.join(process.resourcesPath, "interviewer");
		return {
			preload: path.join(base, "preload", "index.js"),
			url: `file://${path.join(base, "renderer", "index.html")}`,
		};
	}

	// Dev: resolve the workspace package, load its source preload + dev server.
	const interviewerRoot = path.dirname(
		require.resolve("network-canvas-interviewer/package.json"),
	);
	return {
		preload: path.join(interviewerRoot, "src", "preload", "index.js"),
		url: INTERVIEWER_DEV_URL,
	};
}

// Probe a URL once: resolve true if the server responds at all (any status),
// false on connection error.
function probe(url) {
	return new Promise((resolve) => {
		const request = net.request(url);
		request.on("response", (response) => {
			response.on("data", () => {});
			response.on("end", () => {});
			resolve(true);
		});
		request.on("error", () => resolve(false));
		request.end();
	});
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const PROBE_MAX_ATTEMPTS = 60;
const PROBE_RETRY_DELAY_MS = 500;

// Poll until the dev server accepts connections (or attempts are exhausted).
function waitForServer(window, url, attempt = 0) {
	if (window.isDestroyed() || attempt >= PROBE_MAX_ATTEMPTS) {
		return Promise.resolve();
	}

	return probe(url).then((reachable) => {
		if (reachable || window.isDestroyed()) {
			return undefined;
		}
		return sleep(PROBE_RETRY_DELAY_MS).then(() =>
			waitForServer(window, url, attempt + 1),
		);
	});
}

/**
 * Load the preview URL. In development the Interviewer's dev server may not be
 * listening yet at Architect startup; wait for it to accept connections before
 * loading, otherwise the window lands on Chromium's error page whose auto-reload
 * is then blocked as an unsafe cross-origin navigation. Packaged builds load a
 * local file directly.
 */
function loadPreviewUrl(window, url) {
	const ready = app.isPackaged
		? Promise.resolve()
		: waitForServer(window, url);

	return ready.then(() => {
		if (window.isDestroyed()) {
			return undefined;
		}
		return window
			.loadURL(url)
			.catch((err) => log.error("Failed to load preview URL:", err));
	});
}

/**
 * Creates and returns a promise that resolves with the preview BrowserWindow.
 */
function createPreviewWindow() {
	return new Promise((resolve) => {
		const { preload: preloadPath, url: previewUrl } = getInterviewerSources();

		log.info("Creating preview window");
		log.info(`Preview preload: ${preloadPath}`);
		log.info(`Preview URL: ${previewUrl}`);

		global.previewWindow = new BrowserWindow({
			width: 1024,
			height: 768,
			show: false,
			title: "Network Canvas Preview",
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true,
				preload: preloadPath,
				webSecurity: true,
				allowRunningInsecureContent: false,
			},
		});

		// Set up the preview menu
		try {
			const previewMenu = Menu.buildFromTemplate(getPreviewMenu(global.previewWindow));
			global.previewWindow.setMenu(previewMenu);
		} catch (err) {
			log.error("Failed to set preview menu:", err);
		}

		// Handle window close - hide instead of destroy to allow reuse
		global.previewWindow.on("close", (event) => {
			event.preventDefault();
			global.previewWindow.hide();
		});

		// Log when window is ready
		global.previewWindow.webContents.on("did-finish-load", () => {
			log.info("Preview window loaded");
		});

		// Log any errors
		global.previewWindow.webContents.on("did-fail-load", (_event, errorCode, errorDescription) => {
			log.error(`Preview window failed to load: ${errorDescription} (${errorCode})`);
		});

		// Handle console messages from preview window
		global.previewWindow.webContents.on("console-message", (_event, level, message) => {
			if (level >= 2) {
				// warning or error
				log.warn(`[Preview] ${message}`);
			}
		});

		// Set window open handler to prevent opening new windows
		global.previewWindow.webContents.setWindowOpenHandler(() => {
			return { action: "deny" };
		});

		// Resolve as soon as the window exists so app startup is never blocked by
		// the dev server's readiness; the URL loads (and retries) in the background.
		loadPreviewUrl(global.previewWindow, previewUrl);
		resolve(global.previewWindow);
	});
}

// Helper to show the index page
createPreviewWindow.showIndex = () => {
	if (global.previewWindow && !global.previewWindow.isDestroyed()) {
		loadPreviewUrl(global.previewWindow, getInterviewerSources().url);
	}
};

module.exports = createPreviewWindow;
