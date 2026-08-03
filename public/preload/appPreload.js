/**
 * Preload script for the main application window.
 * Exposes a secure API via contextBridge for renderer process access.
 *
 * This replaces direct Node.js access (nodeIntegration: true) with a
 * controlled, whitelisted set of IPC channels and operations.
 */
const { contextBridge, ipcRenderer } = require("electron");

// Whitelist of valid IPC channels for send (renderer -> main)
const validSendChannels = [
	"READY",
	"QUIT",
	"CONFIRM_CLOSE_ACK",
	"ACTION",
	"preview:preview",
	"preview:clear",
	"preview:close",
	"preview:reset",
];

// Whitelist of valid IPC channels for receive (main -> renderer)
const validReceiveChannels = [
	"ACTION",
	"OPEN_FILE",
	"OPEN",
	"SAVE",
	"SAVE_COPY",
	"PRINT_SUMMARY",
	"CONFIRM_CLOSE",
	"SUMMARY_DATA",
	"REFRESH_PREVIEW",
	"remote:preview",
	"remote:reset",
];

contextBridge.exposeInMainWorld("electronAPI", {
	// ===================
	// IPC Communication
	// ===================
	ipc: {
		send: (channel, ...args) => {
			if (validSendChannels.includes(channel)) {
				ipcRenderer.send(channel, ...args);
			} else {
			}
		},
		on: (channel, callback) => {
			if (validReceiveChannels.includes(channel)) {
				const subscription = (_event, ...args) => callback(...args);
				ipcRenderer.on(channel, subscription);
				return () => ipcRenderer.removeListener(channel, subscription);
			}
			return () => {};
		},
		once: (channel, callback) => {
			if (validReceiveChannels.includes(channel)) {
				ipcRenderer.once(channel, (_event, ...args) => callback(...args));
			} else {
			}
		},
		removeAllListeners: (channel) => {
			if (validReceiveChannels.includes(channel)) {
				ipcRenderer.removeAllListeners(channel);
			}
		},
	},

	// ===================
	// Dialog Operations
	// ===================
	dialog: {
		showOpenDialog: (options) => ipcRenderer.invoke("dialog:showOpen", options),
		showSaveDialog: (options) => ipcRenderer.invoke("dialog:showSave", options),
		showMessageBox: (options) => ipcRenderer.invoke("dialog:showMessageBox", options),
	},

	// ===================
	// App Info
	// ===================
	app: {
		getPath: (name) => ipcRenderer.invoke("app:getPath", name),
		getAppPath: () => ipcRenderer.invoke("app:getAppPath"),
		getVersion: () => ipcRenderer.invoke("app:getVersion"),
	},

	// ===================
	// File System Operations
	// ===================
	fs: {
		readJson: (filePath) => ipcRenderer.invoke("fs:readJson", filePath),
		writeJson: (filePath, data, options) => ipcRenderer.invoke("fs:writeJson", filePath, data, options),
		readFile: (filePath, encoding) => ipcRenderer.invoke("fs:readFile", filePath, encoding),
		writeFile: (filePath, data) => ipcRenderer.invoke("fs:writeFile", filePath, data),
		copy: (src, dest) => ipcRenderer.invoke("fs:copy", src, dest),
		unlink: (filePath) => ipcRenderer.invoke("fs:unlink", filePath),
		remove: (filePath) => ipcRenderer.invoke("fs:remove", filePath),
		rename: (oldPath, newPath) => ipcRenderer.invoke("fs:rename", oldPath, newPath),
		access: (filePath, mode) => ipcRenderer.invoke("fs:access", filePath, mode),
		stat: (filePath) => ipcRenderer.invoke("fs:stat", filePath),
		mkdirp: (dirPath) => ipcRenderer.invoke("fs:mkdirp", dirPath),
		pathExists: (filePath) => ipcRenderer.invoke("fs:pathExists", filePath),
		readdir: (dirPath) => ipcRenderer.invoke("fs:readdir", dirPath),
		outputFile: (filePath, data) => ipcRenderer.invoke("fs:outputFile", filePath, data),
	},

	// ===================
	// Path Operations
	// ===================
	path: {
		join: (...args) => ipcRenderer.invoke("path:join", ...args),
		basename: (filePath, ext) => ipcRenderer.invoke("path:basename", filePath, ext),
		dirname: (filePath) => ipcRenderer.invoke("path:dirname", filePath),
		extname: (filePath) => ipcRenderer.invoke("path:extname", filePath),
		parse: (filePath) => ipcRenderer.invoke("path:parse", filePath),
		resolve: (...args) => ipcRenderer.invoke("path:resolve", ...args),
		normalize: (filePath) => ipcRenderer.invoke("path:normalize", filePath),
		relative: (from, to) => ipcRenderer.invoke("path:relative", from, to),
	},

	// ===================
	// Archive Operations
	// ===================
	archive: {
		create: (sourcePath, destPath) => ipcRenderer.invoke("archive:create", sourcePath, destPath),
		extract: (sourcePath, destPath) => ipcRenderer.invoke("archive:extract", sourcePath, destPath),
	},

	// ===================
	// Shell Operations
	// ===================
	shell: {
		openExternal: (url) => ipcRenderer.invoke("shell:openExternal", url),
		openPath: (filePath) => ipcRenderer.invoke("shell:openPath", filePath),
	},

	// ===================
	// Window Operations
	// ===================
	window: {
		hide: () => ipcRenderer.invoke("window:hide"),
		show: () => ipcRenderer.invoke("window:show"),
		close: () => ipcRenderer.invoke("window:close"),
	},

	// ===================
	// WebContents Operations
	// ===================
	webContents: {
		printToPDF: (options) => ipcRenderer.invoke("webContents:printToPDF", options),
	},

	// ===================
	// Platform Info
	// ===================
	platform: process.platform,

	// ===================
	// Environment Info
	// ===================
	env: {
		isDevelopment: process.env.NODE_ENV === "development",
		isProduction: process.env.NODE_ENV === "production",
		isPreview: false, // Main app window is not preview
		platform: process.platform,
	},
});
