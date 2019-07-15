"use strict";

const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const gymutility = require("./gymutility.js");
const assessments = require("./assessments");
const playlistStore = require("../models/playlist-store");
const assessmentsStore = require("../models/assesments-store");
const userStore = require("../models/user-store");
const goalStore = require("../models/goal-store");
const goals = require("./goals.js");
const uuid = require("uuid");


const trainerdashboard = {
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
            goals: goalStore.getUserGoals(currentMember.id).reverse(),
            totalGoals: goals.totalGoals(currentMember.id),
            openGoals: goals.openGoals(currentMember.id),
            achievedGoals: goals.achievedGoals(currentMember.id),
            missedGoals: goals.missedGoals(currentMember.id)
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
    },

    addGoal(request, response) {
        const currentUserId = request.params.id;
        const newGoal = {
            id: uuid(),
            userid: currentUserId,
            date: new Date().toLocaleString(),
            target: request.body.target,
            measurement: request.body.measurement,
            futureDate: request.body.futureDate,
            status: "Open",
        };
        logger.debug("Goal = ", newGoal);
        goalStore.addGoal(newGoal);
        response.redirect("/trainerdashboard/"+currentUserId);
    },
};

module.exports = trainerdashboard;
