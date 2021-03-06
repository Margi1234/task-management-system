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
router.post("/employees/add", function (req, res) {
  console.log("in adding employee");
  console.log(req.body);
  let empid = req.body.empid;
  let name = req.body.name;
  let email = req.body.email;
  let gender = req.body.gender;
  let contact = req.body.contact;
  let officeemail = req.body.officeemail;
  let officeno = req.body.office;
  let designation = req.body.designation;
  let dob = req.body.date;
  let permanentaddress = req.body.permanentaddress;
  let currentaddress = req.body.currentaddress;
  let doj = req.body.joiningdate;
  let skypename = req.body.skypeusername;
  var data = {
    empid: empid,
    name: name,
    email: email,
    gender: gender,
    dob: dob,
    permanentaddress: permanentaddress,
    currentaddress: currentaddress,
    contact: contact,
    offficeemail: officeemail,
    officeno: officeno,
    designation: designation,
    doj: doj,
    skypename: skypename,
  };
  conn.query("INSERT INTO employeetable SET ? ", data, function (
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
router.get("/getEmployeeData", function (req, res) {
  conn.query("SELECT * FROM employeetable", function (error, results, fields) {
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
router.delete("/deleteEmployee", function (req, res) {
  var id = req.body.id;
  var data = { id: id };
  console.log(id);
  var sql = `DELETE FROM employeetable WHERE id=${id}`;
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
router.put("/updateEmployee", function (req, res) {
  console.log("in updating admin user");
  console.log(req.body);
  var id = req.body.id;
  var empid = req.body.empid;
  var name = req.body.name;
  var email = req.body.email;
  var date = req.body.date;
  var gender = req.body.gender;
  var permanentaddress = req.body.permanentaddress;
  var currentaddress = req.body.currentaddress;
  var contact = req.body.contact;
  var officeemail = req.body.officeemail;
  var designation = req.body.designation;
  var joiningdate = req.body.joiningdate;
  var skypeusername = req.body.skypeusername;
  var office = req.body.office;
  // var data = { name: name, email: email, type: type, status: status };
  // console.log(data);
  var sql = `UPDATE employeetable SET empid = "${empid}", name = "${name}", email = "${email}", gender = "${gender}", dob = "${date}", permanentaddress = "${permanentaddress}", currentaddress = "${currentaddress}", contact = "${contact}",offficeemail = "${officeemail}", officeno = "${office}", designation = "${designation}", skypename = "${skypeusername}", doj = "${joiningdate}" WHERE id ="${id}"`;
  conn.query(sql, function (error, results, fields) {
    if (error) throw error;
    else {
      console.log(results);
      res.send(results);
    }
  });
});
// router.post("/searchFilter/:name/:email/:type/:status", function (req, res) {
//   // console.log(req.body);
//   var email = req.params.email;
//   email = email.substring(1);
//   var name = req.params.name;
//   name = name.substring(1);
//   var type = req.params.type;
//   type = type.substring(1);
//   var status = req.params.status;
//   status = status.substring(1);
//   var sql = `SELECT * FROM adminusers WHERE email LIKE "%${email}%" AND name LIKE "%${name}%" AND type LIKE "%${type}%" AND status LIKE "%${status}%"`;
//   // console.log("query is ", sql);
//   conn.query(sql, function (error, results, fields) {
//     if (error) throw error;
//     else {
//       // console.log(results);
//       res.send(results);
//     }
//   });
// });

router.post("/sortUsers", function (req, res) {
  console.log("in sorting api");
  console.log(req.body);
  var rowsPerPage = req.body.rows;
  var page = req.body.page;
  var sql = `SELECT * FROM adminusers WHERE name LIKE "%${req.body.fil.name}%" AND email LIKE "%${req.body.fil.email}%" AND type LIKE "%${req.body.fil.type}%" AND status LIKE "${req.body.fil.status}%" ORDER BY ${req.body.ordBy} ${req.body.ord}`;
  conn.query(sql, function (error, results, fields) {
    if (error) throw error;
    else {
      //
      results = results.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
      console.log(results);
      res.send(results);
    }
  });
});

router.post("/sortEmployees", function (req, res) {
  console.log("in sorting api");
  console.log(req.body);
  var rowsPerPage = req.body.rows;
  var page = req.body.page;
  var sql = `SELECT * FROM employeetable WHERE name LIKE "%${req.body.fil.name}%" AND empid LIKE "%${req.body.fil.empid}%" AND permanentaddress LIKE "%${req.body.fil.permanentaddress}%" AND currentaddress LIKE "%${req.body.fil.currentaddress}%" AND contact LIKE "%${req.body.fil.contact}%" AND officeno LIKE "${req.body.fil.office}%" AND designation LIKE "${req.body.fil.designation}%" ORDER BY ${req.body.ordBy} ${req.body.ord}`;
  conn.query(sql, function (error, results, fields) {
    if (error) throw error;
    else {
      //
      results = results.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
      console.log(results);
      res.send(results);
    }
  });
});
module.exports = router;
