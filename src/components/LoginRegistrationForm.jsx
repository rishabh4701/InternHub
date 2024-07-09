// src/LoginRegistrationForm.js
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

const LoginRegistrationForm = ({ closeModal }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({ first_name: '', email: '', username: '', password: '' });
  const history = useHistory();

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://172.18.13.26:8000/auth/login/', loginData, { headers: { 'Content-Type': 'application/json' } })
      .then(response => {
        history.push('/dashboard');
      })
      .catch(error => {
        console.error('Login error', error);
      });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    axios.post('http://172.18.13.26:8000/auth/signup/', signupData, { headers: { 'Content-Type': 'application/json' } })
      .then(response => {
        setIsChecked(false);
      })
      .catch(error => {
        console.error('Signup error', error);
      });
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
          <input type="password" name="password" placeholder="Enter your password" value={loginData.password} onChange={handleLoginChange} />
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
          <input type="text" name="first_name" placeholder="Enter your first_name" value={signupData.first_name} onChange={handleSignupChange} />
          <input type="text" name="email" placeholder="Enter your email" value={signupData.email} onChange={handleSignupChange} />
          <input type="text" name="username" placeholder="Username" value={signupData.username} onChange={handleSignupChange} />
          <input type="password" name="password" placeholder="Password" value={signupData.password} onChange={handleSignupChange} />
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
