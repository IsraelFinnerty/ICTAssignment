"use strict";

const _ = require("lodash");
const JsonStore = require("./json-store");

const assessmentStore = {
    store: new JsonStore("./models/assessments-store.json", {
        assessmentCollection: []
    }),
    collection: "assessmentCollection",

    getAssessment(id) {
        return this.store.findOneBy(this.collection, { id: id });
    },

    getUserAssessments(userid) {
        return this.store.findBy(this.collection, { userid: userid });
    },

    addAssessment(assessment) {
        this.store.add(this.collection, assessment);
        this.store.save();
    },

    removeAssessment(id) {
        const assessment = this.getAssessment(id);
        this.store.remove(this.collection, assessment);
        this.store.save();
    },

    removeAllAssessments() {
        this.store.removeAll(this.collection);
        this.store.save();
    },

       save() {
        this.store.save();
    }
};

module.exports = assessmentStore;
