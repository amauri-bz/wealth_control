const fiis = window.require("./front_side/fiis");
const acoes = window.require("./front_side/acoes");
const stocks = window.require("./front_side/stocks");
const wallet = window.require("./front_side/wallet");
const td = window.require("./front_side/td");
const poup = window.require("./front_side/poup");
const cc = window.require("./front_side/cc");
const provento = window.require("./front_side/provento");

var fiis_obj = new fiis.Fiis();
var acoes_obj = new acoes.Acoes();
var stocks_obj = new stocks.Stocks();
var carteira_obj = new wallet.Wallet();
var td_obj = new td.TD();
var poup_obj = new poup.Poup();
var cc_obj = new cc.CC();
var provento_obj = new provento.Provento();

function factory(type) {
  switch (type) {
    case "fiis":
      return fiis_obj;
    case "acoes":
      return acoes_obj;
    case "carteira":
      return carteira_obj;
    case "stocks":
      return stocks_obj;
    case "td":
      return td_obj;
    case "poup":
      return poup_obj;
    case "cc":
      return cc_obj;
    case "provento":
      return provento_obj;
    default:
      console.log("Invalid Type");
  }
}

exports.factory = factory;
