const client = window.require("./front_side/client");
const utils = window.require("./utils/utils");

class Base {
  constructor() {
    this.charts = [];
  }

  generateTableHead(table, filter, btn, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
      if (filter.includes(key)) continue;
      let th = document.createElement("th");
      let text = document.createTextNode(key);
      th.appendChild(text);
      row.appendChild(th);
    }
    if (btn.includes("edit")) row.appendChild(document.createElement("th"));
    if (btn.includes("delete")) row.appendChild(document.createElement("th"));
  }

  delete_row() {
    client.send({
      msg: "del_row",
      type: this.id.split("/")[0],
      id: this.id.split("/")[1],
    });
  }

  edit_row() {
    client.send({
      msg: "edit_row",
      type: this.id.split("/")[0],
      id: this.id.split("/")[1],
    });
  }

  generateTable(table, filter, btn, data) {
    for (let element of data) {
      let row = table.insertRow();
      for (let key in element) {
        if (filter.includes(key)) continue;
        let cell = row.insertCell();
        let text = document.createTextNode(element[key]);
        cell.appendChild(text);
      }

      if (btn.includes("edit")) {
        var btn2 = document.createElement("BUTTON");
        btn2.innerHTML = "Editar";
        btn2.className += "w3-button w3-block w3-teal";
        btn2.id = table.id + "/" + element.id;
        btn2.onclick = this.edit_row;
        let cell2 = row.insertCell();
        cell2.appendChild(btn2);
      }

      if (btn.includes("delete")) {
        var btn3 = document.createElement("BUTTON");
        btn3.innerHTML = "Apagar";
        btn3.className += "w3-button w3-block w3-teal";
        btn3.id = table.id + "/" + element.id;
        btn3.onclick = this.delete_row;
        let cell3 = row.insertCell();
        cell3.appendChild(btn3);
      }
    }
  }

  clear_table(arg) {
    document.getElementById(arg.type).innerHTML = "";
  }

  refresh_table(arg, filter = ["id"], btn = ["edit", "delete"]) {
    let table = document.getElementById(arg.type);
    console.log("refresh_table:" + table.id);

    this.clear_table(arg);
    if (arg.data.length) {
      this.generateTableHead(table, filter, btn, Object.keys(arg.data[0]));
      this.generateTable(table, filter, btn, arg.data);
    }
  }

  pie_update(chart, elements) {
    chart.data.datasets.pop();
    chart.update();

    if (chart.data.length == 0) return;

    let labels = [];
    const newDataset = {
      backgroundColor: [],
      data: [],
    };

    let counter = 0;
    for (let key in elements.data) {
      labels.push(elements.data[key].codigo);
      let num_value = parseFloat(elements.data[key].valor);
      newDataset.data.push(num_value.toFixed(2).toString());
      newDataset.backgroundColor.push(utils.colorScheme[counter]);
      counter++;
    }
    chart.data.datasets.push(newDataset);
    chart.data.labels = labels;
    chart.update();
  }

  chart_update(elements) {
    for (let key in this.charts) {
      if (this.charts[key].name.search(elements.type) > 0) {
        this.pie_update(this.charts[key].chart, elements);
      }
    }
  }

  add_entry() {
    type = this.id.split("_")[1];

    let id = document.getElementById("id_" + type);
    let date = document.getElementById("global_date");
    let name = document.getElementById("name_" + type);
    let num = document.getElementById("num_" + type);
    let val = document.getElementById("val_" + type);

    if (name.value != "" && val.value != "") {
      client.send({
        msg: "add_row",
        type: type,
        data: [
          {
            id: id.value,
            date: date.value,
            name: name.value,
            num: num.value,
            val: val.value,
          },
        ],
      });
    }
    id.value = "";
    name.value = "";
    num.value = "";
    val.value = "";
  }

  edit_clear() {
    type = this.id.split("_")[1];
    document.getElementById("id_" + type).value = "";
    document.getElementById("name_" + type).value = "";
    document.getElementById("num_" + type).value = "";
    document.getElementById("val_" + type).value = "";
  }

  edit_entry(arg) {
    document.getElementById("id_" + arg.type).value = arg.data[0].id;
    document.getElementById("name_" + arg.type).value = arg.data[0].codigo;
    document.getElementById("num_" + arg.type).value = arg.data[0].quantidade;
    document.getElementById("val_" + arg.type).value = arg.data[0].valor;
  }
}

exports.Base = Base;
