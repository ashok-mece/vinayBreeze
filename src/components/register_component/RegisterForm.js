import './Register.css';
import { useState } from "react";
import { Dropdown, Form } from 'react-bootstrap';
import Constants from '../Constants';
import UserService from '../../Services/user_service/UserService';
import LoadingBar from '../loading_bar_component/LoadingBar';

function RegisterForm() {
  const [loadingBar, setLoadingBar] = useState(false);

  // Register Form Data Fields
  const [registerFormData, setRegisterFormData] = useState({
    userFirstname: '',
    userLastname: '',
    username: '',
    password: '',
    confirmPassword: '',
    userType: '',
    exponentTypeList: [],
    companyName: '' // Added companyName field
  });

  // Fields for dropdown selection
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedRadio, setSelectedRadio] = useState('');

  // Fields for error and success messages
  const [errMsgDiv, setErrMsgDiv] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [sucMsgDiv, setSucMsgDiv] = useState(false);
  const [sucMsg, setSucMsg] = useState("");

  // Regular Expressions for validation
  const onlyLettersRegex = /^[A-Za-z]+$/;
  const passwordPatternRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,15}$/;

  const handleRegisterFormData = (e) => {
    const { name, value } = e.target;
    setRegisterFormData({
      ...registerFormData,
      [name]: value
    });
  };

  const handleCheckboxChange = (option) => {
    const newSelectedOptions = [...selectedOptions];
    const selectedIndex = newSelectedOptions.indexOf(option);
    if (selectedIndex === -1) {
      newSelectedOptions.push(option);
    } else {
      newSelectedOptions.splice(selectedIndex, 1);
    }
    setSelectedOptions(newSelectedOptions);
    setSelectedRadio('');
  };

  const handleRadioChange = (option) => {
    setSelectedRadio(option);
    setSelectedOptions([]);
  };

  const innerHtmlButton = () => {
    if (selectedOptions.length > 0) {
      return selectedOptions.join(', ');
    } else if (selectedRadio !== '') {
      return selectedRadio;
    } else {
      return 'How would you like to Register';
    }
  };

  const registerFormDisplayErrMsg = (errorMessage) => {
    setErrMsg(errorMessage);
    setErrMsgDiv(true);
    setTimeout(() => {
      setErrMsg("");
      setErrMsgDiv(false);
    }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
  };

  const registerFormDisplaySucMsg = (successMessage) => {
    setSucMsg(successMessage);
    setSucMsgDiv(true);
    setTimeout(() => {
      setSucMsg("");
      setSucMsgDiv(false);
    }, 1500);
  };

  const registerSubmitForm = async (e) => {
    e.preventDefault();
    const matchConfirmPassword = registerFormData.password === registerFormData.confirmPassword;

    if (!onlyLettersRegex.test(registerFormData.userFirstname) || registerFormData.userFirstname.length < 3) {
      registerFormDisplayErrMsg("First Name is not matching the pattern");
    } else if (!onlyLettersRegex.test(registerFormData.userLastname) || registerFormData.userLastname.length < 3) {
      registerFormDisplayErrMsg("Last Name is not matching the pattern");
    } else if (!((registerFormData.username).slice(-4)).includes('.co')) {
      registerFormDisplayErrMsg("Please provide a valid email address");
    } else if (!passwordPatternRegex.test(registerFormData.password)) {
      registerFormDisplayErrMsg("Password is not matching the pattern");
    } else if (!matchConfirmPassword) {
      registerFormDisplayErrMsg("Confirm Password is not matching the given Password");
    } else if (!registerFormData.companyName.trim()) {
      registerFormDisplayErrMsg("Company Name cannot be empty");
    } else if (selectedOptions.length === 0 && selectedRadio === '') {
      registerFormDisplayErrMsg("Please check, How you want to Register");
    } else {
      setLoadingBar(true);
      if (selectedOptions.length > 0) {
        registerFormData.exponentTypeList = [...selectedOptions];
        registerFormData.userType = "EXPONENT";
      }
      if (selectedRadio !== '') {
        registerFormData.exponentTypeList = [];
        registerFormData.userType = "CANDIDATE";
      }
      console.log(registerFormData);

      try {
        const responseData = await UserService.registerUser(registerFormData);
        localStorage.setItem('userId', JSON.stringify(responseData.userId));
        registerFormDisplaySucMsg('Registered Successfully...');
        setTimeout(() => {
          window.location.href = '/verify-email';
        }, 1500);
      } catch (error) {
        handleRegisterUserError(error.message);
      } finally {
        setLoadingBar(false);
      }
    }
  };

  const handleRegisterUserError = (errorStatus) => {
    if (Constants.INVALID_REQUEST_FIELD === errorStatus)
      registerFormDisplayErrMsg("Please enter valid input fields");
    else if (Constants.EXISTING_USERNAME === errorStatus)
      registerFormDisplayErrMsg("Mail-Id already exists");
    else if (Constants.ADDRESS_EXCEPTION === errorStatus)
      registerFormDisplayErrMsg("Please check the email syntax");
    else if (Constants.MESSAGING_EXCEPTION === errorStatus)
      registerFormDisplayErrMsg("Could not send mail, Please try again");
    else if (Constants.BREEZE_DATABASE_EXCEPTION === errorStatus)
      registerFormDisplayErrMsg("Sorry, Our service is down");
    else
      registerFormDisplayErrMsg("Could not process your request");
  };

  return (
    <div className="Register-form-component">
      {loadingBar && <LoadingBar />}
      <div className="Register-form-heading">
        <h2 className='my-3'>Registration</h2>
      </div>
      <div className="Register-form">
        <form onSubmit={registerSubmitForm} className="form">
          <div class="Register-txt-field">
            <input type="text" name="userFirstname" value={registerFormData.userFirstname} onChange={handleRegisterFormData} required
              pattern="[A-Za-z]{3,}" title="Only letters are allowed and minimum length should be 3" />
            <span></span>
            <label>First Name</label>
          </div>
          <div class="Register-txt-field">
            <input type="text" name="userLastname" value={registerFormData.userLastname} onChange={handleRegisterFormData} required
              pattern="[A-Za-z]{3,}" title="Only letters are allowed and minimum length should be 3" />
            <span></span>
            <label>Last Name</label>
          </div>
          <div class="Register-txt-field">
            <input type="email" name="username" value={registerFormData.username} onChange={handleRegisterFormData} required />
            <span></span>
            <label>Mail-Id</label>
          </div>
          <div class="Register-txt-field">
            <input type="password" name="password" value={registerFormData.password} onChange={handleRegisterFormData} required
              pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,15}$" title="Password should contain 1 uppercase, 1 digit, 1 Special Character, and length between 8-15." />
            <span></span>
            <label>Password</label>
          </div>
          <div class="Register-txt-field">
            <input type="password" name="confirmPassword" value={registerFormData.confirmPassword} onChange={handleRegisterFormData} required />
            <span></span>
            <label>Confirm Password</label>
          </div>
          <div class="Register-txt-field">
            <input type="text" name="companyName" value={registerFormData.companyName} onChange={handleRegisterFormData} required
              pattern="[A-Za-z\s]{3,}" title="Only letters and spaces are allowed, and the minimum length should be 3" />
            <span></span>
            <label>Company Name</label>
          </div>
          <div className="multiSelectDropdownInRegister">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic" className="Register-dropdown-button">
                <span className="Text-in-register-dropdown">{innerHtmlButton()}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="p-2">
                <Form>
                  <Form.Check
                    type="checkbox"
                    id="Trainer"
                    label="Trainer"
                    checked={selectedOptions.includes(Constants.TRAINER)}
                    onChange={() => handleCheckboxChange(Constants.TRAINER)}
                  />
                  <Form.Check
                    type="checkbox"
                    id="Job-Support"
                    label="Job-Supporter"
                    checked={selectedOptions.includes(Constants.JOB_SUPPORTER)}
                    onChange={() => handleCheckboxChange(Constants.JOB_SUPPORTER)}
                  />
                  <Form.Check
                    type="checkbox"
                    id="Interview-Support"
                    label="Interview-Supporter"
                    checked={selectedOptions.includes(Constants.INTERVIEW_SUPPORTER)}
                    onChange={() => handleCheckboxChange(Constants.INTERVIEW_SUPPORTER)}
                  />
                  <Form.Check
                    type="radio"
                    id="Candidate"
                    label="Candidate"
                    checked={selectedRadio === Constants.CANDIDATE}
                    onChange={() => handleRadioChange(Constants.CANDIDATE)}
                  />
                </Form>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          {errMsgDiv &&
            <div className="Register-div-for-err-msg">
              <label>{errMsg}</label>
            </div>}
          {sucMsgDiv &&
            <div className="Register-div-for-suc-msg">
              <label>{sucMsg}</label>
            </div>}
          <div>
            <button type="submit" className="btn Register-breeze-button px-4">Register</button>
          </div>
          <div className="Register-label-already-have">
            Already have an account?&nbsp;
            <a href="./login" className="Register-anchor-navigate">Login</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
