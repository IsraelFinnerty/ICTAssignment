"use strict";

const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const gymutility = require("./gymutility.js");
const assessments = require("./assessments");
const assessmentsStore = require("../models/assesments-store");
const goalStore = require("../models/goal-store");
const goals = require("./goals.js");
const uuid = require("uuid");


const dashboard = {
  index(request, response) {
    logger.info("dashboard rendering");
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      user: loggedInUser.id,
      title: "Assessment Dashboard",
      bmi: gymutility.calculateBMI(loggedInUser).toFixed(2),
      bmiCategory: gymutility.determineBMICategory(gymutility.calculateBMI(loggedInUser)),
      idealWeight: gymutility.isIdealBodyWeight(loggedInUser),
      name: loggedInUser.firstname,
      assessments: assessmentsStore.getUserAssessments(loggedInUser.id).reverse(),
      goals: goalStore.getUserGoals(loggedInUser.id).reverse(),
      totalGoals: goals.totalGoals(loggedInUser.id),
      openGoals: goals.openGoals(loggedInUser.id),
      achievedGoals: goals.achievedGoals(loggedInUser.id),
      missedGoals: goals.missedGoals(loggedInUser.id)
    };
    logger.info("about to render");
    response.render("dashboard", viewData);
  },



  deletePlaylist(request, response) {
    const playlistId = request.params.id;
    logger.debug(`Deleting Playlist ${playlistId}`);
    playlistStore.removePlaylist(playlistId);
    response.redirect("/dashboard");
  },

  addAssessment(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const newPlayList = {
      id: uuid(),
      userid: loggedInUser.id,
      title: request.body.title,
      songs: []
    };
    logger.debug("Creating a new Playlist", newPlayList);
    playlistStore.addPlaylist(newPlayList);
    response.redirect("/dashboard");
  }
};

module.exports = dashboard;
