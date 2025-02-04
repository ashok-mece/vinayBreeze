import axios from "../UnauthorizedAxiosResponse";
import Constants from "../../components/Constants";

const AdminService = {

    addTechnology: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/add-technology`, requestData, {
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

    createCourse: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/create-course`, requestData, {
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
    

    viewHoldTraining: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/view-hold-training-by-id`, requestData, {
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

    changeAdminStatus: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/change-admin-status-for-training`, requestData, {
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

    addSampleIntroVideo: async (formData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/add-sample-intro-video`, formData, {
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

    enrolledTrainings: async (requestData) => {
        try {
            const companyName = localStorage.getItem('breezeCompanyName'); // Retrieve company name from localStorage
    
            const response = await axios.get(
                `${Constants.BASE_URL}/admin/enrolled-trainings?page=${requestData.page}&size=${requestData.size}&companyName=${encodeURIComponent(companyName)}`, 
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
    

    viewEnrolledCandidatesByTrainingId: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/view-enrolled-candidates-by-training-id`, requestData, {
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

    confirmOrWithdrawEnrolledCandidate: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/confirm-or-withdraw-enrolled-candidate`, requestData, {
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

    updateDateForTraining: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/update-date-for-training`, requestData, {
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

    stopEnrollmentForTraining: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/stop-enrollment-for-training`, requestData, {
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

    getStartedTrainings: async () => {
        try {
            const companyName = localStorage.getItem('breezeCompanyName'); // Retrieve company name from localStorage
    
            const response = await axios.get(
                `${Constants.BASE_URL}/admin/started-trainings?companyName=${encodeURIComponent(companyName)}`, // Add companyName as a query parameter
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('breezeJwtToken')}`
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching started trainings:", error);
            throw new Error(error.response?.data?.status || "An unexpected error occurred");
        }
    },
    
    

    viewMoreStartedTrainingInfo: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/view-more-started-training-info`, requestData, {
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

    uploadMeetingLink: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/upload-meeting-link`, requestData, {
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

    removeMeetingLink: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/remove-meeting-link`, requestData, {
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

    updateEndDateForTraining: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/update-course-end-date`, requestData, {
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

    monthlyCompletedTrainings: async (requestData) => {
        try {
            const companyName = localStorage.getItem('breezeCompanyName'); // Retrieve company name from localStorage
    
            const response = await axios.post(
                `${Constants.BASE_URL}/admin/monthly-completed-trainings?companyName=${encodeURIComponent(companyName)}`, // Add companyName as a query parameter
                requestData, // Send requestData in the body
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('breezeJwtToken')}`
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching monthly completed trainings:", error);
            throw new Error(error.response?.data?.status || "An unexpected error occurred");
        }
    },
    

    viewEnrolledCandidatesForCompletedTraining: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/view-enrolled-candidates-for-completed-training`, requestData, {
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

    // Interview Support
    getHoldInterviewSupportingsOnPage: async (requestData) => {
        try {
            const response = await axios.get(`${Constants.BASE_URL}/admin/get-hold-interview-supportings-on-page?page=${requestData.page}&size=${requestData.size}`, {
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

    viewHoldInterviewSupporting: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/view-hold-interview-supporting-by-id`, requestData, {
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

    changeAdminStatusForInterviewSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/change-admin-status-for-interview-support`, requestData, {
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

    getHoldUpdatedInterviewSupportingsOnPage: async (requestData) => {
        try {
            const response = await axios.get(`${Constants.BASE_URL}/admin/get-hold-updated-interview-supportings-on-page?page=${requestData.page}&size=${requestData.size}`, {
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

    viewHoldUpdatedInterviewSupporting: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/view-hold-updated-interview-supporting-by-id`, requestData, {
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

    changeAdminStatusForUpdatedInterviewSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/change-admin-status-for-updated-interview-support`, requestData, {
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

    getHoldBookedInterviewSupportingsOnPage: async (requestData) => {
        try {
            const response = await axios.get(`${Constants.BASE_URL}/admin/get-hold-booked-interview-supports?page=${requestData.page}&size=${requestData.size}`, {
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

    viewHoldBookedInterviewSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/view-hold-booked-interview-support`, requestData, {
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

    confirmOrWithdrawBookedInterviewSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/confirm-or-withdraw-booked-interview-support`, requestData, {
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

    getTodayInterviewSupportBookings: async () => {
        try {
            const response = await axios.get(`${Constants.BASE_URL}/admin/get-today-interview-supportings`, {
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

    adminViewTodayInterviewSupportBookingByBookingId: async (request) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/admin-view-today-interview-support-by-booking-id`, request, {
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

    uploadInterviewSupportMeetingLink: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/upload-interview-support-meeting-link`, requestData, {
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

    removeInterviewSupportMeetingLink: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/remove-interview-support-meeting-link`, requestData, {
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

    monthlyCompletedInterviewSupportBookings: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/monthly-completed-interview-support-bookings`, requestData, {
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

    viewMoreCompletedInterviewSupportInfo: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/admin-view-completed-interview-support-by-booking-id`, requestData, {
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

    getHoldRescheduledInterviewSupportingsOnPage: async (requestData) => {
        try {
            const response = await axios.get(`${Constants.BASE_URL}/admin/get-hold-rescheduled-interview-supports?page=${requestData.page}&size=${requestData.size}`, {
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

    viewHoldRescheduledInterviewSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/view-hold-rescheduled-interview-support`, requestData, {
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

    confirmOrWithdrawRescheduledInterviewSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/confirm-or-withdraw-rescheduled-interview-support`, requestData, {
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

    // search users
    searchUsers: async (search) => {
        try {
            const response = await axios.get(`${Constants.BASE_URL}/admin/search-Users`, {
                params: { search },
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

    changeUserStatus: async (request) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/change-user-status`, request, {
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

    // Job Support
    getHoldJobSupportingsOnPage: async (requestData) => {
        try {
            const response = await axios.get(`${Constants.BASE_URL}/admin/get-hold-job-supportings-on-page?page=${requestData.page}&size=${requestData.size}`, {
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

    viewHoldJobSupporting: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/view-hold-job-supporting-by-id`, requestData, {
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

    changeAdminStatusForJobSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/change-admin-status-for-job-support`, requestData, {
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

    getHoldUpdatedJobSupportingsOnPage: async (requestData) => {
        try {
            const response = await axios.get(`${Constants.BASE_URL}/admin/get-hold-updated-job-supportings-on-page?page=${requestData.page}&size=${requestData.size}`, {
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

    viewHoldUpdatedJobSupporting: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/view-hold-updated-job-supporting-by-id`, requestData, {
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

    changeAdminStatusForUpdatedJobSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/change-admin-status-for-updated-job-support`, requestData, {
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

    getHoldBookedJobSupportingsOnPage: async (requestData) => {
        try {
            const response = await axios.get(`${Constants.BASE_URL}/admin/get-hold-booked-job-supports?page=${requestData.page}&size=${requestData.size}`, {
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

    viewHoldBookedJobSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/view-hold-booked-job-support`, requestData, {
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

    confirmOrWithdrawBookedJobSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/confirm-or-withdraw-booked-job-support`, requestData, {
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

    getHoldRescheduledJobSupportingsOnPage: async (requestData) => {
        try {
            const response = await axios.get(`${Constants.BASE_URL}/admin/get-hold-rescheduled-job-supports?page=${requestData.page}&size=${requestData.size}`, {
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

    viewHoldRescheduledJobSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/view-hold-rescheduled-job-support`, requestData, {
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

    confirmOrWithdrawRescheduledJobSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/confirm-or-withdraw-rescheduled-job-support`, requestData, {
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

    getHoldStoppedJobSupportingsOnPage: async (requestData) => {
        try {
            const response = await axios.get(`${Constants.BASE_URL}/admin/get-hold-stopped-job-supports?page=${requestData.page}&size=${requestData.size}`, {
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

    viewHoldStoppedJobSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/view-hold-stopped-job-support`, requestData, {
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

    confirmOrWithdrawStoppedJobSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/confirm-or-withdraw-stopped-job-support`, requestData, {
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

    getHoldContinuedJobSupportingsOnPage: async (requestData) => {
        try {
            const response = await axios.get(`${Constants.BASE_URL}/admin/get-hold-continued-job-supports?page=${requestData.page}&size=${requestData.size}`, {
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

    viewHoldContinuedJobSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/view-hold-continued-job-support`, requestData, {
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

    confirmOrWithdrawContinuedJobSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/confirm-or-withdraw-continued-job-support`, requestData, {
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

    getTodayJobSupportBookings: async () => {
        try {
            const response = await axios.get(`${Constants.BASE_URL}/admin/get-today-job-supportings`, {
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

    adminViewTodayJobSupportBookingByBookingId: async (request) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/admin-view-today-job-support-by-booking-id`, request, {
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

    uploadJobSupportMeetingLink: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/upload-job-support-meeting-link`, requestData, {
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

    removeJobSupportMeetingLink: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/remove-job-support-meeting-link`, requestData, {
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

    monthlyCompletedJobSupportBookings: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/monthly-completed-job-support-bookings`, requestData, {
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

    viewMoreCompletedJobSupportInfo: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/admin-view-completed-job-support-by-booking-id`, requestData, {
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

    getHoldAssignedJobSupportingsOnPage: async (requestData) => {
        try {
            const response = await axios.get(`${Constants.BASE_URL}/admin/get-hold-assigned-job-supports?page=${requestData.page}&size=${requestData.size}`, {
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

    viewHoldAssignedJobSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/view-hold-assigned-job-support`, requestData, {
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

    confirmOrWithdrawAssignedJobSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/confirm-or-withdraw-assigned-job-support`, requestData, {
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

    stopJobSupport: async (requestData) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/admin/admin-stop-job-support`, requestData, {
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

    fetchCandidatesByCompany: async (requestPayload) => {
        try {
            const response = await axios.post(`${Constants.BASE_URL}/user/fetch-candidates-by-company`, requestPayload, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('breezeJwtToken')}` // Add JWT token for authorization
                },
            });
            console.log(response.data);
            return response.data; // Assuming the API returns a JSON response
        } catch (error) {
            console.error('Error in fetchCandidatesByCompany:', error);
            // Throwing the error message or status
            throw new Error(error.response?.data?.status || "An error occurred");
        }
    },

    updateUserStatusByCompany: async (companyName, status) => {
        try {
            const url = `${Constants.BASE_URL}/user/updateUserStatusByCompany?companyName=${encodeURIComponent(companyName)}&status=${encodeURIComponent(status)}`;
    
            const response = await axios.post(
                url, // URL with query parameters
                {}, // Empty body since we are passing data in the URL
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('breezeJwtToken')}` // Add JWT token for authorization
                    },
                }
            );
    
            console.log('Response data:', response.data);
            return response.data; // Return the response data, assuming it's a list of updated users
        } catch (error) {
            console.error('Error in updateUserStatusByCompany:', error);
            // Throwing the error with a meaningful message
            throw new Error(
                error.response?.data?.message || 'Network error occurred while updating user statuses.'
            );
        }
    }
    

}

export default AdminService;