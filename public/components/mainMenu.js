const MenuTemplate = (options) => {
  const fileMenu = {
    label: 'File',
    submenu: [
      {
        label: 'Open...',
        click: options.openFile,
      },
    ],
  };

  if (options.isProtocolOpen) {
    fileMenu.submenu.push({
      label: 'Save',
      click: options.save,
    });
    fileMenu.submenu.push({
      label: 'Save a copy...',
      click: options.saveCopy,
    });
  }

  const menu = [
    fileMenu,
    {
      label: 'Edit',
      submenu: [
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { type: 'separator' },
        { role: 'selectall' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Develop',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        {
          label: 'Clear storage data',
          click: options.clearStorageData,
        },
      ],
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' },
      ],
    },
  ];

  const appMenu = [
    {
      label: 'Check for updates...',
      click: options.checkForUpdates,
    },
    { role: 'quit' },
  ];

  if (process.platform !== 'darwin') {
    // Use File> menu for Windows
    menu[0].submenu.concat(appMenu);
  } else {
    // Use "App" menu for OS X
    menu.unshift({
      label: 'App',
      submenu: appMenu,
    });
  }

  return menu;
};

module.exports = MenuTemplate;
