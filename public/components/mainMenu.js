const MenuTemplate = (options) => {
	const fileMenu = {
		label: "File",
		submenu: [
			{
				label: "Open...",
				click: options.open,
				accelerator: "CommandOrControl+O",
			},
		],
	};

	if (options.isProtocolOpen) {
		fileMenu.submenu.push({
			label: "Save",
			enabled: options.isProtocolValid && options.hasChanges,
			click: options.save,
			accelerator: "CommandOrControl+S",
		});
		fileMenu.submenu.push({
			label: "Save as...",
			accelerator: "CommandOrControl+Shift+S",
			enabled: options.isProtocolValid,
			click: options.saveCopy,
		});
		fileMenu.submenu.push({
			label: "Print protocol summary...",
			accelerator: "CommandOrControl+P",
			enabled: options.isProtocolValid,
			click: options.printSummary,
		});
	}

	const menu = [
		fileMenu,
		{
			label: "Edit",
			submenu: [
				{ role: "undo" },
				{ role: "redo" },
				{ type: "separator" },
				{ role: "cut" },
				{ role: "copy" },
				{ role: "paste" },
				{ type: "separator" },
				{ role: "selectall" },
			],
		},
		{
			label: "View",
			submenu: [
				{ role: "resetzoom" },
				{ role: "zoomin" },
				{ role: "zoomout" },
				{ type: "separator" },
				{ role: "togglefullscreen" },
			],
		},
		{
			label: "Develop",
			submenu: [
				{ role: "reload" },
				{ role: "forcereload" },
				{ role: "toggledevtools" },
				{ type: "separator" },
				{
					label: "Clear storage data",
					click: options.clearStorageData,
				},
			],
		},
		{
			role: "window",
			submenu: [{ role: "minimize" }, { role: "close" }],
		},
	];

	const appMenu = [{ role: "quit" }];

	if (process.platform !== "darwin") {
		// Use File> menu for Windows
		menu[0].submenu.concat(appMenu);
	} else {
		// Use "App" menu for OS X
		menu.unshift({
			label: "App",
			submenu: appMenu,
		});
	}

	return menu;
};

module.exports = MenuTemplate;
