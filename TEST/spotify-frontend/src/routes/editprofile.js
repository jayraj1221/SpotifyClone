import LoggedInContainer from "../containers/LoggedInContainer";
import TextInput from "../components/shared/TextInput";
import { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { makeAuthenticatedPOSTRequest } from "../utils/serverHelpers";
import CloudinaryUpload from "../components/shared/CloudinaryUpload";
import profile from "../assets/images/profile.png";
export const EditProfile = () =>
{
    const navigate = useNavigate();
    const [firstName,setfirstName] = useState('');
    const  [lastName,setlastName] = useState('');
    const [profileImg,setprofileImg] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const[thumbanailname,setUploadedThumbnailFileName]=useState('')
    useEffect(() => {
        const fetchUserData = async () => {
            const userData = localStorage.getItem("userData");
            // console.log(userData);
            if (!userData) {
                navigate("/login"); // Redirect to login if no token is found
                return;
            }
            
            try {
                // console.log("NAME")
                const { email } = JSON.parse(userData);
                const response = await makeAuthenticatedPOSTRequest("/auth/user",{email:email})
                
                if (!response) {
                    throw new Error("Failed to fetch user data"); // Handle response error
                }
                // console.log(response);
                // const data = await response.json();
                // console.log(data);
                // console.log(); // Set user data in state
                // console.log("NAME")
                setfirstName(response.firstName || '');
                setlastName(response.lastName || '');
                setprofileImg(response.profileImg || '');
            } catch (err) {
                setError(err.message); // Set error message
            } finally {
                setLoading(false); // Loading finished
            }
        };

        fetchUserData(); // Call the function to fetch user data
    }, []);
    const handleSubmit = async () => {
        // e.preventDefault();
    
        const data = {
            firstName,
            lastName,
            profileImg,
        };
        console.log(data);
        try {
            // Make the authenticated request to the backend
            const response = await makeAuthenticatedPOSTRequest("/auth/edit-profile", data);
    
            if (response) {
                const updatedUser = await response; // Get the updated user data from the response
                alert("Profile updated successfully!");
    
                // Update local storage with the new user data
                const userData = {
                    ...JSON.parse(localStorage.getItem("userData")),
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    profileImg: updatedUser.profileImg,
                };
                localStorage.setItem("userData", JSON.stringify(userData)); // Update local storage
    
                // Optionally navigate to a different page or reload
                navigate("/profile");
            } else {
                // const error = await response.json();
                alert(`Failed to update profile: ${error.err}`);
            }
        } catch (error) {
            alert(`An error occurred: ${error.message}`);
        }
    };
    
    return (
        <LoggedInContainer>
            <div className="bg-white w-full h-full flex flex-row">
                <div className="w-2/4 h-full">
                    <div className="w-full h-2/3  flex justify-center items-center">
                    <img className="bg-gray-300 w-72 h-72 rounded-full" src={profileImg?profileImg:profile} alt="NAME"></img>
                    
                    </div>
                    <div className="w-full h-1/3  flex justify-center items-center">
                        <button className="bg-white w-48 font-semibold border-4 border-green-400 h-20 flex justify-center items-center rounded-full hover:border-opacity-30" onClick={()=>setIsUploading(!isUploading)}>Upload Profile Image </button>
                        {isUploading && ( // Conditionally render Cloudinary component when isUploading is true
                        <CloudinaryUpload
                            setUrl={setprofileImg}
                            setName={setUploadedThumbnailFileName}
                            text="Profile Image"
                        />
                    )}
                    </div>
                </div>
                <div className="w-3/4 h-full bg-gray-400 input-region">
                <div className="w-full h-3/4 p-10">

                <TextInput
                label={"Firstname"}
                placeholder={"Firstname"}
                className={"my-6"}
                value={firstName}
                setValue={setfirstName}
                />
                <TextInput
                label={"Lastname"}
                placeholder={"Lastname"}
                className={"my-6"}
                value={lastName}
                setValue={setlastName}
                
                />
                <div className="w-full h-1/4 flex m-y-10  justify-center items-center">
                <button className="bg-white w-32 h-10 rounded-full border-4 border-green-400 font-semibold" onClick={handleSubmit}>
                    Update
                </button>

                </div>
                </div>
                </div>

            </div>
        </LoggedInContainer>
    );
}