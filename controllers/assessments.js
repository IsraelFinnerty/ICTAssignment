"use strict";

const logger = require("../utils/logger");
const assessmentsStore = require("../models/assesments-store");
const playlistStore = require("../models/playlist-store");
const accounts = require("./accounts.js");
const uuid = require("uuid");

const playlist = {
  index(request, response) {
    const playlistId = request.params.id;
    logger.debug("Playlist id = ", playlistId);
    const viewData = {
      title: "Playlist",
      playlist: playlistStore.getPlaylist(playlistId)
    };
    response.render("playlist", viewData);
  },

  deleteAssessment(request, response) {
    const userId = request.params.user;
    const assessmentId = request.params.id;
    logger.debug(`Deleting Assessment`);
    assessmentsStore.removeAssessment(assessmentId);
    response.redirect("/dashboard");
  },

  getLatestAssessment(request) {

    const last = assessmentsStore.getUserAssessments(request);
   return assessmentsStore.getAssessment(last[last.length-1].id);


  },

  addAssessment(request, response) {
    const assessmentId = request.params.id;
    const loggedInUser = accounts.getCurrentUser(request);
    const newAssessment = {
      id: uuid(),
      userid: loggedInUser.id,
      date: new Date().toLocaleString(),
      weight: request.body.weight,
      chest: request.body.chest,
      thigh: request.body.thigh,
      upperarm: request.body.upperarm,
      waist: request.body.waist,
      hips: request.body.hips,
    }
    logger.debug("Assessment = ", newAssessment);
    assessmentsStore.addAssessment(newAssessment);
    response.redirect("/dashboard");
  }
};

module.exports = playlist;
