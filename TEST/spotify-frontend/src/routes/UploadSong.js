import {useState} from "react";
import {Icon} from "@iconify/react";
import spotify_logo from "../assets/images/spotify_logo_white.svg";
import CloudinaryUpload from "../components/shared/CloudinaryUpload";
import IconText from "../components/shared/IconText";
import TextInput from "../components/shared/TextInput";
import TextWithHover from "../components/shared/TextWithHover";
import {makeAuthenticatedPOSTRequest} from "../utils/serverHelpers";
import {useNavigate} from "react-router-dom";
import LoggedInContainer from "../containers/LoggedInContainer";
const UploadSong = () => {
    const [name, setName] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [playlistUrl, setPlaylistUrl] = useState("");
    const [uploadedSongFileName, setUploadedSongFileName] = useState();
    const [uploadedThumbnailFileName, setUploadedThumbnailFileName] = useState(); // New state for thumbnail filename
    const navigate = useNavigate();

    const submitSong = async () => {
        const data = {name, thumbnail, track: playlistUrl};
        const response = await makeAuthenticatedPOSTRequest(
            "/song/create",
            data
        );
        if (response.err) {
            alert(response.err);
            return;
        }
        alert("Success");
        navigate("/home");
    };

   
    return (
        <LoggedInContainer>
            <div className="content p-8 pt-0 overflow-auto">
                         <div className="text-2xl font-semibold mb-5 text-white mt-8">
                             Upload Your Music
                         </div>

                        <div className="w-full flex rounded-md">
                            <div className="w-1/2 pr-20 pl-10">
                               <TextInput
                                    label="Name"
                                    labelClassName={"text-white"}
                                    placeholder="Name"
                                    value={name}
                                    setValue={setName}
                                />
                            </div>
                            <div className="w-1/2 py-7 pl-20">
                            {/* Thumbnail Upload */}
                            {uploadedThumbnailFileName ? (
                                <div className="w-64 h-64 ">  {/* Example height of 48 (12rem) */}
                                <img
                                    src={thumbnail}
                                    alt={uploadedThumbnailFileName}
                                    className=" w-full h-full object-cover "
                                />
                            </div>
                            // <div className="w-1/3">
                            //     <img
                            //     src={thumbnail}
                            //     alt={uploadedThumbnailFileName}
                            //     className="bg-white rounded-md p-3 w-full h-auto"
                            //     />
                            // </div>
                            ) : (
                            <CloudinaryUpload
                                setUrl={setThumbnail}
                                setName={setUploadedThumbnailFileName}
                                text="Thumbnail"
                            />
                            )}
                            </div>
                        </div>

                        {/* Song Upload */}
                        <div className="py-5 pl-10 flex flex-col items-start">
                            {uploadedSongFileName ? (
                                <div className="bg-white rounded-full p-3 w-1/3">
                                    {uploadedSongFileName.substring(0, 35)}...
                                </div>
                            ) : (
                                <CloudinaryUpload
                                    setUrl={setPlaylistUrl}
                                    setName={setUploadedSongFileName}
                                    text="Song"
                                />
                            )}
                        </div>
                        <div className="w-full   py-5 rounded-md h-full flex flex-col items-center">
                            <div
                            style={{ backgroundColor: '#1DB954' }}
                            className=" bg-white 
                             w-40 flex items-center justify-center p-4 rounded-full cursor-pointer font-semibold"
                            onClick={submitSong}    
                            >
                            Submit Song
                            </div>
                        </div>
                    </div>
        </LoggedInContainer>
    );
};

export default UploadSong;
