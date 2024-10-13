const mongoose = require("mongoose");
// How to create a model
// Step 1 :require mongoose
// Step 2 :Create a mongoose schema (structure of a user)
// Step 3 : Create a model

const User = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        private: true,
    },
    lastName: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    likedSongs:  [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Song",  // assuming there is a Song model
        }
    ],
    likedPlaylists: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Song",  // assuming there is a Song model
        }
    ],
    subscribedArtists: {
        // We will change this to array later
        type: String,
        default: "",
    },
    profileImg:{
        type:String,
        default:''
    }
});

const UserModel = mongoose.model("User", User);

module.exports = UserModel;
