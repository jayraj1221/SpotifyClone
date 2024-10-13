const express = require("express");
const router = express.Router();
const passport = require("passport");
const Song = require("../models/Song");
const User = require("../models/User");

router.post(
    "/create",
    passport.authenticate("jwt", {session: false}),
    async (req, res) => {
        // req.user getss the user because of passport.authenticate
        const {name, thumbnail, track} = req.body;
        if (!name || !thumbnail || !track) {
            return res
                .status(301)
                .json({err: "Insufficient details to create song."});
        }
        const artist = req.user._id;
        const songDetails = {name, thumbnail, track, artist};
        const createdSong = await Song.create(songDetails);
        return res.status(200).json(createdSong);
    }
);

// Get route to get all songs I have published.
router.get(
    "/get/mysongs",
    passport.authenticate("jwt", {session: false}),
    async (req, res) => {
        // We need to get all songs where artist id == currentUser._id
        const songs = await Song.find({artist: req.user._id}).populate(
            "artist"
        );
        return res.status(200).json({data: songs});
    }
);

// Get route to get all songs any artist has published
// I will send the artist id and I want to see all songs that artist has published.
router.get(
    "/get/artist/:artistId",
    passport.authenticate("jwt", {session: false}),
    async (req, res) => {
        const {artistId} = req.params;
        // We can check if the artist does not exist
        const artist = await User.findOne({_id: artistId});
        // ![] = false
        // !null = true
        // !undefined = true
        if (!artist) {
            return res.status(301).json({err: "Artist does not exist"});
        }

        const songs = await Song.find({artist: artistId}).populate('artist');
        return res.status(200).json({data: songs});
    }
);

// Get route to get a single song by name
router.get(
    "/get/songname/:songName",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { songName } = req.params;

        try {
            // Create a regular expression for case-insensitive pattern matching
            const regex = new RegExp(songName, "i"); // 'i' for case insensitive

            // Use regex to find songs matching the pattern in the name field
            const songs = await Song.find({ name: regex }).populate("artist");

            return res.status(200).json({ data: songs });
        } catch (error) {
            console.error("Error fetching songs: ", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
);
router.get(
    "/get/artistname/:artistName",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { artistName } = req.params;

        // Perform a case-insensitive search for artists
        const artists = await Artist.find({
            name: { $regex: artistName, $options: "i" }
        });

        return res.status(200).json({ data: artists });
    }
);
router.get(
    "/get/liked-songs",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            // Assuming the user document has a field `likedSongs` which stores an array of song IDs
            const user = await  User.findById(req.user._id).populate('likedSongs');
            console.log(user);

            // Fetch the user's liked songs, populate the `artist` field
            const likedSongs = await Song.find({
                _id: { $in: user.likedSongs }
            }).populate("artist");
            return res.status(200).json({ data: likedSongs });
        } catch (error) {
            return res.status(500).json({ error: "Error fetching liked songs" });
        }
    }
);
router.post(
    "/add/liked-song",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const userId = req.user._id; // The authenticated user's ID
            const { songId } = req.body; // The ID of the song to like should come from the request body, not params

            // Check if the song exists
            const song = await Song.findById(songId);
            if (!song) {
                return res.status(404).json({ message: "Song not found" });
            }   

            // Check if the song is already liked by the user
            const user = await User.findById(userId);
            console.log(user);
            // If the song is already liked, return an appropriate response
            if (user.likedSongs.includes(songId)) {
                return res.status(400).json({ message: "Song already liked" });
            }

            // Add the song to the likedSongs array and save the user
            user.likedSongs.push(songId);
            await user.save();

            // Return success response with updated likedSongs array
            return res.status(200).json({
                message: "Song added to liked songs",
                likedSongs: user.likedSongs,
            });
        } catch (error) {
            // Return a 500 error in case something goes wrong
            console.log(error);
            return res.status(500).json({ error: error });
        }
    }
);


module.exports = router;
