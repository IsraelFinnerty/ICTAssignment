"use strict";

const logger = require("../utils/logger");
const assessmentsStore = require("../models/assesments-store");
const playlistStore = require("../models/playlist-store");
const accounts = require("./accounts.js");
const gymutility = require("./gymutility.js");
const goalStore = require("../models/goal-store");
const uuid = require("uuid");

const goals = {
    deleteAssessment(request, response) {
        const userId = request.params.user;
        const assessmentId = request.params.id;
        logger.debug(`Deleting Assessment`);
        assessmentsStore.removeAssessment(assessmentId);
        response.redirect("/dashboard");
    },

    getLatestAssessment(request) {
        if (assessmentsStore.getUserAssessments(request).length > 0) {
            const last = assessmentsStore.getUserAssessments(request);
            return assessmentsStore.getAssessment(last[last.length - 1].id);
        }
        else return null;
    },

    addGoal(request, response) {
        const loggedInUser = accounts.getCurrentUser(request);
        const newGoal = {
            id: uuid(),
            userid: loggedInUser.id,
            date: new Date().toLocaleString(),
            target: request.body.target,
            measurement: request.body.measurement,
            futureDate: request.body.futureDate,
            status: "Open",
        };
        logger.debug("Goal = ", newGoal);
        goalStore.addGoal(newGoal);
        response.redirect("/dashboard");
    },

    updateGoalStatus(request, response) {
      const loggedInUser = accounts.getCurrentUser(request);
      const goal = goalStore.getGoal(request.params.id);
      goal.status = request.body.status;
      goalStore.save();
      response.redirect("/dashboard");
    },

    trainerStatus(request, response) {
        const currentMemberId = request.params.user;
        const goal = goalStore.getGoal(request.params.id);
        goal.status = request.body.status;
        goalStore.save();
        response.redirect("/trainerdashboard/"+currentMemberId);
    },

    totalGoals(userid) {
      return  goalStore.getUserGoals(userid).length;
      },

    openGoals(userid) {
        const goals = goalStore.getUserGoals(userid);
        let count = 0;
        for (let i =0; i<goals.length; i++)
        {
         if (goals[i].status === "Open") count++;
        }
        return count;
    },

    achievedGoals(userid) {
        const goals = goalStore.getUserGoals(userid);
        let count = 0;
        for (let i =0; i<goals.length; i++)
        {
            if (goals[i].status === "Achieved") count++;
        }
        return count;
    },

    missedGoals(userid) {
        const goals = goalStore.getUserGoals(userid);
        let count = 0;
        for (let i =0; i<goals.length; i++)
        {
            if (goals[i].status === "Missed") count++;
        }
        return count;
    }


};

module.exports = goals;
