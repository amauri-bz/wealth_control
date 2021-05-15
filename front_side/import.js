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

function import_clear() {
  document.getElementById("import_text").value = "";
}

function valid_stocks(lines) {
  let data = [];

  for (item of lines) {
    let values = item.split("\t");

    if (values.length == 0) continue;

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

    if (values.length == 0) continue;

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

    if (values.length == 0) continue;

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

  data = []; //global data array

  if (import_type === "td") {
    data = valid_td(lines);
  } else if (import_type === "provento") {
    data = valid_proventos(lines);
  } else {
    data = valid_stocks(lines);
  }

  let table = document.getElementById("import_table");
  generateTableHead(table, Object.keys(data[0]));
  generateTable(table, data);
}

function import_import() {
  import_clear();
  import_reset();

  let msg = {
    msg: "add_row",
    type: import_type,
    data: [],
  };

  for (item of data) {
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
  console.log("Cliente: ", msg);
  ipcRenderer.send("async-message", msg);
  return false;
}

function import_reset() {
  document.getElementById("import_table").innerHTML = "";
}

function load() {
  document.getElementById("global_date").value = set_date();

  var valid = document.getElementById("import_valid");
  valid.addEventListener("click", import_valid, false);

  var clear = document.getElementById("import_clear");
  clear.addEventListener("click", import_clear, false);

  var imp = document.getElementById("import");
  imp.addEventListener("click", import_import, false);
}

document.addEventListener("DOMContentLoaded", load, false);
