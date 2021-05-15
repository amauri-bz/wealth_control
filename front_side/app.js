//Initialize the client side comunication object
const client = window.require("./front_side/client");
const utils = window.require("./utils/utils");

function init_tables() {
  current_date = document.getElementById("global_date").value;
  client.send({ msg: "get_data", type: "acoes", date: current_date });
  client.send({ msg: "get_data", type: "fiis", date: current_date });
  client.send({ msg: "get_data", type: "stocks", date: current_date });
  client.send({ msg: "get_data", type: "td", date: current_date });
  client.send({ msg: "get_data", type: "poup", date: current_date });
  client.send({ msg: "get_data", type: "cc", date: current_date });
  client.send({ msg: "get_data", type: "provento", date: current_date });
}

function load() {
  document.getElementById("global_date").value = utils.set_date();

  init_tables();

  var global_date = document.getElementById("global_date");
  global_date.addEventListener("change", init_tables, false);
}

document.addEventListener("DOMContentLoaded", load, false);
