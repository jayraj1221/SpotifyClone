import LoggedInContainer from "../containers/LoggedInContainer";
import { useLocation } from "react-router-dom";
import profile from "../assets/images/profile.png";
import { useState,useEffect } from "react";
import {makeAuthenticatedGETRequest} from "../utils/serverHelpers";
import SingleSongCard from "../components/shared/SingleSongCard";
export const ArtistsProfile = ()=>{
    const location = useLocation();
    const { item } = location.state || {};
    const [song,setSong] = useState([]);
    useEffect(() => {
        const getData = async () => {
            const response = await makeAuthenticatedGETRequest(
                "/song/get/artist/" +  item._id

            );
            console.log(response.data);
            setSong(response.data);
        };
        getData();
    }, []);
    return (
        <LoggedInContainer>
            <div className="w-full h-full  flex">
                <div className="w-1/3 h-full border-r-4">
                    <div className="w-full h-2/3 p-4">
                        <img src={item.profileImg?item.profileImg:profile} className="rounded-full"></img>
                    </div> 
                    <div className="w-full h-1/3 text-4xl text-white flex justify-center items-center">{item.firstName+" "}{item.lastName}</div>
                    
                </div>
                <div className="w-2/3 h-2/3">
                    <div className="w-full h-1/5 flex items-center text-4xl px-10 text-white">
                    Songs</div>
                    <div>
                        <div className="w-full h-full">
                        
                        {song.map((item) => {
    // Check if the item is valid and an object
    if (!item || typeof item !== 'object') {
        return (
            <div key={Math.random()} className="text-red-500">
                Error: Song data is not available.
            </div>
        );
    }

    // Check for the necessary properties (e.g., _id, thumbnail, title)
    const { _id, thumbnail, name } = item;
    if (!_id || !thumbnail || !name) {
        return (
            <div key={Math.random()} className="text-red-500">
                Error: Incomplete song data.
            </div>
        );
    }

    return (
        <SingleSongCard key={_id} info={item} playSound={() => {}} />
    );
})}
                        </div>
                    </div>
                </div>
            </div>
        </LoggedInContainer>
    );
}