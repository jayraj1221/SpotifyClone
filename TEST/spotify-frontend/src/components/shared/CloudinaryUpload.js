import {openUploadWidget} from "../../utils/CloudinaryService";
// import {cloudinary_upload_preset} from "../../config";

const CloudinaryUpload = ({setUrl, setName,text}) => {
    const uploadImageWidget = () => {
        let myUploadWidget = openUploadWidget(
            {
                cloudName: "dqda0begs",
                uploadPreset: 'uuj1dwjc',
                sources: ["local"],
            },
            function (error, result) {
                if (!error && result.event === "success") {
                    setUrl(result.info.secure_url);
                    setName(result.info.original_filename);
                } else {
                    if (error) {
                        console.log(error);
                    }
                }
            }
        );
        myUploadWidget.open();
    };

    return (
        <button
            className="bg-white text-black  rounded-full p-4 font-semibold"
            onClick={uploadImageWidget}
        >
            Select {text}
        </button>
    );
};

export default CloudinaryUpload;
