import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAlt, faCalendarAlt, faEye, faEyeSlash, faSignOutAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './Home_page.css';
import logo from './images/Mnit_logo.png';
import userIcon from './images/icons8-user-50.png';
import RegistrationForm from './RegistrationForm';
import Application_status from './Application_status';
import ReCAPTCHA from 'react-google-recaptcha';


const Home = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loggedinUserId, setloggedinUserId] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState();
  const [selectedInternship, setSelectedInternship] = useState(null);
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
  const [token, setToken] = useState('');
  
  const [recaptchaToken, setRecaptchaToken] = useState('');
  //const [showOtp, setShowOtp] = useState('');
  //const [phone, setPhone] = useState("");
  // const [otp, setOtp] = useState("");
  // const [user, setUser] = useState(null);

  const loggedIn = window.localStorage.getItem("isLoggedIn");
  console.log(loggedIn, "login");
  console.log(loggedInUser);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInternships();
    // axios.get('http://127.0.0.1:8000/internships/')
    //   .then(response => setJobs(response.data))
    //   .catch(error => console.error('There was an error fetching the jobs!', error));
  }, []);

  const fetchInternships = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/internships/');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      } 
      const data = await response.json();
      const sortedData = data.sort((a, b) => (a.Status === 'Open' ? -1 : 1));
    setJobs(sortedData);
    } catch (error) {
      console.error('Error fetching internships:', error);
    }
  };

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
    // if(loginErrors.general) errors.general = 'Invalid Username or Password';
    return errors;
  };

  const validateSignup = () => {
    const errors = {};
    if (!signupData.first_name) errors.first_name = 'First name is required';
    if (!signupData.email) errors.email = 'Email is required';
    if (!signupData.username) errors.username = 'Username is required';
    if (!signupData.password) errors.password = 'Password is required';
    return errors; 
  };


  const handleLogin = (e) => {
    e.preventDefault();
    const errors = validateLogin();
    setLoginErrors(errors);
    if (!recaptchaToken) {
      alert('Please complete the reCAPTCHA');
      return;
  }
    if (Object.keys(errors).length === 0) {
      axios.post('http://127.0.0.1:8000/auth/login/', {...loginData, recaptchaToken: recaptchaToken})
        .then(response => {
          setLoggedInUser(response.data.username);
          setloggedinUserId(response.data.user_id);
          setShowLoginModal(false);
          window.localStorage.setItem("isLoggedIn", true);
          if (response.data.status === 'staff') {
            alert("Log in as mentor");
            navigate(`/mentor/${response.data.user_id}/${response.data.username}`);
          }else if(response.data.status === 'superuser') {
            alert("Log in as Admin ");
            setToken(response.data.access);
            navigate(`/admin/${response.data.user_id}/${response.data.username}/${response.data.access}`);
          } 
          else {
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
        console.log(loginErrors);
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const errors = validateSignup();
    setSignupErrors(errors);
    // if (!otpSent || !isOtpVerified) {
    //   alert("Please verify your OTP before signing up.");
    //   return;
    // }
    if (!recaptchaToken) {
      alert('Please complete the reCAPTCHA');
      return;
  }
    // Check if there are no validation errors
    
  };

  const handleSendEmail = () => {

    const emailData = {
        email: signupData.email,  // or any other email you want to send to
        subject: 'Welcome to Our Service!',
        message: `Dear ${signupData.first_name},\n\nThank you for signing up! We're excited to have you on board.\n\nBest regards,\nThe Team`
    };

    
         // Ensure errors object is empty
          axios.post('http://127.0.0.1:8000/auth/signup/', {...signupData, recaptchaToken: recaptchaToken})
            .then(response => {
              console.log('Signup response:', response.data);
              // alert('Signup successful! Please log in.');
              // setShowLoginModal(true);
              setSignupData({ first_name: '', username: '', password: '', email: ''});
              // window.location.reload();
              axios.post('http://127.0.0.1:8000/auth/send-email/', emailData)
        .then(response => {
            console.log('Email sent response:', response.data);
            alert('Email sent successfully!');
            setOtpSent(true);
            setOtpData({ email: signupData.email });
        })
        .catch(error => {
            console.error('Error sending email:', error);
            alert('There was an error sending the email. Please try again.');
        });
            })
            .catch(error => {
              if (error.response && error.response.data) {
                setSignupErrors(error.response.data);
              } else {
                setSignupErrors({ general: 'Signup error. Please try again.' });
              }
            });
        
};


  // const sendOTP = () => {
  //   let otp_val = Math.floor(Math.random() * 10000);
  //   setGeneratedOtp(otp_val);

  //   let emailBody = `<h2>Your OTP is </h2>${otp_val}`;

  //   emailjs.send('service_elco1zp', 'template_gm3clqq', {
  //       to_email: signupData.email,
  //       otp: otp_val,
  //       message: emailBody
  //     }, 'LPYKBbs7hJvgaqLAY')
  //     .then((response) => {
  //       console.log('SUCCESS!', response.status, response.text);
  //       alert("OTP sent to your email " + signupData.email);
  //       setOtpSent(true);
  //     })
  //     .catch((err) => {
  //       console.error('FAILED...', err);
  //       alert("Failed to send OTP. Please try again.");
  //     });
  // };

  // const verifyOTP = () => {
  //   if (otp == generatedOtp) {
  //     alert("Email address verified...");
  //     setIsOtpVerified(true);
  //   } else {
  //     alert("Invalid OTP");
  //   }
  // };
  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
};

  
  const handleLogout = () => {
    setLoggedInUser(null);
    window.localStorage.setItem("isLoggedIn", false);
    setShowMyApplication(false);
    setShowRegistrationForm(false);
    navigate('/internship_portal');  };


  const handleMyApplication = () => {
    setShowMyApplication(true);
    setShowRegistrationForm(false);
    // history.push('/application_status/{loggedInUser}');
    navigate(`/application_status/${loggedinUserId}/${loggedInUser}`);
  };
  
  const handleHome = () => {
    setShowMyApplication(false);
    setShowRegistrationForm(false);
  }
 
  const handleApplyNowClick = (jobId) => {
    if (loggedinUserId) {
      setShowRegistrationForm(true);
      seti_id(jobId);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleShowDetails = (jobId) => {
    console.log("hi");
    console.log(jobId);
    const job = jobs.find(job => job.id === parseInt(jobId));
    setSelectedInternship(job);
    console.log(selectedInternship);
  };

  const handleCloseDetails = () => {
    setSelectedInternship(null);
  };

  const handlePrevClick = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    setSelectedInternship(null);
  };

  const handleNextClick = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(jobs.length / jobsPerPage)));
    setSelectedInternship(null);
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const [otpSent, setOtpSent] = useState(false);
const [isOtpVerified, setIsOtpVerified] = useState(false);
const [otpData, setOtpData] = useState({ email: [], otp_verification: [] });
const [otpErrors, setOtpErrors] = useState('');

const handleOtpChange = (e) => {
  setOtpData({ ...otpData, [e.target.name]: e.target.value });
};



const handleOtpVerification = async (e) => {
  e.preventDefault();
  try {
    axios.post('http://127.0.0.1:8000/auth/verify-otp/', {otpData})
    .then(response => {
      setIsOtpVerified(true);
      setOtpSent(false);
      setShowSignupPage(false);
      alert('Signup successful! Please log in.');
      setShowLoginModal(true);
    })
    
  } catch (error) {
    setOtpErrors('Invalid OTP');
  }
};

// // const verifyOtpAPI = async (e) => {
// //   try {
// //     // Perform the API call to verify the OTP
// //     const response = await axios.post('http://127.0.0.1:8000/auth/verify-otp/', {otpData});
// //     return response.data;
// //   } catch (error) {
// //     throw new Error(error.response?.data?.error || 'An error occurred while verifying OTP');
// //   }
// };

const resendOtpAPI = async (email) => {
  try {
    const response = await axios.post('/api/resend-otp/', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'An error occurred while resending OTP');
  }
};



// Then use this function in your button


console.log(search);
  return (
    <div>
       {/* <header>
        <div className="MNIT_name">
          <img src={logo} alt="MNIT logo" />
          <h1>
            मालवीय राष्ट्रीय प्रौद्यो/गिकी संस्थान जयपुर (राष्ट्रीय महत्व का संस्थान)
            <br />
            Malaviya National Institute of Technology Jaipur (An Institute of National Importance)
          </h1>
        </div>
      </header>  */}
      <header>
        <h1>Internship Web Portal</h1>
      </header>

      <nav className="navbar">
      <ul className="navbar-left">
        <li><a className="home" onClick={handleHome}>Home</a></li>
        {loggedInUser && (
          <li className="myapplication" onClick={handleMyApplication}>My Applications</li>
        )}
         <li><nav className="search-job">
     <div className="search-bar">
     <form className="search" role="search">
     <input className="search-box" type="search" onChange={(e) => setSearch(e.target.value)} placeholder="Search Internships" aria-label="Search" />
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
                <div className="job-container">
                  <p className="job-status">Status: {job.Status}</p>
                  {/* <button className='job-details' onClick={() => handleShowDetails(job.id)}>i</button> */}
                  
                  <div className="job-title-container">
                    <h2 className="job-title">{job.Title}</h2>  
                    <button className="job-details" onClick={() => handleShowDetails(job.id)}>
                      <FontAwesomeIcon icon={faInfoCircle} />
                      <span className="tooltip-text">Show Details</span>
                    </button>
                  </div>
                  <span className="job-mentor">
                      <FontAwesomeIcon icon={faUserAlt} className="text-primary me-2" /> {job.Mentor}
                  </span>
                  <div className="job-actions">
                    <button className="btn btn-primary" onClick={() => handleApplyNowClick(job.id)}>Apply Now</button>
                    <small className="job-duration">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-primary me-2" /> Duration: {job.Duration}
                      <p className='skills'>Skills Required: {job.Skills}</p>
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination">
        <button disabled={currentPage <= 1} className="btn" onClick={handlePrevClick}>Prev</button>
        <span>{currentPage} of {totalPages}</span>
        <button disabled={currentPage >= totalPages} className="btn" onClick={handleNextClick}>Next</button>
      </div>
          {selectedInternship && (
          <div className="details-card">
            <h2>Internship Details</h2>
            <p><strong>Title:</strong> {selectedInternship.Title}</p>
            <p><strong>Mentor:</strong> {selectedInternship.Mentor}</p>
            <p><strong>Description:</strong> {selectedInternship.Description}</p>
            <p><strong>Duration:</strong> {selectedInternship.Duration}</p>
            <p><strong>Stipend:</strong> {selectedInternship.Stipend}</p>
            <p><strong>Internship Status:</strong> {selectedInternship.Status}</p>
            <p><strong>Skills Required:</strong> {selectedInternship.Skills}</p>
            <button onClick={handleCloseDetails}>Close</button>
          </div>
        )}
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
                    <ReCAPTCHA
                    sitekey="6LeooCUqAAAAAH0H6t4_fq6JkNZ7BpINBCDZTzpx"
                    onChange={handleRecaptchaChange}
                 />
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
          {!otpSent ? (
            <>
            <button className="close" onClick={() => setShowSignupPage(false)}>&times;</button>
            <div className={`registration form active`}>
              <header>Signup</header>
              <div id='recaptcha-container'></div>
              <form onSubmit={handleSignup}>
                <input
                  type="text"
                  name="first_name"
                  placeholder="Enter your first name"
                  value={signupData.first_name}
                  onChange={handleSignupChange}
                />
                {signupErrors.first_name && <span className="error">{signupErrors.first_name}</span>}
                <input
                  type="text"
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
                <input
                  type="text"
                  name="email"
                  placeholder="Enter your email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                />
                {signupErrors.email && <span className="error">{signupErrors.email}</span>}
                
                {/* Send Email Button to Trigger OTP */}
                <button type="submit" className='button' onClick={handleSendEmail}>Send OTP</button>
                {otpErrors && <span className="error">{otpErrors}</span>}

                <ReCAPTCHA
                  sitekey="6LeooCUqAAAAAH0H6t4_fq6JkNZ7BpINBCDZTzpx"
                  onChange={handleRecaptchaChange}
                />
                {signupErrors.general && <span className="error">{signupErrors.general}</span>}
                
                {/* <input
                  type="submit"
                  className="button"
                  value="Signup"
                  disabled={!otpSent || !isOtpVerified}
                /> */}
              </form>
              <div className="signup">
                <span className="signup">Already have an account?
                  <label htmlFor="click" onClick={() => setShowSignupPage(false)}>Login</label>
                </span>
              </div>
            </div>
            </>
          ) : (
            <div className={`otp-verification form active`}>
              <header>OTP Verification</header>
              <form onSubmit={handleOtpVerification}>
                <input
                  type="text"
                  name="otp_verification"
                  placeholder="Enter your OTP"
                  value={otpData.otp_verification}
                  onChange={handleOtpChange}
                />
                {otpErrors.otp && <span className="error">{otpErrors.otp}</span>}
                {otpErrors.error && <span className="error">{otpErrors.error}</span>}
                <input type="submit" className="button" value="Verify OTP" />
                {/* <div className="resend-otp">
                  <span>Didn't receive an OTP?
                    <label onClick={resendOtp}>Resend OTP</label>
                  </span>
                </div> */}
              </form>
            </div>
          )}
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
      
      {/* {showOtp &&(
        <Otp/>
      )}  */}
      {/* <div className="pagination">
        <button disabled={currentPage <= 1} className="btn" onClick={handlePrevClick}>Prev</button>
        <span>{currentPage} of {totalPages}</span>
        <button disabled={currentPage >= totalPages} className="btn" onClick={handleNextClick}>Next</button>
      </div> */}
      
    </div>
  );
};

export default Home;
