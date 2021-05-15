var sqlite3 = require("sqlite3").verbose();
var fs = require("fs");
fs.writeFile("db.log", "", () => {});

const server = require("./server");

function DEBUG(data) {
  fs.appendFileSync("db.log", data.toString() + "\n");
}

function init_db() {
  var db = new sqlite3.Database("mydb.db");
  db.serialize(function () {
    db.run(
      "CREATE TABLE if not exists carteira (data TEXT, acoes TEXT, fiis TEXT, stocks TEXT, td TEXT, poup TEXT, cc TEXT, provento TEXT)"
    );
    db.run(
      "CREATE TABLE if not exists fiis (data TEXT, codigo TEXT, quantidade TEXT, valor TEXT)"
    );
    db.run(
      "CREATE TABLE if not exists acoes (data TEXT, codigo TEXT, quantidade TEXT, valor TEXT)"
    );
    db.run(
      "CREATE TABLE if not exists stocks (data TEXT, codigo TEXT, quantidade TEXT, valor TEXT)"
    );
    db.run(
      "CREATE TABLE if not exists td (data TEXT, codigo TEXT, quantidade TEXT, valor TEXT)"
    );
    db.run(
      "CREATE TABLE if not exists poup (data TEXT, codigo TEXT, quantidade TEXT, valor TEXT)"
    );
    db.run(
      "CREATE TABLE if not exists cc (data TEXT, codigo TEXT, quantidade TEXT, valor TEXT)"
    );
    db.run(
      "CREATE TABLE if not exists provento (data TEXT, codigo TEXT, quantidade TEXT, valor TEXT)"
    );
    db.close();
  });
}
init_db();

function update_wallet(arg) {
  if (arg.type === "carteira" || arg.data.length == 0) return;

  var db = new sqlite3.Database("mydb.db");
  db.serialize(function () {
    let total = 0;
    for (key in arg.data) {
      total += parseFloat(arg.data[key].valor);
    }

    db.all(
      "SELECT * FROM carteira WHERE data = '" + arg.date + "'",
      (err, row) => {
        if (err) return console.log(err);

        if (row.length == 0) {
          var stmt = db.prepare(
            "INSERT INTO carteira (data, " + arg.type + ") VALUES(?, ?)"
          );
          DEBUG(["INSERT INTO carteira", arg.type, arg.date, total.toFixed(2)]);
          stmt.run(arg.date, total.toFixed(2));
          stmt.finalize(function () {
            if (err) return console.log(err);
            db.close();
            server.assync_comunic({ msg: "get_data", type: "carteira" });
          });
        } else {
          db.run(
            "UPDATE carteira" +
              " SET " +
              arg.type +
              "='" +
              total.toFixed(2) +
              "'" +
              " WHERE data='" +
              arg.date +
              "'",
            function (err) {
              if (err) return console.log(err);
              DEBUG([
                "UPDATE INTO carteira",
                arg.type,
                arg.date,
                total.toFixed(2),
              ]);
              db.close();
              server.assync_comunic({ msg: "get_data", type: "carteira" });
            }
          );
        }
      }
    );
  });
}

function create_item(event, arg, callback) {
  let elements = [];

  for (item of arg.data) {
    elements.push({
      data: item.date,
      codigo: item.name,
      quantidade: item.num,
      valor: item.val,
    });
  }

  var db = new sqlite3.Database("mydb.db");
  db.serialize(function () {
    var stmt = db.prepare("INSERT INTO " + arg.type + " VALUES(?,?,?,?)");
    for (key in elements) {
      stmt.run(
        elements[key].data.toUpperCase(),
        elements[key].codigo.toUpperCase(),
        elements[key].quantidade.toUpperCase(),
        elements[key].valor.toUpperCase()
      );
    }
    stmt.finalize(function () {
      db.close();
      callback(event, arg);
    });
  });
}

function update_item(event, arg, callback) {
  var db = new sqlite3.Database("mydb.db");
  db.serialize(function () {
    db.run(
      "UPDATE " +
        arg.type +
        " SET data='" +
        arg.data[0].date +
        "'," +
        " codigo='" +
        arg.data[0].name +
        "'," +
        " quantidade='" +
        arg.data[0].num +
        "'," +
        " valor='" +
        arg.data[0].val +
        "'" +
        " WHERE rowid=" +
        arg.data[0].id,
      function (err) {
        if (err) return console.log(err);
        db.close();
        callback(event, arg);
      }
    );
  });
}

function delete_item_by_id(event, arg, callback) {
  var db = new sqlite3.Database("mydb.db");
  db.serialize(function () {
    db.run(
      "DELETE FROM " + arg.type + " WHERE rowid=" + arg.id,
      function (err) {
        if (err) return console.log(err);
        db.close();
        callback(event, arg);
      }
    );
  });
}

function get_elements(event, arg, callback) {
  var db = new sqlite3.Database("mydb.db");
  db.serialize(function () {
    sql = "SELECT rowid AS id, * FROM  " + arg.type + " ORDER BY data";
    if (arg.date != undefined)
      sql =
        "SELECT rowid AS id, * FROM  " +
        arg.type +
        " WHERE data='" +
        arg.date +
        "'";

    db.all(sql, (err, rows) => {
      if (err) return console.log(err);
      ret = {
        type: arg.type,
        date: arg.date,
        data: rows,
      };

      db.close();
      callback(event, ret);
      if (arg.date != undefined) {
        //console.log(ret);
        update_wallet(ret);
      }
    });
  });
}

function get_element_by_id(event, arg, callback) {
  var db = new sqlite3.Database("mydb.db");
  db.serialize(function () {
    db.all(
      "SELECT rowid AS id, * FROM  " + arg.type + " WHERE rowid=" + arg.id,
      (error, rows) => {
        ret = {
          type: arg.type,
          data: rows,
        };
        //console.log(ret);
        db.close();
        callback(event, ret);
      }
    );
  });
}

exports.create_item = create_item;
exports.get_elements = get_elements;
exports.delete_item_by_id = delete_item_by_id;
exports.get_element_by_id = get_element_by_id;
exports.update_item = update_item;
