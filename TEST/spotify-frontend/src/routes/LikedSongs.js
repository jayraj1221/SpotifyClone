import {useState, useEffect} from "react";
import SingleSongCard from "../components/shared/SingleSongCard";
import {makeAuthenticatedGETRequest} from "../utils/serverHelpers";
import LoggedInContainer from "../containers/LoggedInContainer";

const LikedSongs = () => {
    const [songData, setSongData] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const response = await makeAuthenticatedGETRequest(
                "/song/get/liked-songs"
            );
            setSongData(response.data);
        };
        getData();
    }, []);

    return (
        <LoggedInContainer curActiveScreen="likedSongs">
            <div className="text-white text-xl font-semibold pb-4 pl-2 pt-8">
                Liked Songs
            </div>
            <div className="space-y-3 overflow-auto">
                {songData.map((item) => {
                    return <SingleSongCard info={item} playSound={() => {}} />;
                })}
            </div>
        </LoggedInContainer>
    );
};

export default LikedSongs;
