import {useState} from "react";
import TextInput from "../components/shared/TextInput";
import {makeAuthenticatedPOSTRequest} from "../utils/serverHelpers";
import CloudinaryUpload from "../components/shared/CloudinaryUpload";
const CreatePlaylistModal = ({closeModal}) => {
    const [playlistName, setPlaylistName] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [uploadedThumbnailFileName, setUploadedThumbnailFileName] = useState();
    const createPlaylist = async () => {
        const response = await makeAuthenticatedPOSTRequest(
            "/playlist/create",
            {name: playlistName, thumbnail: thumbnail, songs: []}
        );
        if (response._id) {
            closeModal();
        }
    };

    return (
        <div
            className="absolute bg-black w-screen h-screen bg-opacity-50 flex justify-center items-center"
            onClick={closeModal}
        >
            <div
                className="bg-app-black w-1/3 rounded-md p-8"
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <div className="text-white mb-5 font-semibold text-lg">
                    Create Playlist
                </div>
                <div className="space-y-4 flex flex-col justify-center items-center">
                    <TextInput
                        label="Name"
                        labelClassName={"text-white"}
                        placeholder="Playlist Name"
                        value={playlistName}
                        setValue={setPlaylistName}
                    />
                     <div className="w-full flex flex-col items-center">
                            {/* Thumbnail Upload */}
                            {uploadedThumbnailFileName ? (
                                <div className="w-64 h-64 ">  {/* Example height of 48 (12rem) */}
                                <img
                                    src={thumbnail}
                                    alt={uploadedThumbnailFileName}
                                    className=" w-full h-full object-cover "
                                />
                            </div>
                            ) : (
                            <CloudinaryUpload
                                setUrl={setThumbnail}
                                setName={setUploadedThumbnailFileName}
                                text="Thumbnail"
                            />
                            )}
                            </div>
                    <div
                        className="bg-white w-1/3 rounded flex font-semibold justify-center items-center py-3 mt-4 cursor-pointer"
                        onClick={createPlaylist}
                    >
                        Create
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePlaylistModal;
