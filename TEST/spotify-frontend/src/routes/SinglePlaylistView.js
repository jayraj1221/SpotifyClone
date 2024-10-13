import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import LoggedInContainer from "../containers/LoggedInContainer";
import {makeAuthenticatedGETRequest} from "../utils/serverHelpers";
import SingleSongCard from "../components/shared/SingleSongCard";

const SinglePlaylistView = () => {
    const [playlistDetails, setPlaylistDetails] = useState({});
    const [songData,setSong] = useState([]);
    const {playlistId} = useParams();

    useEffect(() => {
        const getData = async () => {
            const response = await makeAuthenticatedGETRequest(
                "/playlist/get/playlist/" + playlistId
            );
            
            setPlaylistDetails(response);
            console.log(response);
        };
       
        getData();
    }, []);
    useEffect(() => {
        const getSong = async () => {
            const response = await makeAuthenticatedGETRequest(
                "/playlist/get/playlist/songs/" + playlistId
            );
            
            setSong(response);
            console.log(response);
        };
        getSong();
    }, []);

    return (
        <LoggedInContainer curActiveScreen={"library"}>
            {playlistDetails._id && (
                <div>
                    <div className="text-white text-xl pt-8 font-semibold">
                        {playlistDetails.name}
                    </div>
                    <div className="pt-10 space-y-3">
                    
                        {songData.map((item) => {
                        // return <div className="text-white text-xl">HELLO</div>
                            // console.log(item);
                                return <SingleSongCard
                                    info={item}
                                    key={JSON.stringify(item)}
                                    playSound={() => {}}
                                />
                            
                        })}
                    </div>
                </div>
                // <div>HelloComponent
                //     <div>{JSON.stringify(playlistDetails)}</div>
                // </div>
                
            )}
        </LoggedInContainer>
    );
};

export default SinglePlaylistView;
