import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Initialize states
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null); // userData starts as null

  // userAuthenticate function to check if the user is logged in by calling API
  const userAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/auth/is-auth", {
        withCredentials: true, // Ensure cookies are sent with request
      });

      if (data.success) {
        setIsLoggedin(true);
        getUserData(); // If user is authenticated, fetch their data
      }
    } catch (error) {
      setIsLoggedin(false);
      toast.error(error.message || "Authentication failed.");
    }
  };

  // Load user data from localStorage and check if already logged in
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    const token = localStorage.getItem("authToken"); // Get token from localStorage

    // Check if user data and token exist in localStorage
    if (storedUserData && token) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      setIsLoggedin(true);
      axios.defaults.headers["Authorization"] = `Bearer ${token}`; // Set token in header
    }

    // Always check for user authentication state when app loads
    userAuthState();
  }, []);

  // Function to get user data from the backend
  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data", {
        withCredentials: true, // Ensure cookies are sent with request
      });

      if (data.success) {
        setUserData(data.userData);
        localStorage.setItem("userData", JSON.stringify(data.userData)); // Persist user data in localStorage
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      toast.error(errorMessage);
    }
  };

  // Provide context values to be accessible throughout the app
  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
