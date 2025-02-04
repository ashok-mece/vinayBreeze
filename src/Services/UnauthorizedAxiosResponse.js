import axios from "axios";

axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response && error.response.status === 401 && error.response.data === ' Access Denied !! Full authentication is required to access this resource' ) {
            localStorage.removeItem('breezeUserId');
            localStorage.removeItem('breezeUserType');
            localStorage.removeItem('breezeUsername');
            localStorage.removeItem('breezeUserFullName');
            localStorage.removeItem('breezeUserFirstTimeLogin');
            localStorage.removeItem('breezeExponentType');
            localStorage.removeItem('breezeJwtToken');
            localStorage.removeItem('breezeSelectedExponentType');

            window.location.href = '/session-expired';
        }else {
            return Promise.reject(error);
        }
    }
);

export default axios;