// import auth from "./auth";
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtsimple = require("jwt-simple");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const keys = require("../../config/keys");
var router = express.Router();
const passport = require("passport");
const passportJWT = require("passport-jwt");
const app = express();
// var auth = require("../../config/auth");
app.use(cors({ origin: "http//:localhost:3000" }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// Bodyparser middleware

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
var conn = mysql.createConnection({
  user: "root",
  password: "",
  database: "authentication",
  host: "localhost",
});

conn.connect(function (err) {
  if (err) throw err;
  console.log("Connected to Database!");
});
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "margi.pict16@sot.pdpu.ac.in",
    pass: "killercode",
  },
});

console.log("in users.js here");
router.get(
  "/auth/google",
  passport.authenticate(
    "google",
    { scope: ["https://www.googleapis.com/auth/plus.login"] },
    () => {
      console.log("in passport authenticate");
    }
  )
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  function (req, res) {
    console.log("here");
    var token = req.user.token;
    res.redirect("http://localhost:3000?token=" + token);
  }
);
router.post("/register", (req, res) => {
  console.log("in register route");
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    console.log(errors);
    return res.status(200).send({ error: true, message: errors });
  }
  let email = req.body.email;
  if (!email) {
    console.log("in not email bad request");
    return res
      .status(400)
      .send({ error: true, message: "Please provide email" });
  }
  //finding if the email is already registered or not
  conn.query("SELECT * FROM users where email=?", email, function (
    error,
    results,
    fields
  ) {
    if (error) throw error;
    else {
      var count = results.length;
      if (count > 0) {
        console.log("in email exists bad request");
        return res.status(200).json({
          result: results,
          count: count,
          error: true,
          email: "Email already exists",
        });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) throw err;
            else {
              console.log("in adding data condition");
              let email = req.body.email;
              let password = req.body.password;
              let hashpassword = hash;
              let name = req.body.name;
              var data = { email: email, password: hashpassword, name: name };
              conn.query("INSERT INTO users SET ? ", data, function (
                error,
                results,
                fields
              ) {
                if (error) throw error;
                return res.send({
                  error: false,
                  data: results,
                  message: "New user has been created successfully.",
                });
              });
            }
          });
        });
      }
    }
  });
});

router.post("/login", (req, res) => {
  console.log("in post login route");
  // localStorage.setItem(token, "1234");
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(200).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  var dbhash, nm;
  conn.query("SELECT * FROM users where email=?", email, function (
    error,
    results,
    fields
  ) {
    if (error) throw error;
    else {
      var count = results.length;
      if (count == 0) {
        return res.status(200).json({ error: true, email: "Email Not Found" });
      } else {
        dbhash = JSON.parse(JSON.stringify(results[0])).password;
        // console.log(results);
        // dbhash = results.password;
        console.log("db password is ", dbhash);
        bcrypt.compare(password, dbhash).then((result) => {
          // console.log("in decryption");
          console.log("req password", password);
          console.log("db pwd", dbhash);
          console.log(result);
          if (result) {
            console.log("correct user details");
            // User matched
            // Create JWT Payload
            const payload = {
              // id: user.id,
              name: JSON.parse(JSON.stringify(results[0])).name,
              email: JSON.parse(JSON.stringify(results[0])).email,
            };

            jwt.sign(
              payload,
              keys.secretOrKey,
              {
                expiresIn: 31556926,
              },
              (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token,
                });
              }
            );
          } else {
            return res
              .status(200)
              .json({ error: true, passwordincorrect: "Password Incorrect" });
          }
        });
      }
    }
  });
});
var passwordToken;
router.post("/passwordreset", function (req, res) {
  var email = req.body.email;
  if (email) {
    console.log("in password reset route ", email);
    var payload = {
      email: email,
    };
    passwordToken = jwtsimple.encode(payload, keys.secretOrKey);
    const mailOptions = {
      from: "margi.pict16@sot.pdpu.ac.in", // sender address
      to: email, // list of receivers
      subject: "Reset your Accume Partners Account Password", // Subject line
      html: `<p>We have received a password reset request from your account. If you
       have not issued a password reset request, you can safely ignore this mail, and your account will not be affected. <br />
      To reset your password, click the link below :
      <a href="http://localhost:3000/resetpassword/${passwordToken}">Click Here</a>
      </p>`, // plain text body
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) console.log(err);
      else console.log(info);
    });
    res.send(passwordToken);
  } else {
    console.log("email is missing");
  }
});
router.get("/user", function (req, res) {
  console.log("in user");
  res.send("hi");
});
router.get("/resetpassword", function (req, res) {
  console.log("in reset password token");
  var secret = keys.secretOrKey;
  // var payload = jwtsimple.decode(req.params.token, secret);
  // console.log("payload", payload);
  res.send("hello");
});
router.post("/setpassword", function (req, res) {
  console.log("after submitting reset password form in set password route");
  console.log(passwordToken);
  var payload = jwtsimple.decode(req.body.tkn, keys.secretOrKey);
  var payload2 = jwtsimple.decode(passwordToken, keys.secretOrKey);
  console.log(payload2);
  console.log("payload is ", payload.email);
  var email = payload.email;
  var hashpwd;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      hashpwd = hash;
      var sql = `UPDATE users SET password = "${hashpwd}" WHERE email ="${email}"`;
      console.log(sql);
      conn.query(sql, function (error, results, fields) {
        if (error) throw error;
        return res.send({
          error: false,
          data: results,
          message: "Password changed successfully.",
        });
      });
    });
  });
  data = { password: hashpwd, email: email };
});

router.post("/users/add", function (req, res) {
  let name = req.body.name;
  let email = req.body.email;
  let type = req.body.type;
  let status = req.body.status;
  var data = { name: name, email: email, type: type, status: status };
  conn.query("INSERT INTO adminusers SET ? ", data, function (
    error,
    results,
    fields
  ) {
    if (error) throw error;
    return res.send({
      error: false,
      data: results,
      message: "New admin user has been created successfully.",
    });
  });
});

router.get("/getAdminUserData", function (req, res) {
  conn.query("SELECT * FROM adminusers", function (error, results, fields) {
    if (error) throw error;
    else {
      // console.log(results);
      res.send(results);
    }
  });
});

router.delete("/deleteAdminUser", function (req, res) {
  var id = req.body.id;
  var data = { id: id };
  console.log(id);
  var sql = `DELETE FROM adminusers WHERE id=${id}`;
  conn.query(sql, function (error, results, fields) {
    if (error) throw error;
    else {
      console.log(results);
      res.send(results);
    }
  });
});
router.put("/updateUser", function (req, res) {
  console.log("in updating admin user");
  var id = req.body.id;
  var name = req.body.name;
  var email = req.body.email;
  var type = req.body.type;
  var status = req.body.status;
  var data = { name: name, email: email, type: type, status: status };
  console.log(data);
  var sql = `UPDATE adminusers SET name = "${name}", email = "${email}", type = "${type}",status = "${status}" WHERE id ="${id}"`;
  conn.query(sql, function (error, results, fields) {
    if (error) throw error;
    else {
      console.log(results);
      res.send(results);
    }
  });
});

module.exports = router;
