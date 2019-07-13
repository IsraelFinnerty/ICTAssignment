"use strict";

const logger = require("../utils/logger");
const accounts = require("./accounts.js");
const assessments = require("./assessments");
const assessmentsStore = require("../models/assesments-store");

const gymutility = {
    calculateBMI(request){
    const loggedInUser = request;
    let weight;
    if (assessmentsStore.getUserAssessments(loggedInUser.id).length >0) weight = assessments.getLatestAssessment(loggedInUser.id).weight;
    else weight = Number(loggedInUser.startWeight);
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

  isIdealBodyWeight(request)
{
    const loggedInUser = request;
    let weight;
    if (assessments.getLatestAssessment(loggedInUser.id)) weight = assessments.getLatestAssessment(loggedInUser.id).weight;
    else weight = loggedInUser.weight;

    if (loggedInUser.gender === "M")
    {
        if (loggedInUser.height<1.524)
        {
            if (weight>= 48 && weight<=52) return true;
            else return false;
        }

        else if (weight-2 > 50 +(2.3*((loggedInUser.height-1.524)/0.0254))) return false;
        else if (weight+2 < 50 +(2.3*((loggedInUser.height-1.524)/0.0254))) return false;
        else return true;
    }

    else
    {
        if (loggedInUser.height<1.524)
        {
            if (weight>= 43.5 && weight<=45.5) return true;
            else return false;
        }

        else if (weight-2 > 49 + (2.3*((loggedInUser.height-1.524)/0.0254))) return false;
        else if (weight+2 < 49 +(2.3*((loggedInUser.height-1.524)/0.0254))) return false;
        else return true;
    }

},

    weightTrend(request) {
        const loggedInUser = accounts.getCurrentUser(request);
        if (assessments.getLatestAssessment(loggedInUser.id)) {
            if (request.body.weight <= assessments.getLatestAssessment(loggedInUser.id).weight)
                return true;
        }
        else return true;

    }

};

module.exports = gymutility;
