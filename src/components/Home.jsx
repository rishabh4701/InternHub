import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAlt, faCalendarAlt, faEye, faEyeSlash, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './Home_page.css';
import logo from './images/Mnit_logo.png';
import userIcon from './images/icons8-user-50.png';
import RegistrationForm from './RegistrationForm';
import Application_status from './Application_status';
import PhoneInput from 'react-phone-input-2';
import Otp from './Otp';
// import app from './firbase';
//import { getAuth, RecaptchaVerifier } from "firebase/auth";
// import {RecaptchaVerifier, signInWithPhoneNumber, getAuth} from 'firebase/auth';
//import { honeNumber } from 'react-phone-number-input';
// import OTPInput from 'react-otp-input';
import 'react-phone-input-2/lib/style.css';
// import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
// import {auth} from '../firebase/setup';
// import 'firebase/auth';

const Home = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loggedinUserId, setloggedinUserId] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState();
  const [showSignupPage, setShowSignupPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const jobsPerPage = 5;
  const [search, setSearch] = useState('');
  const [showMyApplication, setShowMyApplication] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({ first_name: '', email: '', username: '', password: '' , phone_number: ''});
  const [loginErrors, setLoginErrors] = useState({});
  const [signupErrors, setSignupErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [i_id, seti_id] = useState(null);
  const [showOtp, setShowOtp] = useState('');
  //const [phone, setPhone] = useState("");
  // const [otp, setOtp] = useState("");
  // const [user, setUser] = useState(null);
  const loggedIn = window.localStorage.getItem("isLoggedIn");
  console.log(loggedIn, "login");
  console.log(loggedInUser);
  const history = useHistory();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/internships/')
      .then(response => setJobs(response.data))
      .catch(error => console.error('There was an error fetching the jobs!', error));
  }, []);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setLoginErrors({ ...loginErrors, [e.target.name]: '' });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
    setSignupErrors({ ...signupErrors, [e.target.name]: '' });
  };

  const validateLogin = () => {
    const errors = {};
    if (!loginData.username) errors.username = 'Username is required';
    if (!loginData.password) errors.password = 'Password is required';
    // if(!loginData.general) errors.general = 'Invalid Username or Password';
    return errors;
  };

  const validateSignup = () => {
    const errors = {};
    if (!signupData.first_name) errors.first_name = 'First name is required';
    if (!signupData.email) errors.email = 'Email is required';
    if (!signupData.username) errors.username = 'Username is required';
    if (!signupData.password) errors.password = 'Password is required';

    if (!signupData.phone_number) errors.phone_number = 'Phone Number is required';
    return errors; 
 
  };


  const handleLogin = (e) => {
    e.preventDefault();
    const errors = validateLogin();
    setLoginErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      axios.post('http://127.0.0.1:8000/auth/login/', loginData)
        .then(response => {
          setLoggedInUser(response.data.username);
          setloggedinUserId(response.data.user_id);
          setShowLoginModal(false);
          window.localStorage.setItem("isLoggedIn", true);
          if (response.data.status === 'staff') {
            alert("Log in as mentor");
            history.push(`/mentor/${response.data.user_id}/${response.data.username}`);
          } else {
            setLoggedInUser(response.data.username);
            setloggedinUserId(response.data.user_id);
            setShowLoginModal(false);
          }
        })
        .catch(error => {
          if (error.response && error.response.data) {
            setLoginErrors(error.response.data);
          } else {
            setLoginErrors({ general: 'Invalid username or password' });
          }
        });
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const errors = validateSignup();
    setSignupErrors(errors);
  
    // Check if there are no validation errors
    if (Object.keys(errors).length === 0) { // Ensure errors object is empty
      axios.post('http://127.0.0.1:8000/auth/signup/', signupData)
        .then(response => {
          console.log('Signup response:', response.data);
          alert('Signup successful! Please log in.');
          setShowLoginModal(true);
          setSignupData({ first_name: '', email: '', username: '', password: '', phone_number: '' });
        })
        .catch(error => {
          if (error.response && error.response.data) {
            setSignupErrors(error.response.data);
          } else {
            setSignupErrors({ general: 'Signup error. Please try again.' });
          }
        });
    }
  };
  



//  const sendOtp = async() => {
//  try {
//    const recaptcha = new RecaptchaVerifier(auth, "recaptcha",{});
//    const confirmation = await signInWithPhoneNumber(auth, signupData.phone_number, recaptcha);  
//   setUser(confirmation);
//  } catch (error) {
//   console.log(error); 
//  }
//  }

