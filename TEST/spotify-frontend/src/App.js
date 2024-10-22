import "./output.css";
import {useState, useEffect} from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import LoginComponent from "./routes/Login";
import SignupComponent from "./routes/Signup";
import HomeComponent from "./routes/Home";
import LoggedInHomeComponent from "./routes/LoggedInHome";
import UploadSong from "./routes/UploadSong";
import MyMusic from "./routes/MyMusic";
import SearchPage from "./routes/SearchPage";
import Library from "./routes/Library";
import SinglePlaylistView from "./routes/SinglePlaylistView";
import {useCookies} from "react-cookie";
import songContext from "./contexts/songContext";
import FullScreenMusicPlayer from "./routes/FullscreenSong";
import LikedSongs from "./routes/LikedSongs";
import { Profile } from "./routes/Profile";
import { EditProfile } from "./routes/editprofile";
import { SearchArtist } from "./routes/SearchArtist";
import { ArtistsProfile } from "./routes/ArtistProfile";

function App() {
    const [currentSong, setCurrentSong] = useState(null);
    const [soundPlayed, setSoundPlayed] = useState(null);
    const [isPaused, setIsPaused] = useState(true);
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const [loading, setLoading] = useState(true); // Add a loading state

    useEffect(() => {
        // Simulate cookie check delay for demonstration, remove or adjust as needed
        setTimeout(() => {
            setLoading(false); // Set loading to false once cookies are checked
        }, 1000);
    }, [cookies]);

    if (loading) {
        return <div>Loading...</div>; 
    }

    return (
        <div className="w-screen h-screen font-poppins">
            <BrowserRouter>
                {cookies.token ? (
                    // logged in routes
                    <songContext.Provider
                        value={{
                            currentSong,
                            setCurrentSong,
                            soundPlayed,
                            setSoundPlayed,
                            isPaused,
                            setIsPaused,
                        }}
                    >
                        <Routes>
                            <Route path="/home" element={<LoggedInHomeComponent />} />
                            <Route path="/uploadSong" element={<UploadSong />} />
                            <Route path="/myMusic" element={<MyMusic />} />
                            <Route path="/likedSongs" element={<LikedSongs />} />
                            <Route path="/music-player" element={<FullScreenMusicPlayer />} />
                            <Route path="/search" element={<SearchPage />} />
                            <Route path="/library" element={<Library />} />
                            <Route path='/profile' element={<Profile/>}/>
                            <Route path='/editprofile' element={<EditProfile/>}/>
                            <Route path='/searchArtist' element={<SearchArtist/>}/>
                            <Route path='/artistProfile' element={<ArtistsProfile/>}/>
                            <Route path="/playlist/:playlistId" element={<SinglePlaylistView />} />
                            <Route path="*" element={<Navigate to="/home" />} />
                        </Routes>
                    </songContext.Provider>
                ) : (
                    // logged out routes
                    <Routes>
                        <Route path="/home" element={<HomeComponent />} />
                        <Route path="/login" element={<LoginComponent />} />
                        <Route path="/signup" element={<SignupComponent />} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                )}
            </BrowserRouter>
        </div>
    );
}

export default App;