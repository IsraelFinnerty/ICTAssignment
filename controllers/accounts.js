"use strict";

const userstore = require("../models/user-store");
const logger = require("../utils/logger");
const uuid = require("uuid");

const accounts = {
  index(request, response) {
    const viewData = {
      title: "Login or Signup"
    };
    response.render("index", viewData);
  },

  login(request, response) {
    const viewData = {
      title: "Login to the Service"
    };
    response.render("login", viewData);
  },

  logout(request, response) {
    response.cookie("playlist", "");
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Login to the Service"
    };
    response.render("signup", viewData);
  },

  settings(request, response) {
      const loggedInUser = accounts.getCurrentUser(request);
      const viewData = {
      title: "Update User Records",
          user: loggedInUser
      };
    response.render("settings", viewData);
  },

    updateSettings(request, repsonse) {
      const loggedInUser = accounts.getCurrentUser(request);
       loggedInUser.firstname = request.body.firstname;
        loggedInUser.lastname = request.body.lastname;
        loggedInUser.gender = request.body.gender.charAt(0).toUpperCase();
        loggedInUser.email = request.body.email;
        loggedInUser.password = request.body.password;
        loggedInUser.address = request.body.address;
        loggedInUser.height = request.body.height;
        loggedInUser.startWeight = request.body.startWeight;
      userstore.save();
      repsonse.redirect("/settings");
    },

  register(request, response) {
    const user = request.body;
    user.id = uuid();
    user.gender = request.body.gender.charAt(0).toUpperCase();
    userstore.addUser(user);
    logger.info(`registering`);
    response.redirect("/login");
  },

  authenticate(request, response) {
    const user = userstore.getUserByEmail(request.body.email);
    if (user && user.password === request.body.password) {
      response.cookie("playlist", user.email);
      logger.info(`logging in ${user.email}`);
        if (request.body.email==="jim@trainer.com" || request.body.email==="jimswife@trainer.com")
          { response.redirect("/trainermenu"); }
          else {
          response.redirect("/dashboard");
                }
      }
    else {
        const viewData = {
            failedLogin: true
        };
      response.render("login", viewData);
    }
  },

  getCurrentUser(request) {
    const userEmail = request.cookies.playlist;
    return userstore.getUserByEmail(userEmail);
  }
};

module.exports = accounts;
