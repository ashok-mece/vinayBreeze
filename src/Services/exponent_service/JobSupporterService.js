import axios from "../UnauthorizedAxiosResponse";
import Constants from "../../components/Constants";

const JobSupporterService = {

    createJobSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/job-supporter/create-job-support`, requestData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('breezeJwtToken')}`
                },
            });
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error(error.response.data.status);
        }
    },

    exponentRejectedJobSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/job-supporter/rejected-job-support-by-exponent-id`, requestData, {
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

    updateRejectedJobSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/job-supporter/update-rejected-job-support`, requestData, {
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

    exponentApprovedJobSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/job-supporter/approved-job-support-by-exponent-id`, requestData, {
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

    updateApprovedJobSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/job-supporter/update-approved-job-support`, requestData, {
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

    getJobSupporterBookingByExponentId: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/job-supporter/get-job-supporter-bookings`, requestData, {
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

    getTodayJobSupporterBookingByExponentId: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/job-supporter/get-today-job-supporter-bookings`, requestData, {
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

    getCompletedJobSupporterBookingByExponentId: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/job-supporter/get-job-supporter-completed-bookings`, requestData, {
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

export default JobSupporterService;