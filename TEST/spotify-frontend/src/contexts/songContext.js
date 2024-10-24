import {createContext} from "react";

const songContext = createContext({
    currentSong: null,
    setCurrentSong: (currentSong) => {},
    soundPlayed: null,
    setSoundPlayed: () => {},
    isPaused: null,
    setIsPaused: () => {},
    duration:0,
    setDuration:(duration)=>{},
    currenttime:0,
    setCurrentTime:(currenttime)=>{},
});

export default songContext;
