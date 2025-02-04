import { Navigate } from "react-router-dom";

const RoleBasedRoute = ({ element, allowedRoles }) => {

    const userType = localStorage.getItem("breezeUserType");

    if (!allowedRoles.includes(userType)) {
        return <Navigate to="/dashboard" />;
    }

    return element;

}

export default RoleBasedRoute;