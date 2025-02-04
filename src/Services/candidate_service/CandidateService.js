import axios from "../UnauthorizedAxiosResponse";
import Constants from "../../components/Constants";

 const CandidateService = {

    enrollCandidateForTraining: async (requestData) => {
        try {
            const companyName = localStorage.getItem('breezeCompanyName'); // Retrieve company name from localStorage
    
            const response = await axios.post(
                `${Constants.BASE_URL}/candidate/enroll-candidate-for-training?companyName=${encodeURIComponent(companyName)}`, // Append companyName as query parameter
                requestData, // Send the original requestData in the body
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
    

    enrolledTrainings: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/candidate/enrolled-trainings-by-candidate-id`, requestData, {
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

    candidateStartedTrainings: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/candidate/started-trainings-by-candidate-id`, requestData, {
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

    candidateCompletedTrainings: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/candidate/completed-trainings-by-candidate-id`, requestData, {
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

    rateTraining: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/candidate/rate-training`, requestData, {
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

    // Interview Support Api's
    viewCandidateSelectedInterviewSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/candidate/view-candidate-selected-interview-support`, requestData, {
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

    loadAvailableSlotsOnSelectedDate: async (formData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/candidate/load-available-slots-on-selected-date`, formData, {
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('breezeJwtToken')}`,
                    'Content-Type': 'multipart/form-data'
                },
            });
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error(error.response.data.status);
        }
    },

    confirmInterviewSupportBooking: async (formData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/candidate/confirm-interview-support-booking`, formData, {
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('breezeJwtToken')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error(error.response.data.status);
        }
    },

    getCandidateInterviewSupportBookingByCandidateId: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/candidate/get-candidate-interview-support-bookings-by-candidate-id`, requestData, {
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

    cancelInterviewSupportBooking: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/candidate/cancel-interview-support-booking`, requestData, {
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

    getTodayCandidateInterviewSupportBookingByCandidateId: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/candidate/get-today-candidate-interview-support-bookings-by-candidate-id`, requestData, {
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

    getCandidateCompletedInterviewSupportBookingByCandidateId: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/candidate/get-candidate-completed-interview-support-bookings-by-candidate-id`, requestData, {
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

    rateInterviewSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/candidate/rate-interview-support`, requestData, {
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

    rescheduleInterviewSupportBooking: async (formData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/candidate/reschedule-interview-support-booking`, formData, {
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('breezeJwtToken')}`,
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error(error.response.data.status);
        }
    },

    // Job Support Api's
    viewCandidateSelectedJobSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/candidate/view-candidate-selected-job-support`, requestData, {
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

    loadAvailableSlotsOnJobSupportId: async (formData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/candidate/load-available-slots-on-job-support-id`, formData, {
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

    confirmJobSupportBooking: async (formData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/candidate/confirm-job-support-booking`, formData, {
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

    getCandidateJobSupportBookingByCandidateId: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/candidate/get-candidate-job-support-bookings-by-candidate-id`, requestData, {
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

    cancelJobSupportBooking: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/candidate/cancel-job-support-booking`, requestData, {
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

    rescheduleJobSupportBooking: async (formData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/candidate/reschedule-job-support-booking`, formData, {
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('breezeJwtToken')}`,
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error(error.response.data.status);
        }
    },

    stopJobSupportBooking: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/candidate/stop-job-support-booking`, requestData, {
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

    continueJobSupportBooking: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/candidate/continue-job-support-booking`, requestData, {
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

    getTodayCandidateJobSupportBookingByCandidateId: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/candidate/get-today-candidate-job-support-bookings-by-candidate-id`, requestData, {
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

    getCandidateCompletedJobSupportBookingByCandidateId: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/candidate/get-candidate-completed-job-support-bookings-by-candidate-id`, requestData, {
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

    rateJobSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/candidate/rate-job-support`, requestData, {
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

    confirmAssignNewJobSupporter: async (formData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/candidate/confirm-assign-new-job-supporter`, formData, {
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
    
 }

 export default CandidateService;