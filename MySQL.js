var mysql = require('mysql');
require("dotenv").config();

var con = mysql.createConnection({
  host: "locathost",
  user: "spamcajg_pbcl",
  password: "AtpGyMl196n6",
  database: "spamcajg_pbcl"
});

con.connect(function(err) {
  if (err) console.log(err);
  else console.log("Connected!");
});

module.exports = class MySQL {

    static getConnection(){
        return con;
    }

}

function test(varToStore){
  const test2 = varToStore;
}

