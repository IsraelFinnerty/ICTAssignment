"use strict";

const logger = require("../utils/logger");
const accounts = require("./accounts.js");


const gymutility2 = {
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
};
/*
public static String determineBMICategory(double bmiValue){


    if (bmiValue<16) return "SEVERELY UNDERWEIGHT";
    if (bmiValue>=16 &&bmiValue<18.5) return "UNDERWEIGHT";
    if (bmiValue>=18.5 && bmiValue<25) return "NORMAL";
    if (bmiValue>=25 && bmiValue<30) return "OVERWEIGHT";
    if (bmiValue>=30 && bmiValue<35) return "MODERATELY OBESE";
    if (bmiValue>=35) return "SEVERELY OBESE";

    else return "Error when calculating BMI Category";
}

public static boolean isIdealBodyWeight(Member member, Assessment assessment)
{
    double weight;
    if (assessment!=null) weight=assessment.getWeight();
    else weight= member.getStartWeight();

    if (member.getGender().equals("M"))
    {
        if (member.getHeight()<1.524)
        {
            if (weight>= 48 && weight<=52) return true;
            else return false;
        }

        else if (weight-2 > 50 +(2.3*((member.getHeight()-1.524)/0.0254))) return false;
        else if (weight+2 < 50 +(2.3*((member.getHeight()-1.524)/0.0254))) return false;
        else return true;
    }

    else
    {
        if (member.getHeight()<1.524)
        {
            if (weight>= 43.5 && weight<=45.5) return true;
            else return false;
        }

        else if (weight-5 > 49 +(2.3*((member.getHeight()-1.524)/0.0254))) return false;
        else if (weight+5 < 49 +(2.3*((member.getHeight()-1.524)/0.0254))) return false;
        else return true;
    }

}
*/