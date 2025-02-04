import React, { useState } from 'react';
import AdminService from '../../../../../Services/admin_service/AdminService';
import Constants from '../../../../Constants';
import '../../../feature_component/fetchuser/CompanyUsersComponent.css';

// Helper function to deduplicate users
const deduplicateUsers = (users) => {
    return users.reduce((acc, user) => {
        if (!acc.find((item) => item.userId === user.userId)) {
            acc.push({
                userId: user.userId,
                name: `${user.userFirstname} ${user.userLastname}`,
                contact: `${user.phoneNumber} / ${user.username}`,
                userType: user.userType,
                exponentType: user.exponentType,
                userTechnicalStack: user.userTechincalStack,
                status: user.userStatus,
            });
        }
        return acc;
    }, []);
};

// UserTable component
const UserTable = ({ users }) => {
    if (!users || users.length === 0) {
        return <p>No users available.</p>;
    }

    return (
        <table className="styled-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
                <tr>
                    <th>#</th>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Contact & MailId</th>
                    <th>User Type</th>
                    <th>Exponent Type</th>
                    <th>Technical Stack</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user, index) => (
                    <tr key={user.userId}>
                        <td>{index + 1}</td>
                        <td>{user.userId}</td>
                        <td>{user.name}</td>
                        <td>{user.contact}</td>
                        <td>{user.userType}</td>
                        <td>{user.exponentType}</td>
                        <td>{user.userTechnicalStack}</td>
                        <td>{user.status}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

// FilterButtons component
const FilterButtons = ({ statusFilter, onFilterChange }) => {
    return (
        <div style={{ marginBottom: '20px' }}>
            <button
                onClick={() => onFilterChange('active')}
                style={{
                    padding: '5px 10px',
                    fontSize: '14px',
                    borderRadius: '5px',
                    backgroundColor: statusFilter === 'active' ? '#007bff' : '#ccc',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    marginRight: '10px',
                }}
            >
                Active
            </button>
            <button
                onClick={() => onFilterChange('inactive')}
                style={{
                    padding: '5px 10px',
                    fontSize: '14px',
                    borderRadius: '5px',
                    backgroundColor: statusFilter === 'inactive' ? '#007bff' : '#ccc',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                Inactive
            </button>
        </div>
    );
};

// Modal component
const Modal = ({ message, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>{message}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

const CompanyUsersComponent = () => {
    const [searchUsers, setSearchUsers] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [loadingBar, setLoadingBar] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const displayErrorMessage = (message) => {
        setErrorMessage(message);
        setSuccessMessage('');
        setTimeout(() => setErrorMessage(''), Constants.SET_TIME_OUT_FOR_ERROR_MSG || 3000);
    };

    const displaySuccessMessage = (message) => {
        setSuccessMessage(message);
        setErrorMessage('');
        setTimeout(() => setSuccessMessage(''), 5000); // Show success message for 5 seconds
    };

    const fetchUsersWithCompanyName = async () => {
        if (!companyName.trim()) {
            displayErrorMessage('Please enter a valid company name.');
            return;
        }

        setLoadingBar(true);
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const requestPayload = { companyName };
            const responseData = await AdminService.fetchCandidatesByCompany(requestPayload);

            if (!responseData || responseData.length === 0) {
                displayErrorMessage('No candidates found for this company.');
                setSearchUsers([]);
                return;
            }

            const uniqueData = deduplicateUsers(responseData);
            setSearchUsers(uniqueData);
            setSelectedCompany(companyName);
        } catch (error) {
            console.error(error.message);
            displayErrorMessage('users are not found for this'+companyName);
        } finally {
            setLoadingBar(false);
        }
    };

    const filterUsersByStatus = async (status) => {
        setStatusFilter(status);

        if (!companyName.trim()) {
            displayErrorMessage('Please enter a valid company name.');
            return;
        }

        // Instantly update the UI before API call
        const updatedUsers = searchUsers.filter((user) => user.status === status);
        setSearchUsers(updatedUsers);

        setLoadingBar(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await AdminService.updateUserStatusByCompany(companyName, status);
            const statusMessage = `User status has been successfully changed to ${status}.`;
            displaySuccessMessage(statusMessage);

            // Show modal message after status update
            setModalMessage(statusMessage);
            setIsModalOpen(true);  // Open the modal

            // Optionally, fetch updated users after changing the status
            fetchUsersWithCompanyName();
        } catch (error) {
            console.error(error.message);
            displayErrorMessage('users are not found for this'+companyName);
        } finally {
            setLoadingBar(false);
        }
    };

    const filteredUsers = searchUsers.filter((user) => {
        if (statusFilter === 'active') {
            return user.status === 'active';
        } else if (statusFilter === 'inactive') {
            return user.status === 'inactive';
        }
        return true;
    });

    return (
        <div>
            <h1>Company Users</h1>

            {/* Error and Success Messages */}
            {errorMessage && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>}
            {successMessage && (
                <div className="success-message" style={{ color: 'greenyellow', marginBottom: '10px', fontWeight: 'bold' }}>
                    {successMessage}
                </div>
            )}

            {/* Filter Buttons */}
            <FilterButtons statusFilter={statusFilter} onFilterChange={filterUsersByStatus} />

            {/* Search Box */}
            <div className="search-container" style={{ marginBottom: '20px' }}>
                <label htmlFor="companyName" style={{ marginRight: '10px' }}>Enter Company Name:</label>
                <input
                    type="text"
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter company name"
                    style={{
                        padding: '5px',
                        fontSize: '14px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        marginRight: '10px',
                    }}
                />
                <button
                    onClick={fetchUsersWithCompanyName}
                    style={{
                        padding: '5px 10px',
                        fontSize: '14px',
                        borderRadius: '5px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    Search
                </button>
            </div>

            {/* Loading Indicator */}
            {loadingBar && <p>Loading...</p>}

            {/* Users Table */}
            {filteredUsers.length > 0 ? (
                <div>
                    <h2>Enrolled Users for {selectedCompany}</h2>
                    <UserTable users={filteredUsers} />
                </div>
            ) : (
                !loadingBar && selectedCompany && !statusFilter && (
                    <p>No users found for the company "{selectedCompany}".</p>
                )
            )}

            {/* Modal Component */}
            {isModalOpen && (
                <Modal
                    message={modalMessage}
                    onClose={() => setIsModalOpen(false)} // Close the modal
                />
            )}
        </div>
    );
};

export default CompanyUsersComponent;