//  const verifyOtp = async() => {
//   try {
//     await user.confirm(otp);
//   } catch (error) {
//     console.log(error);
//   }
//  }
  // const sendOtp = async (e) => {
  //   e.preventDefault();
  
  //   if (!signupData.phone_number) {
  //     alert('Please enter a valid phone number.');
  //     return;
  //   }
  
  //   try {
  //     window.recaptchaVerifier = new RecaptchaVerifier('recaptcha', {
  //       'size': 'invisible',
  //       'callback': (response) => {
  //         // reCAPTCHA solved, allow sendOtp
  //         console.log('Recaptcha resolved');
  //       },
  //     }, auth);
  
  //     const appVerifier = window.recaptchaVerifier;
  //     const formattedPhoneNumber = `+${signupData.phone_number}`;
  
  //     const confirmation = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
  //     setUser(confirmation);
  //     console.log('OTP sent', confirmation);
  //   } catch (error) {
  //     console.error('Error during sending OTP:', error);
  //   }
  // };
  
  // const verifyOtp = async () => {
  //   if (!otp || !user) {
  //     alert('Please enter the OTP.');
  //     return;
  //   }
  
  //   try {
  //     await user.confirm(otp);
  //     alert('OTP verified successfully');
  //   } catch (error) {
  //     console.error('Error during OTP verification:', error);
  //     alert('Invalid OTP. Please try again.');
  //   }
  // };
  
  const handleLogout = () => {
    setLoggedInUser(null);
    window.localStorage.setItem("isLoggedIn", false);
    setShowMyApplication(false);
    setShowRegistrationForm(false);
    history.push('/');  };


  const handleMyApplication = () => {
    setShowMyApplication(true);
    setShowRegistrationForm(false);
    // history.push('/application_status/{loggedInUser}');
    history.push(`/application_status/${loggedinUserId}/${loggedInUser}`);
  };
  const handleOtp = () => {
  setShowOtp(true);
  }
  const handleHome = () => {
    setShowMyApplication(false);
    setShowRegistrationForm(false);
  }
 // const handleResumeUpload = (e) => {
  //  const file = e.target.files[0];
  //   if (file && file.type === 'application/pdf') {
  //     setResumeUploaded(true);
  //   } else {
  //     alert('Please upload a PDF file.');
  //   }
  // };

  const handleApplyNowClick = (jobId) => {
    if (loggedinUserId) {
      setShowRegistrationForm(true);
      seti_id(jobId);
    } else {
      setShowLoginModal(true);
    }
  };

  const handlePrevClick = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextClick = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(jobs.length / jobsPerPage)));
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
console.log(search);
  return (
    <div>
      <header>
        <div className="MNIT_name">
          <img src={logo} alt="MNIT logo" />
          <h1>
            मालवीय राष्ट्रीय प्रौद्योगिकी संस्थान जयपुर (राष्ट्रीय महत्व का संस्थान)
            <br />
            Malaviya National Institute of Technology Jaipur (An Institute of National Importance)
          </h1>
        </div>
      </header>

      <nav className="navbar">
      <ul className="navbar-left">
        <li><a className="home" onClick={handleHome}>Home</a></li>
        {loggedInUser && (
          <li><Link className="myapplication" to="#" onClick={handleMyApplication}>My Applications</Link></li>
        )}
         <li><nav class="search-job">
     <div class="search-bar">
     <form class="search" role="search">
     <input class="search-box" type="search" onChange={(e) => setSearch(e.target.value)} placeholder="Search Internships" aria-label="Search" />
     {/* <button class="btn btn-outline-success" type="submit">Search</button> */}
    </form>
  </div>
</nav></li>
      </ul>
      <ul className="navbar-right">
        {loggedInUser ? (
          <>
            <li className="user1">
              <span className="user-id-label"><FontAwesomeIcon icon={faUser} /></span> {loggedInUser}
            </li>
            <li className="logout" onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} /> Logout</li>
          </>
        ) : (
          <li className="user" onClick={() => setShowLoginModal(true)}>
            <img src={userIcon} alt="login" />
          </li>
        )}
      </ul>
    </nav>
      

      {!showRegistrationForm && !showMyApplication && (
        <div className="tab-content">
          <div id="tab-1" className="tab-pane fade show p-0 active">
            {currentJobs.filter((job)=> {return search.toLowerCase() === '' ? job : job.Title.toLowerCase().includes(search)}).map((job, index) => (
              <div key={index} className="job-item p-4 mb-4" onClick={() => setSelectedJob(job)}>
                <div className="row g-4">
                  <div className="col-sm-12 col-md-8 d-flex align-items-center">
                    <div className="text-start ps-4">
                      <h2 className="mb-3">{job.Title}</h2>
                      <span className="text-truncate me-3">
                        <FontAwesomeIcon icon={faUserAlt} className="text-primary me-2" /> {job.Mentor}
                      </span>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center">
                    <div className="d-flex">
                      <button className="btn btn-primary" onClick={() => handleApplyNowClick(job.id)}>Apply Now</button>
                    </div>
                    <small className="text-truncate">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-primary me-2" /> Duration: {job.Duration}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedJob && (
        <div id="job-popup" className={`popup ${selectedJob ? 'active' : ''}`}>
          <div className="popup-content">
            <span className="close" onClick={() => setSelectedJob(null)}>&times;</span>
            <h2 id="job-Title">{selectedJob.Title}</h2>
            <p id="job-description">{selectedJob.description}</p>
          </div>
        </div>
      )}

      {showLoginModal && !loggedInUser && (
        <div className="modal-show-1" style={{ display: 'block' }}>
          <div className="modal-dialog-1">
            <div className="modal-content-1">
              <div className="modal-body-1">
                <button className="close" onClick={() => setShowLoginModal(false)}>&times;</button>
                <div className={`login form active`}>
                  <header>LogIn</header>
                  <form onSubmit={handleLogin}>
                    <input type="text" name="username" placeholder="Username" value={loginData.username} onChange={handleLoginChange} />
                    {loginErrors.username && <span className="error">{loginErrors.username}</span>}
                    <div className="password-wrapper">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                      />
                      <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </span>
                    </div>
                    {loginErrors.password && <span className="error">{loginErrors.password}</span>}
                    {loginErrors && <span className="error">{loginErrors.error}</span>}
                    <br />
                    <a href="#">Forgot password?</a>
                    <input type="submit" className="button" value="LogIn" />
                    <div className="signup">
                      <span className="signup">Don't have an account?
                        <label htmlFor="check" onClick={() => setShowSignupPage(true)}>Signup</label>
                      </span>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSignupPage && !loggedInUser && (
        <div className="modal-show-1" style={{ display: 'block' }}>
          <div className="modal-dialog-1">
            <div className="modal-content-1">
              <div className="modal-body-1">
                <button className="close" onClick={() => setShowSignupPage(false)}>&times;</button>
                <div className={`registration form active`}>
                  <header>Signup</header>
                  <div id='recatcha-container'></div>
                  <form onSubmit={handleSignup}>
                    <input type="text" 
                    name="first_name" 
                    placeholder="Enter your first name"
                    value={signupData.first_name} 
                    onChange={handleSignupChange} 
                    />
                    {signupErrors.first_name && <span className="error">{signupErrors.first_name}</span>}
                    <input type="text" 
                    name="email" 
                    placeholder="Enter your email" 
                    value={signupData.email} 
                    onChange={handleSignupChange} 
                    />
                  {signupErrors.email && <span className="error">{signupErrors.email}</span>}
                  <PhoneInput  
                    type="number"
                    country={'IN'}
                    name="phone_number" 
                    placeholder="Enter your number" 
                    value={signupData.phone_number} 
                    onChange={(phone_number) => setSignupData("+" + phone_number)} 
                    inputProps={{
                      name: 'phone_number',
                      required: true,
                      autoFocus: true
                    }}
                      />
                    {/* <OTPInput
                       value={otp}
                       onChange={setOtp}  
                      OTPLength = {6}
                      otpType = "number"
                      disabled={false}
                      autoFocus
                      className="otp"
                    ></OTPInput> */}
                   {/* <input
                   value={otp}
                   onChange={setOtp}
                    OTPLength = {6}
                   otpType = "number"
                   disabled={false}
                   autoFocus
                   className="otp"
                   ></input>
                   <button className='otp-btn'>
                    <span>Verify OTP</span>
                   </button> */}
                  {/* {signupErrors.phone_number && <span className='error'>{signupErrors.phone_number}</span>} */}
                    <input type="text" 
                    name="username" 
                    placeholder="Username" 
                    value={signupData.username} 
                    onChange={handleSignupChange} 
                    />
                    {signupErrors.username && <span className="error">{signupErrors.username}</span>}
                    <div className="password-wrapper">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={signupData.password}
                        onChange={handleSignupChange}
                      />
                      <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </span>
                    </div>
                    {signupErrors.password && <span className="error">{signupErrors.password}</span>}
                    {signupErrors.general && <span className="error">{signupErrors.general}</span>}
                    {/* <div id="sign-in-button"></div>
                   
                    <button className='otp-btn' onClick={sendOtp}>Send OTP</button>
                    <input type="number"
                    name='OTP'
                    placeholder='Enter the OTP'
                    onChange={(e) => setOtp(e.target.value)}
                    />
                    <button className='otp-verify' onClick={verifyOtp}>Verify OTP</button>  */}
                    <input type="submit" onClick={handleOtp} className="button" value="Signup" />
                  </form>
                  <div className="signup">
                    <span className="signup">Already have an account?
                      <label htmlFor="click" onClick={() => setShowSignupPage(false)}>Login</label>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRegistrationForm && loggedInUser && (
        <RegistrationForm closeModal={() => setShowRegistrationForm(false)} 
        userId={loggedinUserId}
        iId={i_id}
        />
        
      )}
      

      {showMyApplication && loggedInUser && (
         <Application_status  />
      )}
      
      {showOtp &&(
        <Otp/>
      )}
      <div className="pagination">
        <button disabled={currentPage <= 1} className="btn" onClick={handlePrevClick}>Prev</button>
        <span>{currentPage} of {totalPages}</span>
        <button disabled={currentPage >= totalPages} className="btn" onClick={handleNextClick}>Next</button>
      </div>
      
    </div>
  );
};

export default Home;
