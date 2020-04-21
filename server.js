const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const users = require("./routes/api/users");
const path = require("path");
const app = express();
const cors = require("cors");
const keys = require("./config/keys");
const jwtsimple = require("jwt-simple");
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(passport.initialize());

require("./config/passport")(passport);
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
// passport.serializeUser(function (user, done) {
//   console.log(user);
//   done(null, user);
// });
// passport.deserializeUser(function (user, done) {
//   done(null, user);
// });
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "37673375772-f1necll84esb6jlu6ed6ghmu41beoel2.apps.googleusercontent.com",
      clientSecret: "zlIfNODrun_lF26ddun0jaqm",
      // callbackURL: "http://localhost:5000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      var userData = {
        email: profile.emails[0].value,
        name: profile.displayName,
        token: accessToken,
      };
      console.log(userData);
      done(null, userData);
    }
  )
);
// app.get("/", function (req, res) {
//   console.log("in get");
//   res.send("hiii");
// });
// app.get("/resetpassword/:token", function (req, res) {
//   console.log("in reset password token");
//   var secret = keys.secretOrKey;
//   var payload = jwtsimple.decode(req.params.token, secret);
//   res.send(payload);
// });
app.use("/api/users", users);
// if (process.env.NODE_ENV === "production") {
//   //set static folder
//   app.use(express.static("client/build"));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }
const port = 5000;
app.listen(port, () => {
  console.log("Listening on PORT ", port, "!");
});
