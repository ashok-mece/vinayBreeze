import axios from "../UnauthorizedAxiosResponse";
import Constants from "../../components/Constants";

const GlobalService = {

    getAllTechnology: async () => {
        try {
            const response = await axios.get(`${Constants.BASE_URL}/global/get-all-technologies`, {
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

    getAllCourse: async () => {
        try {
            const response = await axios.get(`${Constants.BASE_URL}/global/get-all-courses`, {
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

    getTechStackByExponentId: async (request) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/global/get-technical-stack-by-exponent-id`,request, {
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

    getCourseContentByPath: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/global/get-course-content-by-path`, requestData, {
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('breezeJwtToken')}`
                },
                responseType: 'blob'
            });
            return response;
        } catch (error) {
            console.log(error);
            throw new Error(error.response.data.status);
        }
    },

    getIntroVideoByPath: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/global/get-intro-video-by-path`, requestData, {
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('breezeJwtToken')}`
                },
                responseType: 'blob'
            });
            return response;
        } catch (error) {
            console.log(error);
            throw new Error(error.response.data.status);
        }
    },

    searchTrainingsByTechnologies: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/global/search-trainings-by-technologies`, requestData, {
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

    getAllTimeSlot: async () => {
        try {
            const response = await axios.get(`${Constants.BASE_URL}/global/get-all-time-slot`, {
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

    searchInterviewSupportsByTechnologies: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/global/search-interview-supports-by-technologies`, requestData, {
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

    getAllJobSupportTimeSlot: async () => {
        try {
            const response = await axios.get(`${Constants.BASE_URL}/global/get-all-job-support-time-slot`, {
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

    searchJobSupportsByTechnologies: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/global/search-job-supports-by-technologies`, requestData, {
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

    searchTrainingsByCourses: async (requestData) => {
        try {
            const companyName = localStorage.getItem('breezeCompanyName'); // Retrieve company name from localStorage
    
            const response = await axios.post(
                `${Constants.BASE_URL}/global/search-trainings-by-courses?companyName=${encodeURIComponent(companyName)}`, // Add companyName as a query parameter
                requestData, // Send the requestData in the body
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('breezeJwtToken')}`
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error(error.response.data.status);
        }
    },
    

}

export default GlobalService;