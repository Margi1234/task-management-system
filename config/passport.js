const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mysql = require("mysql");
// const mongoose = require("mongoose");
// const User = mongoose.model("users");
const keys = require("../config/keys");
var conn = mysql.createConnection({
  user: "root",
  password: "",
  database: "authentication",
  host: "localhost",
});

conn.connect(function (err) {
  if (err) throw err;
  // console.log("Connected to Database!");
});
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;
console.log("in passport js");
module.exports = (passport) => {
  console.log("in passport function");
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      console.log("in passport strategy");
      console.log("jwt id is ", jwt_payload.id);
      conn
        .query(
          "SELECT * FROM users where email=?",
          jwt_payload.email,
          function (error, results, fields) {
            var count = results.length;
            if (count > 0) {
              user = {
                name: JSON.parse(JSON.stringify(results[0])).name,
                email: JSON.parse(JSON.stringify(results[0])).email,
              };
              return done(null, user);
            } else {
              return done(null, false);
            }
          }
        )
        .catch((err) => console.log(err));
    })
  );
};
