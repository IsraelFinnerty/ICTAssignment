"use strict";

const logger = require("../utils/logger");
const userStore = require("../models/user-store");

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
      return userStore.getAllUsers();
    },

    deleteMember(request, response) {
      const userId = request.params.id;
      userStore.deleteUser(userId);
      response.redirect("/trainermenu");
    }
};

module.exports = trainers;