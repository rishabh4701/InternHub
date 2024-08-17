import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './Signup.css';

const LoginRegistrationForm = ({ closeModal, setUser }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({ first_name: '', email: '', username: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});
  const [signupErrors, setSignupErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // New state to manage password visibility
  const [person, setPerson] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (person) {
      console.log('Updated person:', person); // Log the updated person state
    }
  }, [person]);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
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
    if (Object.keys(errors).length === 0) {
      axios.post('http://172.18.13.23:8000/auth/login/', loginData, { headers: { 'Content-Type': 'application/json' } })
        .then(response => {
          setUser(response.data); // Set the username
          navigate('/');
          
        })
        .catch(error => {
          if (error.response && error.response.data) {
            setLoginErrors(error.response.data);
          } else {
            setLoginErrors({ general: 'Invalid username or password' });
          }
        });
        console.log(person);
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const errors = validateSignup();
    setSignupErrors(errors);
    if (Object.keys(errors).length === 0) {
      axios.post('http://172.18.13.23:8000/auth/signup/', signupData, { headers: { 'Content-Type': 'application/json' } })
        .then(response => {
          alert('Signup successful! Please log in.'); // Alert for successful signup
          setIsChecked(false);
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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container">
      <button className="close" onClick={closeModal}>&times;</button>
      <input
        type="checkbox"
        id="check"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      <div className={`login form ${isChecked ? '' : 'active'}`}>
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
            <span className="password-toggle-icon" onClick={toggleShowPassword}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          {loginErrors.password && <span className="error">{loginErrors.password}</span>}
          {loginErrors.general && <span className="error">{loginErrors.general}</span>} <br />
          <a href="#">Forgot password?</a>
          <input type="submit" className="button" value="LogIn" />
        </form>
        <div className="signup">
          <span className="signup">Don't have an account?
            <label htmlFor="check">Signup</label>
          </span>
        </div>
      </div>
      <div className={`registration form ${isChecked ? 'active' : ''}`}>
        <header>Signup</header>
        <form onSubmit={handleSignup}>
          <input type="text" name="first_name" placeholder="Enter your first name" value={signupData.first_name} onChange={handleSignupChange} />
          {signupErrors.first_name && <span className="error">{signupErrors.first_name}</span>}
          <input type="text" name="email" placeholder="Enter your email" value={signupData.email} onChange={handleSignupChange} />
          {signupErrors.email && <span className="error">{signupErrors.email}</span>}
          <input type="text" name="username" placeholder="Username" value={signupData.username} onChange={handleSignupChange} />
          {signupErrors.username && <span className="error">{signupErrors.username}</span>}
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={signupData.password}
              onChange={handleSignupChange}
            />
            <span className="password-toggle-icon" onClick={toggleShowPassword}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          {signupErrors.password && <span className="error">{signupErrors.password}</span>}
          {signupErrors.general && <span className="error">{signupErrors.general}</span>}
          <input type="submit" className="button" value="Signup"/>
        </form>
        <div className="signup">
          <span className="signup">Already have an account?
            <label htmlFor="check">Login</label>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginRegistrationForm;
