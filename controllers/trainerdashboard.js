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
           // user: loggedInUser.id,
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
