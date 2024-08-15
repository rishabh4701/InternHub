import React, { useState } from 'react';
//import './emailotp.css';
import emailjs from 'emailjs-com';

const Otp = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [otpSent, setOtpSent] = useState(false);

  const sendOTP = () => {
    let otp_val = Math.floor(Math.random() * 10000);
    setGeneratedOtp(otp_val);

    let emailBody = `<h2>Your OTP is </h2>${otp_val}`;

    emailjs.send('service_elco1zp', 'template_gm3clqq', {
        to_email: email,
        otp: otp_val,
        message: emailBody
      }, 'LPYKBbs7hJvgaqLAY')
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        alert("OTP sent to your email " + email);
        setOtpSent(true);
      })
      .catch((err) => {
        console.error('FAILED...', err);
        alert("Failed to send OTP. Please try again.");
      });
  };

  const verifyOTP = () => {
    if (otp == generatedOtp) {
      alert("Email address verified...");
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="form">
      <h1>OTP Verification</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter Email..."
      />
      {otpSent && (
        <div className="otpverify" style={{ display: 'flex' }}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter the OTP sent to your Email..."
          />
          <button className="btn" onClick={verifyOTP}>Verify OTP</button>
        </div>
      )}
      <button className="btn" onClick={sendOTP}>Send OTP</button>
    </div>
  );
};

export default Otp;


// import React, { useState } from 'react';
// import PhoneInput from 'react-phone-input-2';
// //import OTPInput from 'react-otp-input';
// import 'react-phone-input-2/lib/style.css';
// import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
// import {auth} from '../firebase/setup';
// function Otp() {
//    const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");
//   const [user, setUser] = useState(null);
    
  
//   const sendOtp = async() => {
//  try {
//  const recaptcha = new RecaptchaVerifier(auth, "recaptcha",{});
//    const confirmation = await signInWithPhoneNumber(auth, phone, recaptcha);  
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

// return(
//         <div className='phone-signin'>
//             <div>
//             <PhoneInput
//         country={"IN"}
//         value={phone}
//         onChange={(phone) => setPhone("+" + phone)}
//         />
//          <button className='otp-btn' onClick={sendOtp}>Send OTP</button>
//          <div id='recaptcha'></div>
//                     <input type="number"
//                     name='OTP'
//                     placeholder='Enter the OTP'
//                     onChange={(e) => setOtp(e.target.value)}
//                     />
//                     <button className='otp-verify' onClick={verifyOtp}>Verify OTP</button>
//             </div>
        
//         </div>
//     )
// }
// export default Otp;