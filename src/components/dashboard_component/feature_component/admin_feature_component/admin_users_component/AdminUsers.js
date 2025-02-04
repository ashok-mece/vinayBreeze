import { useState } from 'react';
import './AdminUsers.css';
import Multiselect from 'multiselect-react-dropdown';
import AdminService from '../../../../../Services/admin_service/AdminService';
import UserService from '../../../../../Services/user_service/UserService';
import { Button, Card, Col, Row } from 'react-bootstrap';
import LoadingBar from '../../../../loading_bar_component/LoadingBar';
import Constants from '../../../../Constants';

function AdminUsers() {

    const childColor = getComputedStyle(document.documentElement).getPropertyValue('--child-color');
    const [loadingBar, setLoadingBar] = useState(false);

    const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const fetchUsers = async (search) => {
        setLoadingBar(true);
        try {
            const responseData = await AdminService.searchUsers(search);
            const formattedUsers = responseData.map(user => ({
                id: user.userId,
                userData: `${user.userId} ${user.userFirstname} ${user.userLastname}  ${user.phoneNumberWithCountryCode}`, // Two spaces between name and phone
            }));
            setOptions(formattedUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoadingBar(false);
        }
    };

    const handleSearch = (searchValue) => {
        fetchUsers(searchValue);
    };

    const onSelect = (selectedList, selectedItem) => {
        setSelectedOptions(selectedList);
    };

    const onRemove = (selectedList, removedItem) => {
        setSelectedOptions(selectedList);
        setSelectedUser(null);
    };

    const [selectedUser, setSelectedUser] = useState(null);
    const getSelectedUser = async () => {
        if (selectedOptions.length === 0) {
            setOptions([]);
        } else {
            setLoadingBar(true);
            const request = {
                userId: selectedOptions[0]?.id
            }
            try {
                const responseData = await UserService.getUserDataByUserId(request);
                setSelectedUser(responseData);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoadingBar(false);
            }
        }
    }

    const changeUserStatus = async (status) => {
        setLoadingBar(true);
        const request = {
            userId: selectedUser.userId,
            userStatus: status
        }
        try {
            const responseData = await AdminService.changeUserStatus(request);
            setSelectedUser(responseData);
            changeUserStatusDisplaySucMsg('User is ' + responseData.userStatus);
        } catch (error) {
            console.error('Error fetching users:', error);
            handleChangeUserStatusErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }

    const handleChangeUserStatusErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            changeUserStatusDisplayErrMsg("Invalid Request");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            changeUserStatusDisplayErrMsg("User Not Found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            changeUserStatusDisplayErrMsg("Sorry, Our service is down");
        else
            changeUserStatusDisplayErrMsg("Could not process your request");
    }

    // err msg
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const changeUserStatusDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    const changeUserStatusDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
            setMessageColor(Constants.MESSAGE_COLOR);
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }

    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div className='admin-search-users'>
            {loadingBar && <LoadingBar />}
            <label>Search Users with Id(complete Id should be given) or First-Name or Last-Name or Phone-Number</label>
            <Row className='d-flex justify-content-between flex-wrap'>
                <Col xs={12} sm={8} className='mb-2'>
                    <Multiselect
                        id='technology'
                        options={options}
                        onSelect={onSelect}
                        onRemove={onRemove}
                        displayValue="userData"
                        placeholder="Search Users"
                        avoidHighlightFirstOption={true}
                        onSearch={handleSearch}
                        selectionLimit={1}
                        style={{
                            chips: {
                                background: childColor,
                            },
                        }}
                    />
                </Col>
                <Col xs={12} sm={4} className='mb-2'>
                    <Button
                        className='search-button-horizontal'
                        onClick={getSelectedUser}
                    >
                        Search
                    </Button>
                </Col>
            </Row>
            {selectedUser && (
                <div className='mt-2'>
                    <Card style={{ margin: '0.5rem', fontSize: '12px' }} className='card'>
                        <Card.Body>
                            <Card.Text>
                                <label>User-Id : </label> <span>{selectedUser.userId}</span> <br />
                                <label>Full-Name : </label> <span>{selectedUser.userFirstname + " " + selectedUser.userLastname}</span> <br />
                                <label>User-Type : </label> <span>{selectedUser.userType}</span> <br />
                                {selectedUser.userType === Constants.EXPONENT && (
                                    <>
                                        <label>Exponent-Type : </label> <span>{(selectedUser.exponentType)}</span> <br />
                                        <label>Technical-Stack : </label> <span>{(selectedUser.technologyList ? selectedUser.technologyList.map(tech => tech.technologyName).join(", ") : 'Not Provided')}</span> <br />
                                        <label>Experience : </label> <span>{(selectedUser.userExperience ? selectedUser.userExperience + ' years' : 'Not Provided')}</span> <br />
                                    </>
                                )}
                                <label>Mail-Id : </label> <span>{selectedUser.username}</span> <br />
                                <label>Phone-Number : </label> <span>{(selectedUser.phoneNumberWithCountryCode ? selectedUser.phoneNumberWithCountryCode : 'Not Provided')}</span> <br />
                                {selectedUser.userType !== Constants.ADMIN && (
                                    <>
                                        <label>Gender : </label> <span>{(selectedUser.gender ? selectedUser.gender : 'Not Provided')}</span> <br />
                                        <label>City : </label> <span>{(selectedUser.city ? selectedUser.city : 'Not Provided')}</span> <br />
                                        <label>State : </label> <span>{(selectedUser.state ? selectedUser.state : 'Not Provided')}</span> <br />
                                        <label>Country : </label> <span>{(selectedUser.country ? selectedUser.country : 'Not Provided')}</span> <br />
                                    </>
                                )}
                                <div className='mt-2'>
                                    <label>User Status : </label> <span style={{ marginRight: '20px' }}>{selectedUser.userStatus}</span>
                                    {selectedUser.userStatus === 'ACTIVE' ? (
                                        <button className='dashboard-button' onClick={() => changeUserStatus('INACTIVE')}>Make InActive</button>
                                    ) : (
                                        <button className='dashboard-button' onClick={() => changeUserStatus('ACTIVE')}>Make Active</button>
                                    )}
                                </div>
                                <div className='mt-1'>
                                    {errMsgDiv &&
                                        <div style={customCssForMsg}>
                                            <label>{errMsg}</label>
                                        </div>}
                                </div>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default AdminUsers;