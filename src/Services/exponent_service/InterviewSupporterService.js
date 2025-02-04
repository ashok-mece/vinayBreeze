import axios from "../UnauthorizedAxiosResponse";
import Constants from "../../components/Constants";

const InterviewSupporterService = {

    createInterviewSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/interview-supporter/create-interview-support`, requestData, {
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

    exponentRejectedInterviewSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/interview-supporter/rejected-interview-support-by-exponent-id`, requestData, {
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

    updateRejectedInterviewSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/interview-supporter/update-rejected-interview-support`, requestData, {
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

    exponentApprovedInterviewSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/interview-supporter/approved-interview-support-by-exponent-id`, requestData, {
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

    updateApprovedInterviewSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/interview-supporter/update-approved-interview-support`, requestData, {
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

    getInterviewSupporterBookingByExponentId: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/interview-supporter/get-interview-supporter-bookings`, requestData, {
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

    getTodayInterviewSupporterBookingByExponentId: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/interview-supporter/get-today-interview-supporter-bookings`, requestData, {
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

    getCompletedInterviewSupporterBookingByExponentId: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/interview-supporter/get-interview-supporter-completed-bookings`, requestData, {
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

}

export default InterviewSupporterService;