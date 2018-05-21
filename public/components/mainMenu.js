const { dialog } = require('electron');

const openDialogOptions = {
  buttonLabel: 'Open',
  nameFieldLabel: 'Open:',
  defaultPath: 'Protocol.netcanvas',
  filters: [{ name: 'Network Canvas', extensions: ['netcanvas'] }],
  properties: ['openFile'],
};

const openDialog = () =>
  new Promise((resolve, reject) => {
    dialog.showOpenDialog(openDialogOptions, (filename) => {
      if (filename === undefined) { reject(); return; }
      resolve(filename[0]);
    });
  });

const openFile = window =>
  () =>
    openDialog()
      .then(filePath => window.webContents.send('OPEN_FILE', filePath));

const MenuTemplate = (window) => {
  const menu = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open...',
          click: openFile(window),
        },
      ],
    },
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
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
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

  if (process.platform !== 'darwin') {
    // Get rid of the macOS primary menu
    menu[0].submenu.push({ role: 'quit' });
  } else {
    menu.unshift({
      submenu: [
        { role: 'quit' },
      ],
    });
  }

  return menu;
};

module.exports = MenuTemplate;
