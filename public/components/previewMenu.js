const { dispatch, actionCreators } = require('./actions');

let settings = {
  width: 1024,
  height: 768,
  scale: 1,
};

const setSize = (window, options) => {
  // TODO: Be clever and get screen size?
  const scale = options.scale || settings.scale;
  const width = options.width || settings.width;
  const height = options.height || settings.height;

  const adjustedWidth = Math.floor(width * scale);
  const adjustedHeight = Math.floor(height * scale);

  dispatch(window.webContents, actionCreators.setInterfaceScale(scale));
  window.setContentSize(adjustedWidth, adjustedHeight);


  settings = {
    ...settings,
    width,
    height,
    scale,
  };
};

const getPreviewMenu = (window) => {
  const menu = [
    {
      label: 'Device',
      submenu: [
        {
          label: 'iPad (1024x768)',
          click: () => { setSize(window, { width: 1024, height: 768 }); },
        },
        {
          label: 'iPad Pro (1336x1024)',
          click: () => { setSize(window, { width: 1336, height: 1024 }); },
        },
        {
          label: 'Pixel C (1280x900)',
          click: () => { setSize(window, { width: 1280, height: 900 }); },
        },
        {
          label: 'Chromebook (1280x800)',
          click: () => { setSize(window, { width: 1280, height: 800 }); },
        },
        {
          label: 'Microsoft Surface Device',
          click: () => { setSize(window, { width: 1500, height: 1000 }); },
        },
        {
          label: 'Apple Laptop (1440x900)',
          click: () => { setSize(window, { width: 1440, height: 900 }); },
        },
        {
          label: 'Widescreen laptop (1280x720)',
          click: () => { setSize(window, { width: 1280, height: 720 }); },
        },
      ],
    },
    {
      label: 'Scale',
      submenu: [
        {
          label: '0.25 x',
          click: () => { setSize(window, { scale: 0.25 }); },
        },
        {
          label: '0.5 x',
          click: () => { setSize(window, { scale: 0.5 }); },
        },
        {
          label: '0.75 x',
          click: () => { setSize(window, { scale: 0.75 }); },
        },
        {
          label: '1 x',
          click: () => { setSize(window, { scale: 1 }); },
        },
        {
          label: '1.25 x',
          click: () => { setSize(window, { scale: 1.25 }); },
        },
        {
          label: '1.5 x',
          click: () => { setSize(window, { scale: 1.5 }); },
        },
      ],
    },
    {
      label: 'Develop',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
      ],
    },
  ];

  const appMenu = [
    {
      label: 'Refresh',
      click: () => {
        dispatch(window.webContents, actionCreators.refreshPreview());
      },
    },
    {
      label: 'Close',
      click: () => { window.hide(); },
    },
  ];

  if (process.platform !== 'darwin') {
    // Use File> menu for Windows
    menu[0].submenu.concat(appMenu);
  } else {
    // Use "App" menu for OS X
    menu.unshift({
      submenu: appMenu,
      label: 'App',
    });
  }

  return menu;
};

module.exports = getPreviewMenu;
