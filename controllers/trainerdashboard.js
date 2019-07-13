"use strict";

const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const gymutility = require("./gymutility.js");
const assessments = require("./assessments");
const playlistStore = require("../models/playlist-store");
const assessmentsStore = require("../models/assesments-store");
const userStore = require("../models/user-store");
const uuid = require("uuid");


const dashboard = {
    index(request, response) {
        logger.info("dashboard rendering");
        const currentMember = userStore.getUserById(request.params.id);
        const viewData = {
            user: request.params.id,
            title: "Assessment Dashboard",
            bmi: gymutility.calculateBMI(currentMember).toFixed(2),
            bmiCategory: gymutility.determineBMICategory(gymutility.calculateBMI(currentMember)),
            idealWeight: gymutility.isIdealBodyWeight(currentMember),
            name: currentMember.firstname,
            assessments: assessmentsStore.getUserAssessments(currentMember.id).reverse(),
        };
        logger.info("about to render");
        response.render("trainerdashboard", viewData);
    },


    deleteAssessment(request, response) {
        const userId = request.params.user;
        const assessmentId = request.params.id;
        logger.debug(`Deleting Assessment`);
        assessmentsStore.removeAssessment(assessmentId);
        response.reload();
    },

    addComment(request, response) {
      const userId = request.params.user;
      const assessment = assessmentsStore.getAssessment(request.params.id);
      assessment.comment = request.body.comment;
      assessmentsStore.save();
      response.redirect("/trainerdashboard/"+userId);
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
