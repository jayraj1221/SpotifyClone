import {useContext, useState, useLayoutEffect, useRef,useEffect} from "react";
import {Howl, Howler} from "howler";
import {Icon} from "@iconify/react";
import spotify_logo from "../assets/images/Appical_logo.svg";
import IconText from "../components/shared/IconText";
import TextWithHover from "../components/shared/TextWithHover";
import songContext from "../contexts/songContext";
import CreatePlaylistModal from "../modals/CreatePlaylistModal";
import AddToPlaylistModal from "../modals/AddToPlaylistModal";
import {makeAuthenticatedPOSTRequest} from "../utils/serverHelpers";

import { useNavigate } from 'react-router-dom';
const LoggedInContainer = ({children, curActiveScreen}) => {
    const [createPlaylistModalOpen, setCreatePlaylistModalOpen] =
    useState(false);
    const [fullscreen,setFullscreen] = useState(false)
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
        if(response.err)
        {
            console.log("HERE IN FRONTEND");
            alert(response.err)
        }
        if(response.message)
        {
            alert("Song is already in the Playlist");
        }
        if(response._id){
            alert("Song Added to the Playlist");
            setAddToPlaylistModalOpen(false)
        }
    };
    const likeSong = async () => {
        const songId = currentSong._id;  // Assuming currentSong holds the song data
    
        const payload = { songId };  // Payload includes the song ID
        const response = await makeAuthenticatedPOSTRequest(
            "/song/add/liked-song",  // Backend API route for liking a song
            payload
        );
    
        if (response.message) {
            alert("Song liked successfully!");
            // You can close any modal or update the UI state here
        } else {
            alert("Error: Could not like the song.");
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
    // const handleSeek = (newTime) => {
    //     audioRef.current.currentTime = newTime;
    //     setCurrentTime(newTime);
    // };
    
    // const formatTime = (seconds) => {
    //     const minutes = Math.floor(seconds / 60);
    //     const secs = Math.floor(seconds % 60);
    //     return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    // };
    

    return (
        <div className="h-full w-full bg-app-black overflow-hidden">
            {createPlaylistModalOpen && (
                <CreatePlaylistModal
                    closeModal={() => {
                        setCreatePlaylistModalOpen(false);
                    }}
                />
            )}
            {addToPlaylistModalOpen && (
                <AddToPlaylistModal
                    closeModal={() => {
                        setAddToPlaylistModalOpen(false);
                    }}
                    addSongToPlaylist={addSongToPlaylist}
                />
            )}
            <div className={`${currentSong ? "h-9/10" : "h-full"} w-full flex`}>
                {/* This first div will be the left panel */}
                <div className="h-full w-1/5 bg-black flex flex-col justify-between pb-10">
                    <div>
                        {/* This div is for logo */}
                        <div className="logoDiv p-6">
                            <img
                                src={spotify_logo}
                                alt="spotify logo"
                                width={200}
                            />
                        </div>
                        <div className="py-5">
                            <IconText
                                iconName={"material-symbols:home"}
                                displayText={"Home"}
                                targetLink={"/home"}
                                active={curActiveScreen === "home"}
                            />
                            <IconText
                                iconName={"material-symbols:search-rounded"}
                                displayText={"Search"}
                                active={curActiveScreen === "search"}
                                targetLink={"/search"}
                            />
                            <IconText
                                iconName={"icomoon-free:books"}
                                displayText={"Library"}
                                active={curActiveScreen === "library"}
                                targetLink={"/library"}
                            />
                            <IconText
                                iconName={
                                    "material-symbols:library-music-sharp"
                                }
                                displayText={"My Music"}
                                targetLink="/myMusic"
                                active={curActiveScreen === "myMusic"}
                            />
                            <IconText
                                iconName={"material-symbols:search"}
                                displayText={"Search Artist"}
                                targetLink="/searchArtist"
                                active={curActiveScreen === "searchArtist"}
                            />

                        </div>
                        <div className="pt-5">
                            <IconText
                                iconName={"material-symbols:add-box"}
                                displayText={"Create Playlist"}
                                onClick={() => {
                                    setCreatePlaylistModalOpen(true);
                                }}
                            />
                            <IconText
                                iconName={"mdi:cards-heart"}
                                displayText={"Liked Songs"}
                                targetLink="/likedSongs"
                                active={curActiveScreen === "likedSongs"}
                            />
                        </div>
                    </div>
                    <div className="px-5">
                        <div className="border border-gray-100 text-white w-2/5 flex px-2 py-1 rounded-full items-center justify-center hover:border-white cursor-pointer">
                            <Icon icon="carbon:earth-europe-africa" />
                            <div className="ml-2 text-sm font-semibold">
                                English
                            </div>
                        </div>
                    </div>
                </div>
                {/* This second div will be the right part(main content) */}
                <div className="h-full w-4/5 bg-app-black overflow-auto">
                    <div className="navbar w-full h-1/10 bg-black bg-opacity-30 flex items-center justify-end">
                        <div className="w-1/2 flex h-full">
                            <div className="w-2/3 flex justify-around items-center">
                                {/* <TextWithHover displayText={"Premium"} /> */}
                                {/* <TextWithHover displayText={"Support"} /> */}
                                {/* <TextWithHover displayText={"Download"} /> */}
                                <div className="h-1/2 border-r border-white"></div>
                            </div>
                            <div className="w-1/3 flex justify-around h-full items-center">
                                <TextWithHover displayText={"Upload Song"} onClick={() => navigate('/uploadSong')}  />
                                <div className="bg-white w-10 h-10 flex items-center justify-center rounded-full font-semibold cursor-pointer" onClick={()=>navigate('/profile')}>
                                    AC
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="content p-8 pt-0 overflow-auto h-full">
                        {children}
                    </div>
                </div>
            </div>
            {/* This div is the current playing song */}
            {currentSong && !fullscreen &&(
    <div className="w-full h-20 bg-black bg-opacity-30 text-white flex items-center px-4">
        <div className="w-1/4 flex items-center">
            <img
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
            </div>
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
                icon="mingcute:fullscreen-2-fill"
                fontSize={20}
                className="cursor-pointer text-gray-500 hover:text-white"
                onClick={()=>{
                    setFullscreen(true);
                    navigate('/music-player')
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
                onClick={()=>{
                    likeSong();    
                }
                }
            />
        </div>
    </div>
)}

       <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            height: 0;
            width: 0;
            background: transparent; /* Invisible but functional */
        }

        input[type="range"]::-moz-range-thumb {
            appearance: none;
            height: 0;
            width: 0;
            background: transparent; /* Invisible but functional */
        }

        input[type="range"]::-ms-thumb {
            appearance: none;
            height: 0;
            width: 0;
            background: transparent; /* Invisible but functional */
        }
    `}</style>
        </div>
    );
};

export default LoggedInContainer;
