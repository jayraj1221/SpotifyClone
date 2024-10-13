import LoggedInContainer from "../containers/LoggedInContainer";
import { useNavigate } from "react-router-dom";
import { makeAuthenticatedGETRequest, makeAuthenticatedPOSTRequest } from "../utils/serverHelpers";
import { useState,useEffect } from "react";
import profile from "../assets/images/profile.png";
export const Profile = () =>{
    const navigate = useNavigate();
    const [user, setUser] = useState(''); 
    const [loading, setLoading] = useState(true); // State to handle loading
    const [error, setError] = useState(null);
    const logout = () => {
        // Remove user data from local storage
        localStorage.removeItem("userData");
    
        // Clear the authentication token from cookies
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
        // Optionally, navigate to the login page or any other page
        navigate("/login");
    };
    useEffect(() => {
        const fetchUserData = async () => {
            const userData = localStorage.getItem("userData");
            console.log(userData);
            if (!userData) {
                navigate("/login"); // Redirect to login if no token is found
                return;
            }
            const { email } = JSON.parse(userData);
            console.log(email);
            try {
                // console.log("NAME")
                const response = await makeAuthenticatedPOSTRequest("/auth/user",{email:email})

                if (!response) {
                    throw new Error("Failed to fetch user data"); // Handle response error
                }
                console.log(response);
                // const data = await response.json();
                // console.log(data);
                setUser(response);
                // console.log(); // Set user data in state
                // console.log("NAME")
            } catch (err) {
                setError(err.message); // Set error message
            } finally {
                setLoading(false); // Loading finished
            }
        };

        fetchUserData(); // Call the function to fetch user data
    }, [navigate]);
    return (
        <LoggedInContainer>
            <div className="w-full h-full bg-white">
                <div className="h-1/5  flex justify-start p-10 items-center text-6xl ">
                    Profile
                </div>
                <div className=" w-full h-3/4 flex justify-start ">
                <div className=" w-96 flex justify-center items-center">
                <img className="w-52 h-52 rounded-full  bg-gray-800" src={user.profileImg?user.profileImg : profile}  alt="Profile Image">                       
                </img>

                </div>
                <div className=" w-full p-10 flex justify-center items-center">

                <div className=" w-full h-full flex flex-col justify-center " >
                    <div className="w-full h-4/5 flex justify-center items-center text-4xl">
                    {user ? (
            <>
                {user.firstName} {user.lastName}
            </>
        ) : (
            <span>No user data available</span>
        )}
                    </div>
                    <div className="w-full h-1/5 flex justify-center items-center">
                        <div className="w-40 h-10 m-10 bg-green-400 flex justify-center items-center border-4 border-green-400 font-semibold rounded-full" onClick={()=>navigate('/editprofile')}> Edit Profile</div>
                        <div className="w-40 h-10 m-10 bg-white flex justify-center items-center rounded-full border-4 border-red-600" onClick={()=>logout()}>Logout </div>
                    </div>

                </div>
                </div>
                </div>
            </div>
        </LoggedInContainer>
    );
}