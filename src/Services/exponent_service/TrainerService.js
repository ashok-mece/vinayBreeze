
import axios from "../UnauthorizedAxiosResponse";
import Constants from "../../components/Constants";

const TrainerService = {

    createTraining: async (formData) => {
        try {
            const companyName = localStorage.getItem('breezeCompanyName'); // Retrieve company name from localStorage
    
            // Append companyName to formData
            formData.append('companyName', companyName);
    
            const response = await axios.post(`${Constants.BASE_URL}/trainer/create-training`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('breezeJwtToken')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error(error.response?.data?.status || "An error occurred");
        }
    },
    

    
    getHoldTrainingsOnPage: async (requestData) => {
        try {
            const companyName = localStorage.getItem('breezeCompanyName'); // Retrieve company name from localStorage
            const response = await axios.get(`${Constants.BASE_URL}/admin/get-hold-trainings-on-page?page=${requestData.page}&size=${requestData.size}&companyName=${companyName}`, {
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

    getRejectedTrainingByExponentId: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/trainer/rejected-trainings-by-exponent-id`, requestData, {
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

    updateTrainingByTrainingId: async (requestData) => {
        try {
            // Retrieve companyName from localStorage
            const companyName = localStorage.getItem('breezeCompanyName');
    
            // Construct the API URL with companyName as a query parameter
            const apiUrl = `${Constants.BASE_URL}/trainer/update-training-by-training-id?companyName=${companyName}`;
    
            // Send the request
            const response = await axios.post(apiUrl, requestData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('breezeJwtToken')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error(error.response?.data?.status || "Unknown error occurred");
        }
    },
    
    
    

    getApprovedTrainingByExponentId: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/trainer/approved-trainings-by-exponent-id`, requestData, {
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

    getStartedTrainingByExponentId: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/trainer/started-trainings-by-exponent-id`, requestData, {
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('breezeJwtToken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error(error.response.data.status);
        }
    },

    getCompletedTrainingByExponentId: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/trainer/completed-trainings-by-exponent-id`, requestData, {
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

export default TrainerService;