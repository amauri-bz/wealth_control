const client = window.require("./front_side/client");
const utils = window.require("./utils/utils");

class Wallet {
  constructor() {
    this.charts = [
      {
        name: "pie_chart_carteira",
        type: "monthly",
        chart: new Chart(
          document.getElementById("pie_chart_carteira").getContext("2d"),
          {
            type: "pie",
          }
        ),
      },
      {
        name: "line_chart_carteira",
        type: "historic",
        chart: new Chart(
          document.getElementById("line_chart_carteira").getContext("2d"),
          {
            type: "line",
          }
        ),
      },
      {
        name: "line_provento_carteira",
        type: "provento",
        chart: new Chart(
          document.getElementById("line_provento_carteira").getContext("2d"),
          {
            type: "bar",
          }
        ),
      },
    ];
  }

  generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
      if (key === "id") continue;
      let th = document.createElement("th");
      let text = document.createTextNode(key);
      th.appendChild(text);
      row.appendChild(th);
    }
    let th_total = document.createElement("th");
    let text_total = document.createTextNode("total");
    th_total.appendChild(text_total);
    row.appendChild(th_total);
  }

  generateTable(table, data) {
    let total_val = 0;
    for (let element of data) {
      let row = table.insertRow();
      for (let key in element) {
        if (key === "id") continue;
        let cell = row.insertCell();
        let value = element[key] != "null" ? element[key] : "0";
        let num_value = parseFloat(value);
        let text = document.createTextNode(num_value.toFixed(2).toString());
        cell.appendChild(text);

        if (key === "data" || key === "provento") continue;
        total_val += parseFloat(value);
      }
      let text_total = document.createTextNode(total_val.toFixed(2).toString());
      let cell_total = row.insertCell();
      cell_total.appendChild(text_total);
    }
  }

  clear_table(arg) {
    document.getElementById(arg.type).innerHTML = "";
  }

  refresh_table(arg) {
    let table = document.getElementById(arg.type);

    this.clear_table(arg);
    if (arg.data.length) {
      this.generateTableHead(table, Object.keys(arg.data[0]));
      this.generateTable(table, arg.data);
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
      labels.push("acoes");
      newDataset.data.push(elements.data[key].acoes);
      newDataset.backgroundColor.push(utils.colorScheme[counter]);
      counter++;
      labels.push("fiis");
      newDataset.data.push(elements.data[key].fiis);
      newDataset.backgroundColor.push(utils.colorScheme[counter]);
      counter++;
      labels.push("stocks");
      newDataset.data.push(elements.data[key].stocks);
      newDataset.backgroundColor.push(utils.colorScheme[counter]);
      counter++;
      labels.push("td");
      newDataset.data.push(elements.data[key].td);
      newDataset.backgroundColor.push(utils.colorScheme[counter]);
      counter++;
      labels.push("poup");
      newDataset.data.push(elements.data[key].poup);
      newDataset.backgroundColor.push(utils.colorScheme[counter]);
      counter++;
      labels.push("cc");
      newDataset.data.push(elements.data[key].cc);
      newDataset.backgroundColor.push(utils.colorScheme[counter]);
    }
    chart.data.datasets.push(newDataset);
    chart.data.labels = labels;
    chart.update();
  }

  line_update(chart, elements) {
    chart.data.datasets = [];

    if (elements.data.length == 0) return;

    //ACOES
    let counter = 0;
    let label = [];
    const newDataset = {
      backgroundColor: utils.colorScheme[counter],
      borderColor: utils.colorScheme[counter],
      label: "acoes",
      fill: false,
      data: [],
    };
    for (let key in elements.data) {
      newDataset.data.push(elements.data[key].acoes);
      label.push(elements.data[key].data);
    }
    chart.data.datasets.push(newDataset);
    chart.data.labels = label;

    //FIIS
    counter++;
    const newDataset2 = {
      backgroundColor: utils.colorScheme[counter],
      borderColor: utils.colorScheme[counter],
      label: "fiis",
      fill: false,
      data: [],
    };
    for (let key in elements.data) {
      newDataset2.data.push(elements.data[key].fiis);
    }
    chart.data.datasets.push(newDataset2);

    //CARTEIRA
    counter++;
    const newDataset3 = {
      backgroundColor: utils.colorScheme[counter],
      borderColor: utils.colorScheme[counter],
      label: "carteira",
      fill: false,
      data: [],
    };
    for (let key in elements.data) {
      let fiis_val = parseFloat(elements.data[key].fiis);
      let acoes_val = parseFloat(elements.data[key].acoes);
      let stocks_val = parseFloat(elements.data[key].stocks);
      let td_val = parseFloat(elements.data[key].td);
      let poup_val = parseFloat(elements.data[key].poup);
      let cc_val = parseFloat(elements.data[key].cc);

      let total =
        (isNaN(fiis_val) ? 0 : fiis_val.toFixed(2)) +
        (isNaN(acoes_val) ? 0 : acoes_val.toFixed(2)) +
        (isNaN(stocks_val) ? 0 : stocks_val.toFixed(2)) +
        (isNaN(td_val) ? 0 : td_val.toFixed(2)) +
        (isNaN(poup_val) ? 0 : poup_val.toFixed(2)) +
        (isNaN(cc_val) ? 0 : cc_val.toFixed(2));
      newDataset3.data.push(total.toString());
    }
    chart.data.datasets.push(newDataset3);

    //STOCKS
    counter++;
    const newDataset4 = {
      backgroundColor: utils.colorScheme[counter],
      borderColor: utils.colorScheme[counter],
      label: "stocks",
      fill: false,
      data: [],
    };
    for (let key in elements.data) {
      newDataset4.data.push(elements.data[key].stocks);
    }
    chart.data.datasets.push(newDataset4);

    //TD
    counter++;
    const newDataset5 = {
      backgroundColor: utils.colorScheme[counter],
      borderColor: utils.colorScheme[counter],
      label: "Tesouro D",
      fill: false,
      data: [],
    };
    for (let key in elements.data) {
      newDataset5.data.push(elements.data[key].td);
    }
    chart.data.datasets.push(newDataset5);

    //POUP
    counter++;
    const newDataset6 = {
      backgroundColor: utils.colorScheme[counter],
      borderColor: utils.colorScheme[counter],
      label: "Pupanca",
      fill: false,
      data: [],
    };
    for (let key in elements.data) {
      newDataset6.data.push(elements.data[key].poup);
    }
    chart.data.datasets.push(newDataset6);

    //CONTA CORRENTE
    counter++;
    const newDataset7 = {
      backgroundColor: utils.colorScheme[counter],
      borderColor: utils.colorScheme[counter],
      label: "Conta Corrente",
      fill: false,
      data: [],
    };
    for (let key in elements.data) {
      newDataset7.data.push(elements.data[key].cc);
    }
    chart.data.datasets.push(newDataset7);

    chart.update();
  }

  line_provento_update(chart, elements) {
    chart.data.datasets = [];

    if (elements.data.length == 0) return;

    //PROVENTO
    let counter = 0;
    let label = [];
    const ProvDataset = {
      backgroundColor: utils.colorScheme[counter],
      borderColor: utils.colorScheme[counter],
      label: "proventos",
      fill: false,
      data: [],
    };
    for (let key in elements.data) {
      let num_value = parseFloat(elements.data[key].provento);
      ProvDataset.data.push(num_value.toFixed(2).toString());
      label.push(elements.data[key].data);
    }
    chart.data.datasets.push(ProvDataset);
    chart.data.labels = label;

    chart.update();
  }

  chart_update_historic(elements) {
    if (elements.date == undefined) {
      for (let key in this.charts) {
        if (this.charts[key].type === "historic") {
          this.line_update(this.charts[key].chart, elements);
        } else if (this.charts[key].type === "provento") {
          this.line_provento_update(this.charts[key].chart, elements);
        }
      }
    }
  }

  chart_update(elements) {
    if (elements.date != undefined) {
      for (let key in this.charts) {
        if (this.charts[key].type === "monthly") {
          this.pie_update(this.charts[key].chart, elements);
        }
      }
    }
  }
}

exports.Wallet = Wallet;
