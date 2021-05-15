const base = window.require("./front_side/base");

class Poup extends base.Base {
  constructor() {
    super();

    this.charts = [
      {
        name: "pie_chart_poup",
        chart: new Chart(
          document.getElementById("pie_chart_poup").getContext("2d"),
          {
            type: "pie",
            data: { labels: [], datasets: [{ backgroundColor: [], data: [] }] },
          }
        ),
      },
    ];

    let add_poup = document.getElementById("add_poup");
    add_poup.addEventListener("click", super.add_entry, false);

    let clear_poup = document.getElementById("clear_poup");
    clear_poup.addEventListener("click", super.edit_clear, false);
  }

  chart_update(elements) {
    for (let key in this.charts) {
      if (this.charts[key].name.search(elements.type) > 0) {
        super.pie_update(this.charts[key].chart, elements);
      }
    }
  }

  chart_update_historic(elements) {}

  clear_table(arg) {
    super.clear_table(arg);
  }

  refresh_table(arg) {
    super.refresh_table(arg, ["id", "quantidade"]);
  }

  edit_entry(arg) {
    super.edit_entry(arg);
  }
}

exports.Poup = Poup;
