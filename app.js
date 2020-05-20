const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const bodyParser = require("body-parser");
const User = require("./model/user");

mongoose.connect("mongodb://localhost/secret_password");

const app = express();
app.set("view engine", "ejs");
app.use(
  require("express-session")({
    secret: "Love programming", //secret to decoded sessions
    resave: false,
    saveUninitialized: false,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//===================
//Routes
//===================
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  req.body.username;
  req.body.password;
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        return res.render("register");
      }
      passport.authenticate("local")(req, res, () => {
        res.redirect("/secret");
      });
    }
  );
});

app.get("/secret", isLoggedIn, (req, res) => {
  res.render("secret");
});

//Login routes
//render login form
app.get("/login", (req, res) => {
  res.render("login");
});

//post login data
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.listen(3000, () => {
  console.log("Server is running");
});
