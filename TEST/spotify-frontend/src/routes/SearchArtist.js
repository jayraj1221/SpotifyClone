import LoggedInContainer from "../containers/LoggedInContainer";
import { useState,useEffect } from "react";
import {Icon} from "@iconify/react";
import SingleSongCard from "../components/shared/SingleSongCard";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";
import profile from "../assets/images/profile.png";
import { useNavigate } from "react-router-dom";
export const SearchArtist = ()  => 
{
    const navigate = useNavigate();
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [songData, setData] = useState([])
    const searchSong =  async (query) => {
        if(query)
        {
            const response = await makeAuthenticatedGETRequest(
                "/auth/findArtistsByName/" + query
            );
            // console.log(response.data);
            setData(response.data);
        }else{
            setData([]);
        }

    }
    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            searchSong(searchText);
        }, 300); // Debounce the search by 300ms

        return () => clearTimeout(debounceTimeout); // Clean up on unmount or change
    }, [searchText]);
    return (
        <LoggedInContainer curActiveScreen={"searchArtist"}>
            <div className="w-full py-6">
                <div
                    className={`w-1/3 p-3 text-sm rounded-full bg-gray-800 px-5 flex text-white space-x-3 items-center ${
                        isInputFocused ? "border border-white" : ""
                    }`}
                >
                    <Icon icon="ic:outline-search" className="text-lg" />
                    <input
                        type="text"
                        placeholder="What do you want to listen to?"
                        className="w-full bg-gray-800 focus:outline-none"
                        onFocus={() => {
                            setIsInputFocused(true);
                        }}
                        onBlur={() => {
                            setIsInputFocused(false);
                        }}
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                searchSong();
                            }
                        }}
                    />
                </div>
                {songData.length > 0 ? (
                    <div className="pt-10 space-y-3">
                        <div className="text-white">
                            Showing search results for
                            <span className="font-bold"> {searchText}</span>
                        </div>
                        {songData.map((item) => {
                            return (
                            <div className="w-full h-20 bg-white flex rounded-full" onClick={()=>navigate('/artistProfile',{state:{item}})}>
                                <div className="h-full w-20  flex justify-center items-center">
                                    
                                    <img src={item.profileImg?item.profileImg:profile} className="w-14 h-14 rounded-full"></img>
                                </div>
                                <div className="h-full w-full  flex items-center p-10">
                                    <div className="h-10 w-10 ">{item.firstName}</div>
                                </div>
                                
                            </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-gray-400 pt-10">
                        Nothing to show here.
                    </div>
                )}
            </div>
        </LoggedInContainer>
        // <div>HELLO MERE BHAOYo</div>
    );
}