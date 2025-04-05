import { API } from "../context/axiosInstance";
import axios from "axios";

export const handleLogin = (
  username: string,
  password: string,
  onLogin: () => void,
  setUser: React.Dispatch<React.SetStateAction<any>>,
  setToken: React.Dispatch<React.SetStateAction<any>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  setLoading: React.Dispatch<React.SetStateAction<any>>
) => {
  axios
    .post("http://localhost:5000/api/v1/auth/login", { email: username, password })
    .then((response) => {
      if (response.data.success && response.data.user) {
        const user = response.data.user;

        // ✅ Check if the user's status is inactive
        if (user.status === "Inactive") {
          setErrorMessage("Your account is inactive. Please seek assistance from MIS");
          return;
        }

        onLogin();
        setUser(user); 
        setToken(response.data.token);       
      } else {
        setErrorMessage(response.data.message || "Invalid credentials.");
      }
    })
    .catch((error) => {
      const message = error.response?.data?.message || "An error occurred.";
      setErrorMessage(message);
    })
    .finally(() => setLoading(false));
};

export const handleRegister = (
  email: string,
  password: string,
  role: string,
  name: string,
  studentId: string,
  setRegister: React.Dispatch<React.SetStateAction<any>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  axios
    .post("http://localhost:5000/api/v1/auth/register", { email, password, role, name, studentId })
    .then((response) => {
      if (response.data.success && response.data.user) {
        setRegister(response.data.user); 
      } else {
        setErrorMessage(response.data.message || "Invalid credentials.");
      }
    })
    .catch((error) => {
      const message = error.response?.data?.message || "An error occurred.";
      setErrorMessage(message);
    });
};

export const handlePending = (
  setPending: React.Dispatch<React.SetStateAction<any>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  API
    .get("user/getPendingUsers")
    .then((response) => {
      if (response.data.success) {
        setPending(response.data.pending); 
      } else {
        setErrorMessage(response.data.message || "Invalid credentials.");
      }
    })
    .catch((error) => {
      const message = error.response?.data?.message || "An error occurred.";
      setErrorMessage(message);
    });
}

export const getAllUsers = ( 
  setUsers: React.Dispatch<React.SetStateAction<any>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  API
    .get("/user/getAllUsers")
    .then((response) => {
      if (response.data.success) {
        setUsers(response.data.users); 
      } else {
        setErrorMessage(response.data.message || "Invalid credentials.");
      }
    })
    .catch((error) => {
      const message = error.response?.data?.message || "An error occurred.";
      setErrorMessage(message);
    });
  }

