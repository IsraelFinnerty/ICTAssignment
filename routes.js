"use strict";

const express = require("express");
const router = express.Router();

const accounts = require("./controllers/accounts.js");
const dashboard = require("./controllers/dashboard.js");
const about = require("./controllers/about.js");
const playlist = require("./controllers/playlist.js");
const assessments = require("./controllers/assessments.js");
const trainers = require("./controllers/trainers.js");
const trainerdashboard = require("./controllers/trainerdashboard.js");

router.get("/", accounts.index);
router.get("/login", accounts.login);
router.get("/signup", accounts.signup);
router.get("/logout", accounts.logout);
router.get("/settings", accounts.settings);
router.post("/register", accounts.register);
router.post("/authenticate", accounts.authenticate);

router.get("/dashboard", dashboard.index);
router.get("/dashboard/deleteplaylist/:id", dashboard.deletePlaylist);
router.post("/dashboard/addassessment", assessments.addAssessment);
router.get("/dashboard/deleteassessment/:id", assessments.deleteAssessment);

router.get("/trainermenu", trainers.index);
router.get("/trainerdashboard/:id", trainerdashboard.index);
router.post("/trainerdashboard/:user/addcomment/:id", trainerdashboard.addComment);

router.get("/about", about.index);
router.get("/playlist/:id", playlist.index);
router.get("/playlist/:id/deletesong/:songid", playlist.deleteSong);
router.post("/playlist/:id/addsong", playlist.addSong);

module.exports = router;
