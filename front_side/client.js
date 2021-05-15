const electron = window.require("electron");
const { ipcRenderer } = electron;

const factory = window.require("./front_side/factory");

function send(msg) {
  console.log("Cliente: ", msg);

  if (msg.msg === "get_data") {
    return new Promise((resolve) => {
      ipcRenderer.once("get_" + msg.type + "_reply", (_, arg) => {
        object = factory.factory(msg.type);

        console.log("get_data:", arg);

        if (Object.keys(arg).length) {
          object.refresh_table(arg);
          object.chart_update(arg);
        } else {
          object.clear_table(arg);
        }
      });
      ipcRenderer.send("async-message", msg);
    });
  } else if (msg.msg === "get_data_all") {
    return new Promise((resolve) => {
      ipcRenderer.once("get_all_" + msg.type + "_reply", (_, arg) => {
        object = factory.factory(msg.type);

        if (Object.keys(arg).length) {
          console.log("get_data_all:", arg);
          object.chart_update_historic(arg);
        }
      });
      ipcRenderer.send("async-message", msg);
    });
  } else if (msg.msg === "del_row") {
    return new Promise((resolve) => {
      ipcRenderer.once("del_row_reply", (_, arg) => {
        arg.msg = "get_data";
        arg.date = document.getElementById("global_date").value;
        send(arg);
      });
      ipcRenderer.send("async-message", msg);
    });
  } else if (msg.msg === "add_row") {
    return new Promise((resolve) => {
      ipcRenderer.once("add_row_reply", (_, arg) => {
        arg.msg = "get_data";
        arg.date = document.getElementById("global_date").value;
        send(arg);
      });
      ipcRenderer.send("async-message", msg);
    });
  } else if (msg.msg === "edit_row") {
    return new Promise((resolve) => {
      ipcRenderer.once("edit_row_reply", (_, arg) => {
        object = factory.factory(msg.type);
        object.edit_entry(arg);
      });
      ipcRenderer.send("async-message", msg);
    });
  }
  return false;
}

ipcRenderer.on("get_carteira", (event, msg) => {
  console.log("Carteira is ready!");

  if (msg.type === "carteira") {
    current_date = document.getElementById("global_date").value;
    send({ msg: "get_data", type: "carteira", date: current_date });
    send({ msg: "get_data_all", type: "carteira" });
  }
});

exports.send = send;
