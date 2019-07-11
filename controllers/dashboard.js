"use strict";

const accounts = require("./accounts.js");
const logger = require("../utils/logger");
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
      name: accounts.getCurrentUser(request).firstName,
      assessments: assessmentsStore.getUserAssessments(loggedInUser.id).reverse(),
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
