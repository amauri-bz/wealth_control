const { ipcMain } = require("electron");
const database = require("./database");

var win;

ipcMain.on("async-message", (event, arg) => {
  console.log("Server:", arg);

  if (arg.msg === "get_data")
    database.get_elements(event, arg, function (event, data) {
      event.reply("get_" + arg.type + "_reply", data);
    });
  if (arg.msg === "get_data_all")
    database.get_elements(event, arg, function (event, data) {
      event.reply("get_all_" + arg.type + "_reply", data);
    });
  else if (arg.msg === "del_row")
    database.delete_item_by_id(event, arg, function (event, arg) {
      event.reply("del_row_reply", arg);
    });
  else if (arg.msg === "add_row") {
    if (arg.data[0].id === "")
      database.create_item(event, arg, function (event, arg) {
        event.reply("add_row_reply", arg);
      });
    else
      database.update_item(event, arg, function (event, arg) {
        event.reply("add_row_reply", arg);
      });
  } else if (arg.msg === "edit_row")
    database.get_element_by_id(event, arg, function (event, arg) {
      event.reply("edit_row_reply", arg);
    });
  else event.reply("async-reply", "");
});

function assync_comunic(arg) {
  win.webContents.send("get_carteira", arg);
}

function set_windows(arg) {
  win = arg;
}

exports.assync_comunic = assync_comunic;
exports.set_windows = set_windows;
