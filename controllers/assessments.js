"use strict";

const logger = require("../utils/logger");
const assessmentsStore = require("../models/assesments-store");
const accounts = require("./accounts.js");
const gymutility = require("./gymutility.js");
const uuid = require("uuid");

const assessments = {
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
      trend: assessments.weightTrend(request),
      comment: "",
    };
    logger.debug("Assessment = ", newAssessment);
    assessmentsStore.addAssessment(newAssessment);
    response.redirect("/dashboard");
  },

 weightTrend(request) {
    const loggedInUser = accounts.getCurrentUser(request);
    if (assessments.getLatestAssessment(loggedInUser.id)) {
        if (request.body.weight <= assessments.getLatestAssessment(loggedInUser.id).weight)
            return true;
    }
    else return true;

  },
};

module.exports = assessments;
