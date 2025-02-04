import './VerifyEmail.css';
import { useState } from 'react';
import Constants from '../Constants';
import UserService from '../../Services/user_service/UserService';
import LoadingBar from '../loading_bar_component/LoadingBar';

function VerifyEmailForm() {

    const [loadingBar, setLoadingBar] = useState(false);

    const [verifyEmailForm, setVerifyEmailForm] = useState({
        userId: JSON.parse(localStorage.getItem('userId')),
        emailOtp: ''
    });

    //Fields for to display err msg div and label
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    //Fields for to display success msg div and label
    const [sucMsgDiv, setSucMsgDiv] = useState(false);
    const [sucMsg, setSucMsg] = useState("");

    const handleRegisterFormData = (e) => {
        const { name, value } = e.target;
        setVerifyEmailForm({
            ...verifyEmailForm,
            [name]: value
        });
    };

    const verifyEmailDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }

    //JS for to display suc msg
    const verifyEmailDisplaySucMsg = (errorMessage) => {
        setSucMsg(errorMessage);
        setSucMsgDiv(true);
        setTimeout(() => {
            setSucMsg("");
            setSucMsgDiv(false);
        }, 1500);
    }

    const handleResendOTP = async () => {
        setLoadingBar(true);
        let userData = {
            "userId": verifyEmailForm.userId,
        }

        try {
            const responseData = await UserService.resendOtp(userData);
            console.log(responseData);
            verifyEmailDisplaySucMsg("OTP Resend Successfully");
        } catch (error) {
            console.log(error);
            handleResensOtpErrors(error.message);
        } finally {
            setLoadingBar(false);
        }
    }
    const handleResensOtpErrors = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            verifyEmailDisplayErrMsg("Please enter valid inputs fields");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            verifyEmailDisplayErrMsg("Your registration is not found");
        else if (Constants.VERIFIED === errorStatus)
            verifyEmailDisplayErrMsg("Your Email is Verified already");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            verifyEmailDisplayErrMsg("Sorry, Our service is down");
        else
            verifyEmailDisplayErrMsg("Could not process your request");
    }

    const verifyEmailSubmitForm = async (e) => {
        e.preventDefault();
        setLoadingBar(true);
        try {
            const responseData = await UserService.verifyEmail(verifyEmailForm);
            console.log(responseData);
            verifyEmailDisplaySucMsg("OTP Verified Successfully");
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } catch (error) {
            handleVerifyEmailError(error.message);
        } finally {
            setLoadingBar(false);
        }

    }

    const handleVerifyEmailError = (errorStatus) => {
        if (Constants.INVALID_REQUEST_FIELD === errorStatus)
            verifyEmailDisplayErrMsg("Please enter valid inputs fields");
        else if (Constants.OTP_NOT_MATCHED === errorStatus)
            verifyEmailDisplayErrMsg("Please enter correct OTP");
        else if (Constants.ENTITY_NOT_FOUND === errorStatus)
            verifyEmailDisplayErrMsg("Your registration is not found");
        else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
            verifyEmailDisplayErrMsg("Sry, Our service is down");
        else
            verifyEmailDisplayErrMsg("Could not process your request");
    }

    return (
        <div className="Verify-email-form-component">
            {loadingBar && <LoadingBar />}
            <div className="Verify-email-form-heading">
                <h3 className='my-3'>OTP Verification</h3>
            </div>
            <div className="Verify-email-form">
                <form onSubmit={verifyEmailSubmitForm} className="form" >
                    <div class="Verify-email-txt-field">
                        <input type="text" name="emailOtp" value={verifyEmailForm.emailOtp} onChange={handleRegisterFormData} pattern="\d{6}" required title='Only numbers are allowed, and length should be 6' />
                        <span></span>
                        <label>Enter OTP</label>
                    </div>
                    <div className="d-flex justify-content-between">
                        <div>
                            <button type='button' onClick={handleResendOTP} className="Verify-email-button-resend mt-2">Resend</button>
                        </div>
                        <div className="text-end">
                            <button type="submit" className="btn Verify-email-breeze-button px-3">Verify</button>
                        </div>
                    </div>
                    {errMsgDiv &&
                        <div className="Verify-email-div-for-err-msg">
                            <label>{errMsg}</label>
                        </div>}
                    {sucMsgDiv &&
                        <div className="Verify-email-div-for-suc-msg">
                            <label>{sucMsg}</label>
                        </div>}
                </form>
            </div>
        </div>
    );

}

export default VerifyEmailForm;