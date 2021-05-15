const client = window.require("./front_side/client");

function generateTableHead(table, data) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let key of data) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
  row.appendChild(document.createElement("th"));
  row.appendChild(document.createElement("th"));
}

function delete_row() {
  client.send({
    msg: "del_row",
    type: this.id.split("/")[0],
    id: this.id.split("/")[1],
  });
}

function edit_row() {
  //myFunction("show_"+this.id.split("/")[0]);
  client.send({
    msg: "edit_row",
    type: this.id.split("/")[0],
    id: this.id.split("/")[1],
  });
}

function generateTable(table, data) {
  for (let element of data) {
    let row = table.insertRow();
    for (key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }

    var btn2 = document.createElement("BUTTON");
    btn2.innerHTML = "Editar";
    btn2.className += "w3-button w3-block w3-teal";
    btn2.id = table.id + "/" + element.id;
    btn2.onclick = edit_row;
    let cell2 = row.insertCell();
    cell2.appendChild(btn2);

    var btn3 = document.createElement("BUTTON");
    btn3.innerHTML = "Apagar";
    btn3.className += "w3-button w3-block w3-teal";
    btn3.id = table.id + "/" + element.id;
    btn3.onclick = delete_row;
    let cell3 = row.insertCell();
    cell3.appendChild(btn3);
  }
}

function clear_table(arg) {
  document.getElementById(arg.type).innerHTML = "";
}

function refresh_table(arg) {
  let table = document.getElementById(arg.type);
  console.log("refresh_table:" + table.id);

  clear_table(arg);
  if (arg.data.length) {
    generateTableHead(table, Object.keys(arg.data[0]));
    generateTable(table, arg.data);
  }
}

exports.refresh_table = refresh_table;
exports.clear_table = clear_table;
