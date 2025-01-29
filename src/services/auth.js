import axios from "axios";

const API_URL = "http://127.0.0.1:8000/user_profile/login";

export const login = async (loginData) => {
    try {
        const response = await axios.post(API_URL, loginData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true // ✅ Allow cookies like CSRF token to be sent automatically
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
