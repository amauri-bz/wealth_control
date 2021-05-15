const electron = window.require("electron");
const { ipcRenderer } = electron;

var import_type = "";
var data = [];

function tab_ctrl(id, type) {
  import_type = type;
  let Text = document.getElementById(id).innerHTML;
  document.getElementById("import_show").innerHTML = "Importar " + Text + ":";
}
tab_ctrl("import_acoes", "acoes");

function set_date() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + "-" + mm;
  return today;
}

function generateTableHead(table, data) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let key of data) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

function generateTable(table, data) {
  for (let element of data) {
    let row = table.insertRow();
    for (let key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
}

function valid_stocks(lines) {
  let data = [];

  for (item of lines) {
    let values = item.split("\t");

    if (values.length <= 1) continue;

    var regex = /^([a-zA-Z0-9]+)/;
    var match = regex.exec(values[0]);

    let valor = values[4].replace(".", "");
    valor = valor.replace(",", ".");

    data.push({
      data: document.getElementById("global_date").value,
      nome: match[1],
      quantidade: values[1],
      valor: valor,
    });
  }
  return data;
}

function valid_td(lines) {
  let data = [];

  for (item of lines) {
    let values = item.split("\t");

    if (values.length <= 1) continue;

    let valor = values[5].split(" ")[1];
    valor = valor.replace(".", "");
    valor = valor.replace(",", ".");

    data.push({
      data: document.getElementById("global_date").value,
      nome: values[1],
      quantidade: "0",
      valor: valor,
    });
  }
  return data;
}

function valid_proventos(lines) {
  let data = [];

  for (item of lines) {
    let values = item.split("\t");

    if (values.length <= 1) continue;

    let valor = values[6].split(" ")[1];
    valor = valor.replace(".", "");
    valor = valor.replace(",", ".");

    let data_item = data.find((element) => element.nome === values[1]);

    if (data_item === undefined) {
      data.push({
        data: document.getElementById("global_date").value,
        nome: values[1],
        quantidade: "0",
        valor: valor,
      });
    } else {
      let value1 = parseFloat(valor);
      let value2 = parseFloat(data_item.valor);
      data_item.valor = (value1 + value2).toFixed(2).toString();
    }
  }
  return data;
}

function import_valid() {
  import_reset();
  let lines = document.getElementById("import_text").value.split(/\n/);

  gdata = []; //global data array

  if (import_type === "td") {
    gdata = valid_td(lines);
  } else if (import_type === "provento") {
    gdata = valid_proventos(lines);
  } else {
    gdata = valid_stocks(lines);
  }

  if (gdata.length == 0) return;

  let table = document.getElementById("import_table");
  generateTableHead(table, Object.keys(gdata[0]));
  generateTable(table, gdata);
}

function import_add() {
  if (gdata.length == 0) return;

  import_clear();
  import_reset();

  let msg = {
    msg: "add_row",
    type: import_type,
    data: [],
  };

  for (item of gdata) {
    msg.data.push({
      id: "",
      date: item.data,
      name: item.nome,
      num: item.quantidade,
      val: item.valor,
    });
  }
  send(msg);
}

function send(msg) {
  console.log("Cliente1: ", msg);
  if (msg.msg === "add_row") {
    return new Promise((resolve) => {
      ipcRenderer.once("add_row_reply", (_, arg) => {
        console.log("add_row_reply", arg);
        let get_msg = {
          msg: "get_data",
          date: document.getElementById("global_date").value,
          type: arg.type,
        };
        ipcRenderer.send("async-message", get_msg);
      });
      ipcRenderer.send("async-message", msg);
    });
  }
  return false;
}

ipcRenderer.on("get_carteira", (event, msg) => {
  alert("Carteira atualizada!");
});

function import_reset() {
  document.getElementById("import_table").innerHTML = "";
}

function import_clear() {
  document.getElementById("import_text").value = "";
}

function load() {
  document.getElementById("global_date").value = set_date();

  var valid = document.getElementById("import_valid");
  valid.addEventListener("click", import_valid, false);

  var clear = document.getElementById("import_clear");
  clear.addEventListener("click", import_clear, false);

  var imp = document.getElementById("import_add");
  imp.addEventListener("click", import_add, false);
}

document.addEventListener("DOMContentLoaded", load, false);
