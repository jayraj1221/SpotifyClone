import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import LoggedInContainer from '../containers/LoggedInContainer';
import {useContext,  useLayoutEffect, useRef,useEffect} from "react";
import {Howl, Howler} from "howler";
import spotify_logo from "../assets/images/Appical_logo.svg";
import IconText from "../components/shared/IconText";
import TextWithHover from "../components/shared/TextWithHover";
import songContext from "../contexts/songContext";
import CreatePlaylistModal from "../modals/CreatePlaylistModal";
import AddToPlaylistModal from "../modals/AddToPlaylistModal";
import {makeAuthenticatedPOSTRequest} from "../utils/serverHelpers";
import { useNavigate } from 'react-router-dom';
import  wave from '../assets/images/wave.gif';
const FullScreenMusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [createPlaylistModalOpen, setCreatePlaylistModalOpen] =
    useState(false);
const [addToPlaylistModalOpen, setAddToPlaylistModalOpen] = useState(false);
const navigate = useNavigate();
const {
    currentSong,
    setCurrentSong,
    soundPlayed,
    setSoundPlayed,
    isPaused,
    setIsPaused,
} = useContext(songContext);

const firstUpdate = useRef(true);

const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);
const handleSeek = (newTime) => {
    soundPlayed.seek(newTime);
    setCurrentTime(newTime);
};

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};
useEffect(() => {
    if (soundPlayed) {
        soundPlayed.on("end", () => setIsPaused(true));
        soundPlayed.on("play", () => {
            setDuration(soundPlayed.duration());
            // updateCurrentTime();
        });
    }
}, [soundPlayed]);
useEffect(() => {
    let interval;
    if (soundPlayed && !isPaused) {
        interval = setInterval(() => {
            setCurrentTime(soundPlayed.seek());
        }, 1000); // Update every second
    }

    return () => clearInterval(interval); // Clear interval when paused or unmounted
}, [soundPlayed, isPaused]);
useLayoutEffect(() => {
    // the following if statement will prevent the useEffect from running on the first render.
    if (firstUpdate.current) {
        firstUpdate.current = false;
        return;
    }

    if (!currentSong) {
        return;
    }
    changeSong(currentSong.track);
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [currentSong && currentSong.track]);

const addSongToPlaylist = async (playlistId) => {
    const songId = currentSong._id;

    const payload = {playlistId, songId};
    const response = await makeAuthenticatedPOSTRequest(
        "/playlist/add/song",
        payload
    );
    if(response._id){
        setAddToPlaylistModalOpen(false)
    }
};

const playSound = () => {
    if (!soundPlayed) {
        return;
    }
    soundPlayed.play();
};

const changeSong = (songSrc) => {
    if (soundPlayed) {
        soundPlayed.stop();
    }
    let sound = new Howl({
        src: [songSrc],
        html5: true,
    });
    setSoundPlayed(sound);
    sound.play();
    setIsPaused(false);
};

const pauseSound = () => {
    soundPlayed.pause();
};

const togglePlayPause = () => {
    if (isPaused) {
        playSound();
        setIsPaused(false);
    } else {
        pauseSound();
        setIsPaused(true);
    }
};
    // Example song data
    const songData = {
        title: "Rang Bhini Radha",
        artist: "Aditya Gadhvi",
        duration: "4:07",
        currentTime: "1:17",
        coverImage: "path/to/your/image.png" // Update with your image path
    };

    const togglePlayer = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        // <div>
        //     {/* Full-Screen Icon */}
        //     <Icon
        //         icon="ic:twotone-repeat"
        //         fontSize={60}
        //         className="cursor-pointer text-gray-500 hover:text-white"
        //         onClick={togglePlayer}
        //     />

        //     {/* Music Player */}
        //     {isPlaying && (
        //         <div className="fixed top-0 left-0 w-screen h-screen flex flex-col items-center justify-center bg-red-900 text-white">
        //             <div className="flex items-center justify-center mb-5">
        //                 <img
        //                     src={songData.coverImage}
        //                     alt="Album Cover"
        //                     className="w-64 h-64 object-cover rounded-md"
        //                 />
        //             </div>
        //             <h2 className="text-3xl font-bold">{songData.title}</h2>
        //             <p className="text-xl">{songData.artist}</p>
        //             <div className="flex items-center justify-between w-1/2 mt-5">
        //                 <span>{songData.currentTime}</span>
        //                 <div className="bg-gray-200 w-full h-2 mx-2 rounded-full">
        //                     <div className="bg-white h-full" style={{ width: '30%' }}></div>
        //                 </div>
        //                 <span>{songData.duration}</span>
        //             </div>
        //             <div className="flex space-x-5 mt-5">
        //                 <button className="bg-white rounded-full p-3">⏮️</button>
        //                 <button className="bg-white rounded-full p-3">▶️</button>
        //                 <button className="bg-white rounded-full p-3">⏭️</button>
        //             </div>
        //         </div>
        //     )}
        // </div>
        // <LoggedInContainer curActiveScreen="home">
        <div className='w-full h-full'>

       
            <div className='w-full h-full bg-black p-3'>
                <div className='w-full bg-black h-3/4  flex flex-row items-center  justify-start p-3'> 

                    <div className='w-1/3 h-full bg-red-100 flex items-center justify-center m-2'>
                        <img src={currentSong.thumbnail} className='h-full w-full'>
                        </img>
                    </div>
                    <div className='w-2/3 h-full bg-white  flex flex-col items-center justify-center m-2'>
                        <div className='w-full h-2/3 '>
                            {/* <img src={wave}></img> */}
                        </div>
                        <div className=' w-full h-1/3  flex items-center justify-start text-4xl pl-10'>
                        {currentSong.name}
                        </div>
                        <div className='w-full h-1/3   flex items-center justify-start text-lg pl-10'>

                        {currentSong.artist.firstName + " " + currentSong.artist.lastName}</div>

                    </div>
                </div>
                {currentSong && (
    <div className="w-full h-40 bg-transparent text-white flex items-center px-4">
        <div className="w-1/4 flex items-center bg-black">
            {/* <img
                src={currentSong.thumbnail}
                alt="currentSongThumbnail"
                className="h-14 w-14 rounded"
            />
            <div className="pl-4">
                <div className="text-sm hover:underline cursor-pointer">
                    {currentSong.name}
                </div>
                <div className="text-xs text-gray-500 hover:underline cursor-pointer">
                    {currentSong.artist.firstName + " " + currentSong.artist.lastName}
                </div>
            </div> */}
        </div>
        <div className="w-1/2 flex justify-center h-full flex-col items-center">
            <div className="flex w-1/3 justify-between items-center">
                {/* Controls for the playing song */}
                <Icon
                    icon="ph:shuffle-fill"
                    fontSize={30}
                    className="cursor-pointer text-gray-500 hover:text-white"
                />
                <Icon
                    icon="mdi:skip-previous-outline"
                    fontSize={30}
                    className="cursor-pointer text-gray-500 hover:text-white"
                />
                <Icon
                    icon={isPaused ? "ic:baseline-play-circle" : "ic:baseline-pause-circle"}
                    fontSize={50}
                    className="cursor-pointer text-gray-500 hover:text-white"
                    onClick={togglePlayPause}
                />
                <Icon
                    icon="mdi:skip-next-outline"
                    fontSize={30}
                    className="cursor-pointer text-gray-500 hover:text-white"
                />
                <Icon 
                icon="mingcute:fullscreen-exit-2-fill"
                fontSize={20}
                className="cursor-pointer text-gray-500 hover:text-white"
                onClick={()=>{
                    navigate('/mymusic')
                }}
                 />
            </div>

            {/* Progress Bar */}
            <div className="w-full mt-2">
    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
        {/* Current Time */}
        <span>{formatTime(currentTime)}</span>
        
        {/* Progress Bar */}
        <div className="w-full mx-4 relative">
            <input
                type="range"
                min="0"
                max={duration} // Duration of the song
                value={currentTime} // Current progress of the song
                onChange={(e) => handleSeek(e.target.value)} // Handle seeking
                className="w-full h-1 bg-gray-600 rounded-lg cursor-pointer appearance-none"
                style={{
                    background: `linear-gradient(to right, white ${((currentTime / duration) * 100)}%, gray ${((currentTime / duration) * 100)}%)`,
                }}
            />
        </div>
        
        {/* Song Duration */}
        <span>{formatTime(duration)}</span>
    </div>
</div>

        </div>
        <div className="w-1/4 flex justify-end pr-4 space-x-4 items-center">
            <Icon
                icon="ic:round-playlist-add"
                fontSize={30}
                className="cursor-pointer text-gray-500 hover:text-white"
                onClick={() => {
                    setAddToPlaylistModalOpen(true);
                }}
            />
            <Icon
                icon="ph:heart-bold"
                fontSize={25}
                className="cursor-pointer text-gray-500 hover:text-white"
            />
        </div>
    </div>
)}
            </div>
            </div>
        // </LoggedInContainer>
    );
};

export default FullScreenMusicPlayer;
