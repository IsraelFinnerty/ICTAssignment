"use strict";

const _ = require("lodash");
const JsonStore = require("./json-store");

const assessmentStore = {
    store: new JsonStore("./models/assessments-store.json", {
        assessmentCollection: []
    }),
    collection: "assessmentCollection",

    getAllPlaylists() {

        const playlists = this.store.findAll(this.collection);

        for (let i=0; i<playlists.length; i++) {
            const playlist = this.getPlaylist(playlists[i].id);
            const songs = playlist.songs;
            let total = 0;
            for (let i=0; i<songs.length; i++)
            {
                total += Number(songs[i].duration);
            }
            playlist.duration=total;
            this.store.save();
        }
        return playlists;
    },

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

    removeAllPlaylists() {
        this.store.removeAll(this.collection);
        this.store.save();
    },

    addSong(id, song) {
        const playlist = this.getPlaylist(id);
        playlist.songs.push(song);

        let duration = 0;
        for (let i = 0; i < playlist.songs.length; i++) {
            duration += playlist.songs[i].duration;
        }

        playlist.duration = duration;
        this.store.save();
    },

    removeAssessment2(user, id) {
        const assessment = this.getAssessment(id);
        const songs = playlist.songs;
        _.remove(songs, { id: songId });
        this.store.save();
    }
};

module.exports = assessmentStore;
