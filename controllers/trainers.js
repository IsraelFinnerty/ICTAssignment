"use strict";

const logger = require("../utils/logger");
const userstore = require("../models/user-store");

const trainers = {
    index(request, response) {
        logger.info("about rendering");
        const viewData = {
            title: "Trainer Menu",
            memberlist: trainers.listMembers(request),
        };
        response.render("trainermenu", viewData);
    },

    listMembers(request){
      return userstore.getAllUsers();
    }
};

module.exports = trainers;