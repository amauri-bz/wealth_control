const colorScheme = [
  "#25CCF7",
  "#FD7272",
  "#54a0ff",
  "#00d2d3",
  "#1abc9c",
  "#2ecc71",
  "#3498db",
  "#9b59b6",
  "#34495e",
  "#16a085",
  "#27ae60",
  "#2980b9",
  "#8e44ad",
  "#2c3e50",
  "#f1c40f",
  "#e67e22",
  "#e74c3c",
  "#ecf0f1",
  "#95a5a6",
  "#f39c12",
  "#d35400",
  "#c0392b",
  "#bdc3c7",
  "#7f8c8d",
  "#55efc4",
  "#81ecec",
  "#74b9ff",
  "#a29bfe",
  "#dfe6e9",
  "#00b894",
  "#00cec9",
  "#0984e3",
  "#6c5ce7",
  "#ffeaa7",
  "#fab1a0",
  "#ff7675",
  "#fd79a8",
  "#fdcb6e",
  "#e17055",
  "#d63031",
  "#feca57",
  "#5f27cd",
  "#54a0ff",
  "#01a3a4",
];

let charts = [
  {
    name: "pie_chart_acoes",
    chart: new Chart(
      document.getElementById("pie_chart_acoes").getContext("2d"),
      {
        type: "pie",
        data: { labels: [], datasets: [{ backgroundColor: [], data: [] }] },
      }
    ),
  },
  {
    name: "pie_chart_carteira",
    chart: new Chart(
      document.getElementById("pie_chart_carteira").getContext("2d"),
      {
        type: "pie",
        data: { labels: [], datasets: [{ backgroundColor: [], data: [] }] },
      }
    ),
  },
  {
    name: "pie_chart_fiis",
    chart: new Chart(
      document.getElementById("pie_chart_fiis").getContext("2d"),
      {
        type: "pie",
        data: { labels: [], datasets: [{ backgroundColor: [], data: [] }] },
      }
    ),
  },
];

function pie_update(chart, elements) {
  chart.data.datasets.pop();
  chart.update();

  if (chart.data.length == 0) return;

  labels = [];
  const newDataset = {
    backgroundColor: [],
    data: [],
  };

  let counter = 0;
  for (key in elements.data) {
    labels.push(elements.data[key].codigo);
    newDataset.data.push(elements.data[key].valor);
    newDataset.backgroundColor.push(colorScheme[counter]);
    counter++;
  }
  chart.data.datasets.push(newDataset);
  chart.data.labels = labels;
  chart.update();
}

function pie_wallet_update(chart, elements) {
  chart.data.datasets.pop();
  chart.update();

  if (chart.data.length == 0) return;

  labels = [];
  const newDataset = {
    backgroundColor: [],
    data: [],
  };

  let counter = 0;
  for (key in elements.data) {
    labels.push("acoes");
    newDataset.data.push(elements.data[key].acoes);
    newDataset.backgroundColor.push(colorScheme[counter]);
    counter++;
    labels.push("fiis");
    newDataset.data.push(elements.data[key].fiis);
    newDataset.backgroundColor.push(colorScheme[counter]);
  }
  chart.data.datasets.push(newDataset);
  chart.data.labels = labels;
  chart.update();
}

function chart_update(elements) {
  for (key in charts) {
    if (charts[key].name.search(elements.type) > 0) {
      if (elements.type === "carteira")
        pie_wallet_update(charts[key].chart, elements);
      else pie_update(charts[key].chart, elements);
    }
  }
}

exports.chart_update = chart_update;
