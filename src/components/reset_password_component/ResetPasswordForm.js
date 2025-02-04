import { useState } from 'react';
import './ResetPassword.css';
import Constants from '../Constants';
import LoadingBar from '../loading_bar_component/LoadingBar';
import UserService from '../../Services/user_service/UserService';

function ResetPasswordForm() {

    const [loadingBar, setLoadingBar] = useState(false);

    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [resetPasswordFormData, setResetPasswordFormData] = useState({
        username: '',
        emailOtp: '',
        password: '',
        confirmPassword: '',
    });

    //Fields for to display err msg div and label
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const passwordPatternRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,15}$/;

    //JS for to display err msg when validation for pattern fails for inputs
    const resetPasswordFormDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    //Fields for to display success msg div and label
    const [sucMsgDiv, setSucMsgDiv] = useState(false);
    const [sucMsg, setSucMsg] = useState("");

    //JS for to display suc msg
    const resetPasswordDisplaySucMsg = (errorMessage) => {
        setSucMsg(errorMessage);
        setSucMsgDiv(true);
        setTimeout(() => {
            setSucMsg("");
            setSucMsgDiv(false);
        }, 2000);
    }

    const handleResetPasswordFormData = (e) => {
        const { name, value } = e.target;
        setResetPasswordFormData({
            ...resetPasswordFormData,
            [name]: value
        });
    };

    const resetPasswordVerifyEmailForm = async (e) => {
        e.preventDefault();
        setLoadingBar(true);
        const request = {
            username: resetPasswordFormData.username,
        }
        console.log(resetPasswordFormData);
        try {
            const responseData = await UserService.verifyMailForResetPassword(request);
            console.log(responseData);
            setIsEmailVerified(true);
            resetPasswordDisplaySucMsg('OTP Sent to your Mail-Id');
        } catch (error) {
            handleResetPasswordUserError(error.message);
        } finally {
            setLoadingBar(false);
        }
    }

    const resetPasswordSubmitForm = async (e) => {
        e.preventDefault();
        const matchConfirmPassword = resetPasswordFormData.password === resetPasswordFormData.confirmPassword;

        if (!passwordPatternRegex.test(resetPasswordFormData.password)) {
            resetPasswordFormDisplayErrMsg("Password is not matching the pattern");
        } else if (!matchConfirmPassword) {
            resetPasswordFormDisplayErrMsg("Confirm Password is not matching given Password");
        } else {
            setLoadingBar(true);
            console.log(resetPasswordFormData);
            const request = {
                username: resetPasswordFormData.username,
                emailOtp: resetPasswordFormData.emailOtp,
                password: resetPasswordFormData.password,
            }
            console.log(request);
            try {
                const responseData = await UserService.resetPassword(request);
                console.log(responseData);
                resetPasswordDisplaySucMsg('Password changed successfully...');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } catch (error) {
                handleResetPasswordUserError(error.message);
            } finally {
                setLoadingBar(false);
            }
        }
    };

    const handleResetPasswordUserError = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            resetPasswordFormDisplayErrMsg("Please enter valid input fields");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            resetPasswordFormDisplayErrMsg("You are not registered");
        else if (Constants.INACTIVE === errorStatus)
            resetPasswordFormDisplayErrMsg("User is inactive");
        else if (Constants.OTP_NOT_MATCHED === errorStatus)
            resetPasswordFormDisplayErrMsg("Please enter correct otp");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            resetPasswordFormDisplayErrMsg("Sorry, Our service is down");
        else
            resetPasswordFormDisplayErrMsg("Could not process your request");
    }

    return (
        <div className="Reset-password-form-component">
            {loadingBar && <LoadingBar />}
            <div className="Reset-password-form-heading">
                <h2 className='my-3'>Reset Password</h2>
            </div>
            <div className="Reset-password-form">
                <form onSubmit={resetPasswordVerifyEmailForm} className="form">
                    <div class="Reset-password-txt-field">
                        <input type="text" disabled={isEmailVerified} name="username" value={resetPasswordFormData.username} onChange={handleResetPasswordFormData} required />
                        <span></span>
                        <label>{!isEmailVerified && ('Mail-Id')}</label>
                    </div>
                    {!isEmailVerified && (
                        <div><button type="submit" className="btn Reset-password-breeze-small-button px-4" >Verify</button></div>
                    )}
                </form>
                <form onSubmit={resetPasswordSubmitForm} className="form" >
                    {isEmailVerified && (
                        <div>
                            <div class="Reset-password-txt-field">
                                <input type="text" name="emailOtp" value={resetPasswordFormData.emailOtp} onChange={handleResetPasswordFormData} pattern="\d{6}" required title='Only numbers are allowed, and length should be 6' />
                                <span></span>
                                <label>Enter OTP</label>
                            </div>
                            <div class="Reset-password-txt-field">
                                <input type="password" name="password" required value={resetPasswordFormData.password} onChange={handleResetPasswordFormData}
                                    pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,15}$" title='Password should contain 1 uppercase, 1 digit, 1 Special Character, and length between 8-15.' />
                                <span></span>
                                <label>New Password</label>
                            </div>
                            <div class="Reset-password-txt-field">
                                <input type="password" name="confirmPassword" value={resetPasswordFormData.confirmPassword} onChange={handleResetPasswordFormData} required />
                                <span></span>
                                <label>Confirm Password</label>
                            </div>
                        </div>
                    )}
                    {errMsgDiv &&
                        <div className="Reset-password-div-for-err-msg">
                            <label>{errMsg}</label>
                        </div>}
                    {sucMsgDiv &&
                        <div className="Reset-password-div-for-suc-msg">
                            <label>{sucMsg}</label>
                        </div>}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {isEmailVerified && (
                            <div><button type="submit" className="btn Reset-password-breeze-button px-4" >Reset</button></div>
                        )}
                    </div>
                    <div className="Reset-password-label-already-have">
                        Dont Want to Reset?&nbsp;
                        <a href="./login" className="Reset-password-anchor-navigate" >Login</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ResetPasswordForm;