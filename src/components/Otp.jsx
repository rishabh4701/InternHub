import React, { useState, useRef } from 'react';
import firebase from './firbase_config';


const Otp = () => {
  const [phoneNumber, setphoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const recaptchaRef = useRef(null);

  const handleSendOtp = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.innerHTML = '<div id="recaptcha-container"></div>'
    }
    const verifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
size: 'invisible'
    });
    firebase.auth().signInWithPhoneNumber(phoneNumber, verifier)
    .then(confirmationResult => {
     setVerificationId(confirmationResult.verificationId);
    })
    .catch(error => {
      console.error(error);
    });
  };

  return(
<div>
  <h3>OTP Verify</h3>
  <div ref={recaptchaRef}></div>
  <input type="tel"
  placeholder='+911234567890'
  value={phoneNumber}
  onChange={ e => setphoneNumber(e.target.value)}
   />
   <button onClick={handleSendOtp}>Send OTP</button>
</div>
  );
}
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