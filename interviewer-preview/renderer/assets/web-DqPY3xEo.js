import { n as WebPlugin } from "./index-DZJPtDnl.js";
//#region ../../node_modules/.pnpm/@capacitor+browser@8.0.3_@capacitor+core@8.4.0/node_modules/@capacitor/browser/dist/esm/web.js
var BrowserWeb = class extends WebPlugin {
	constructor() {
		super();
		this._lastWindow = null;
	}
	async open(options) {
		this._lastWindow = window.open(options.url, options.windowName || "_blank");
	}
	async close() {
		return new Promise((resolve, reject) => {
			if (this._lastWindow != null) {
				this._lastWindow.close();
				this._lastWindow = null;
				resolve();
			} else reject("No active window to close!");
		});
	}
};
new BrowserWeb();
//#endregion
export { BrowserWeb };
