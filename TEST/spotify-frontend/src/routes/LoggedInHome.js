import {useState,useEffect} from "react";
// import {Howl, Howler} from "howler";
import {Icon} from "@iconify/react";
// import spotify_logo from "../assets/images/Appical_logo.svg";
// import IconText from "../components/shared/IconText";
// import TextWithHover from "../components/shared/TextWithHover";
import LoggedInContainer from "../containers/LoggedInContainer";
import {useContext} from "react";
import songContext from "../contexts/songContext";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";
// import styles from "home.modules.css";


const Home = () => {
    const [songData, setSongData] = useState([]);
    const [songData1, setSongData1] = useState([]);

    useEffect(() => {
        const getData = async (playlist,setFunct) => {
            const response = await makeAuthenticatedGETRequest(
                "/playlist/get/playlist/songs/" + playlist
            );
            setFunct(response);
        };
        getData("6713611694920232af1cfe60",setSongData);
        getData("6713583d73a0ebadca17a06e",setSongData1);
        
    }, []);
    return (
        <LoggedInContainer curActiveScreen="home">
            <PlaylistView titleText="Sunset Chill" cardsData={songData1} />
            
            <PlaylistView titleText="Navaratri 2k24 💫" cardsData={songData} />

        </LoggedInContainer>
    );
};

const PlaylistView = ({titleText, cardsData}) => {
    return (
        <div className="text-white mt-8 my-32">
            <div className="text-2xl font-semibold mb-5">{titleText}</div>
            <div className="w-full flex justify-between space-x-4">
                {
                  // cardsData will be an array
                cardsData.slice(0, 5).map((item) => {
                    return (
                        <Card
                        key={item.id} 
                        info={item}
                         playSound={() => {}}
                        />
                        );
                    })

                }
            </div>
        </div>
    );
};

const Card = ({info,playsound}) => {
    const {currentSong, setCurrentSong,currenttime} = useContext(songContext);
    return (

        <div className="bg-black bg-opacity-40 w-1/5 h-60  rounded-lg"
        onClick={() => {
            // setCurrentTime(0);
            setCurrentSong(info);
        }}>
            <div className="pb-4 pt-2 w-full h-full bg-cover" style={{
                    backgroundImage: `url("${info.thumbnail}")`,
                }}>
                {/* <img className="w-full rounded-md" src={info.thumbanail} alt="label" /> */}
            </div>
            <div className="text-white font-semibold py-3">{info.name}</div>
            {/* <div className="text-gray-500 text-sm">{info.artist.firstName + " " + info.artist.lastName}</div> */}
        </div>
    );
};

export default Home;
