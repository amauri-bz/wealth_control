const { app, BrowserWindow, Menu } = require("electron");
const server = require("./back_side/server");

var win;

//Create  a new window
function createWindow() {
  win = new BrowserWindow({
    width: 1500,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  var menu = Menu.buildFromTemplate([
    {
      label: "Menu",
      submenu: [
        {
          label: "Carteira",
          click() {
            win.loadFile("index.html");
          },
        },
        {
          label: "Importar",
          click() {
            win.loadFile("import.html");
          },
        },
        { type: "separator" },
        {
          label: "Sair",
          click() {
            app.quit();
          },
        },
      ],
    },
    {
      label: "Dev",
      submenu: [
        {
          label: "DevTools",
          accelerator: "Ctrl+Shift+I",
          click() {
            win.webContents.toggleDevTools();
          },
        },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);

  win.loadFile("index.html");
  server.set_windows(win);
}

//activate the new window
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
//Window destructor
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
