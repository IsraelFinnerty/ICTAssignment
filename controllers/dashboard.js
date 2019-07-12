"use strict";

const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const gymutility = require("./gymutility.js");
const assessments = require("./assessments");
const playlistStore = require("../models/playlist-store");
const assessmentsStore = require("../models/assesments-store");
const uuid = require("uuid");


const dashboard = {
  index(request, response) {
    logger.info("dashboard rendering");
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      user: loggedInUser.id,
      title: "Assessment Dashboard",
      bmi: gymutility.calculateBMI(request).toFixed(2),
      bmiCategory: gymutility.determineBMICategory(gymutility.calculateBMI(request)),
      idealWeight: gymutility.isIdealBodyWeight(request),
      name: accounts.getCurrentUser(request).firstName,
      assessments: assessmentsStore.getUserAssessments(loggedInUser.id).reverse(),
    };
    logger.info("about to render");
    response.render("dashboard", viewData);
  },

  calculateBMI(request){
    const loggedInUser = accounts.getCurrentUser(request);
    let weight;
    if (request != null) weight = assessments.getLatestAssessment(loggedInUser.id).weight;
    else weight = loggedInUser.weight;
    return weight / (loggedInUser.height * loggedInUser.height);
  },

  determineBMICategory(bmiValue) {


  if (bmiValue<16) return "SEVERELY UNDERWEIGHT";
  if (bmiValue>=16 &&bmiValue<18.5) return "UNDERWEIGHT";
  if (bmiValue>=18.5 && bmiValue<25) return "NORMAL";
  if (bmiValue>=25 && bmiValue<30) return "OVERWEIGHT";
  if (bmiValue>=30 && bmiValue<35) return "MODERATELY OBESE";
  if (bmiValue>=35) return "SEVERELY OBESE";

  else return "Error when calculating BMI Category";
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
