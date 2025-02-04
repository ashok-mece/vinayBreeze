import axios from "../UnauthorizedAxiosResponse";
import Constants from "../../components/Constants";

const UserService = {

    registerUser: async (userData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/user/register-user`, userData);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.status);
        }
    },

    getUserDataByUserId: async (userData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/user/get-user`, userData, {
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('breezeJwtToken')}`
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.status);
        }
    },

    resendOtp: async (userData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/user/resend-otp`, userData);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.status);
        }
    },

    verifyEmail: async (userData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/user/confirm-register`, userData);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.status);
        }
    },

    loginUser: async (userData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/user/login`, userData);
            const jwtToken = response.data.breezeJwtToken;
            localStorage.setItem('breezeJwtToken', jwtToken);
            return response.data;
        } catch (error) {
            if(' Access Denied !! User not found !!' === error.response.data || ' Access Denied !! Invalid username or password !!' === error.response.data){
                throw new Error(error.response.data); // new change error.response.data in place of error.response.data.status
            }else {
                throw new Error(error.response.data.status); // new change error.response.data in place of error.response.data.status
            }
        }
    },

    mandatoryUpdateFields: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/user/mandatory-update-fields`, requestData, {
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('breezeJwtToken')}`
                },
            });
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error(error.response.data.status);
        }
    },

    verifyMailForResetPassword: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/user/verify-mail-for-reset-password`, requestData);
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error(error.response.data.status);
        }
    },

    resetPassword: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/user/reset-password`, requestData);
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error(error.response.data.status);
        }
    },

    updateUserDetails: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/user/update-user-details`, requestData, {
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('breezeJwtToken')}`
                },
            });
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error(error.response.data.status);
        }
    },

    sendOtpToPhoneNumber: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/user/send-otp-to-phone-number`, requestData, {
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('breezeJwtToken')}`
                },
            });
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error(error.response.data.status);
        }
    },

    verifyOtpToPhoneNumber: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/user/verify-otp-to-phone-number`, requestData, {
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('breezeJwtToken')}`
                },
            });
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error(error.response.data.status);
        }
    },

    sendOtpToMail: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/user/send-otp-to-mail`, requestData, {
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('breezeJwtToken')}`
                },
            });
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error(error.response.data.status);
        }
    },

    verifyOtpToMail: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/user/verify-otp-to-mail`, requestData, {
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('breezeJwtToken')}`
                },
            });
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error(error.response.data.status);
        }
    },

    createAdmin: async (userData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/user/create-admin`, userData, {
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('breezeJwtToken')}`
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.status);
        }
    },

    verifyAdmin: async (userData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/user/verify-admin`, userData, {
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('breezeJwtToken')}`
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.status);
        }
    },

}

export default UserService;