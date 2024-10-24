import {useState,useEffect} from "react";
import LoggedInContainer from "../containers/LoggedInContainer";
import {Icon} from "@iconify/react";
import {makeAuthenticatedGETRequest} from "../utils/serverHelpers";
import SingleSongCard from "../components/shared/SingleSongCard";

const SearchPage = () => {
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [songData, setSongData] = useState([]);

    const searchSong = async (query) => {
        if (query) { // Only search if query is not empty
            const response = await makeAuthenticatedGETRequest(
                "/song/get/songname/" + query
            );
            setSongData(response.data);
        } else {
            setSongData([]); // Clear songData if searchText is empty
        }
    };

    // Effect to trigger searchSong when searchText changes
    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            searchSong(searchText);
        }, 300); // Debounce the search by 300ms

        return () => clearTimeout(debounceTimeout); // Clean up on unmount or change
    }, [searchText]); // Only re-run the effect if searchText changes

    return (
        <LoggedInContainer curActiveScreen="search">
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
                                <SingleSongCard
                                    info={item}
                                    key={JSON.stringify(item)}
                                    playSound={() => {}}
                                />
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
    );
};
const SingleArtistCard = ({ info }) => {
    return (
        <div className="flex items-center space-x-3 bg-gray-700 p-3 rounded-lg">
            <img src={info.image} alt={info.name} className="w-10 h-10 rounded-full" />
            <div>
                <div className="text-white font-bold">{info.name}</div>
                <div className="text-gray-400">{info.songs.length} songs</div>
            </div>
        </div>
    );
};

export default SearchPage;
