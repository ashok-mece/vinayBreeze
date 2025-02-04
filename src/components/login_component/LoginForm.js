import { useState } from 'react';
import './Login.css';
import Constants from '../Constants';
import UserService from '../../Services/user_service/UserService';
import { useNavigate } from 'react-router-dom';
import LoadingBar from '../loading_bar_component/LoadingBar';

function LoginForm() {
  const [loadingBar, setLoadingBar] = useState(false);

  const navigate = useNavigate();

  const [loginFormData, setLoginFormData] = useState({
    username: '',
    password: '',
    companyName: '' // Added companyName field
  });

  // Fields for error message display
  const [errMsgDiv, setErrMsgDiv] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const loginFormDisplayErrMsg = (errorMessage) => {
    setErrMsg(errorMessage);
    setErrMsgDiv(true);
    setTimeout(() => {
      setErrMsg("");
      setErrMsgDiv(false);
    }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
  };

  const handleLoginFormData = (e) => {
    const { name, value } = e.target;
    setLoginFormData({
      ...loginFormData,
      [name]: value
    });
  };

  const loginSubmitForm = async (e) => {
    e.preventDefault();
    setLoadingBar(true);
    console.log(loginFormData);
    try {
      const responseData = await UserService.loginUser(loginFormData);
      console.log(responseData);
      localStorage.setItem('breezeUserId', responseData.userId);
      localStorage.setItem('breezeUserType', responseData.userType);
      localStorage.setItem('breezeUsername', responseData.username);
      localStorage.setItem('breezeUserFullName', responseData.userFirstname + " " + responseData.userLastname);
      localStorage.setItem('breezeUserFirstTimeLogin', responseData.firstTimeLogin);
      localStorage.setItem('breezeExponentType', JSON.stringify(responseData.exponentTypeList));
      localStorage.setItem("breezeSelectedExponentType", responseData.exponentTypeList && responseData.exponentTypeList[0]);

      // Save companyName to local storage
      localStorage.setItem('breezeCompanyName', loginFormData.companyName);

      navigate('/dashboard');
    } catch (error) {
      handleLoginUserError(error.message);
    } finally {
      setLoadingBar(false);
    }
  };

  const handleLoginUserError = (errorStatus) => {
    if (Constants.INVALID_REQUEST_FIELD === errorStatus)
      loginFormDisplayErrMsg("Please enter valid inputs fields");
    else if (Constants.ENTITY_NOT_FOUND === errorStatus)
      loginFormDisplayErrMsg("You are not registered");
    else if (Constants.INACTIVE === errorStatus)
      loginFormDisplayErrMsg("User is InActive");
    else if (Constants.PASSWORD_NOT_MATCHED === errorStatus)
      loginFormDisplayErrMsg("Please enter correct password");
    else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
      loginFormDisplayErrMsg("Sorry, Our service is down");
    else if (' Access Denied !! User not found !!' === errorStatus)
      loginFormDisplayErrMsg("Mail-Id is not found");
    else if (' Access Denied !! Invalid username or password !!' === errorStatus)
      loginFormDisplayErrMsg("Invalid Credentials");
    else
      loginFormDisplayErrMsg("Could not process your request");
  };

  return (
    <div className="Login-form-component">
      {loadingBar && <LoadingBar />}
      <div className="Login-form-heading">
        <h2 className='my-3'>Login</h2>
      </div>
      <div className="Login-form">
        <form onSubmit={loginSubmitForm} className="form">
          <div className="Login-txt-field">
            <input
              type="text"
              name="companyName"
              value={loginFormData.companyName}
              onChange={handleLoginFormData}
              required
            />
            <span></span>
            <label>Company Name</label>
          </div>
          <div className="Login-txt-field">
            <input
              type="text"
              name="username"
              value={loginFormData.username}
              onChange={handleLoginFormData}
              required
            />
            <span></span>
            <label>Mail-Id</label>
          </div>
          <div className="Login-txt-field">
            <input
              type="password"
              name="password"
              value={loginFormData.password}
              onChange={handleLoginFormData}
              required
            />
            <span></span>
            <label>Password</label>
          </div>
          {errMsgDiv && (
            <div className="Login-div-for-err-msg">
              <label>{errMsg}</label>
            </div>
          )}
          <div>
            <button type="submit" className="btn Login-breeze-button px-4">
              Login
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="Login-label-already-have">
              Don't have an account?&nbsp;
              <a href="./register-user" className="Login-anchor-navigate">
                Register
              </a>
            </div>
            <div className="Login-label-already-have">
              <a href="./reset-password" className="Login-anchor-navigate">
                Forgot Password
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
