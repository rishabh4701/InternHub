import React, { useState } from 'react';
import axios from 'axios';
import './Registration.css';

const RegistrationForm = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    adddress: '',
    email: '',
    phone_number: '',
    college_name: '',
    department: '',
    roll_no: '',
    course: '',
    year_of_study: '',
    resume: ''
  });

  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = [
    'Computer Science & Engineering', 'Electrical Engineering', 'Mechanical Engineering',
    'Civil Engineering', 'Architecture', 'Electronics and Communication Engineering',
    'Metallurgical Engineering', 'Materials Engineering' ]; 

  const courses = ['B.Tech', 'M.Tech'];
  const year_of_study = ['1st', '2nd', '3rd', '4th'];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData({ ...formData, resume: file });
      setResumeUploaded(true);
    } else {
      alert('Please upload a PDF file.');
      e.target.value = null; // Clear the input
      setResumeUploaded(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    try {
      const response = await axios.post('http://127.0.0.1:8000/students/students/', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(response.data);
      alert('Registration successful!');
      closeModal();
    } catch (error) {
      console.error('There was an error submitting the form!', error);
      alert('There was an error submitting the form!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container1">
      <button className="close1" onClick={closeModal}>&times;</button>
      <div className="title">Registration</div>
      <div className="content">
        <form onSubmit={handleSubmit}>
          <div className="user-details">
            <div className="input-box">
              <span className="details">First Name</span>
              <input
                type="text"
                name="first_name"
                placeholder="Enter your name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-box">
              <span className="details">Last Name</span>
              <input
                type="text"
                name="last_name"
                placeholder="Enter your last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-box">
              <span className="details">Address</span>
              <input
                type="text"
                name="adddress"
                placeholder="Enter your address"
                value={formData.adddress}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-box">
              <span className="details">Email</span>
              <input
                type="text"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-box">
              <span className="details">Phone Number</span>
              <input
                type="text"
                name="phone_number"
                placeholder="Enter your phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-box">
              <span className="details">College Name</span>
              <input
                type="text"
                name="college_name"
                placeholder="Enter your college name"
                value={formData.college_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-box">
              <span className="details">Course</span>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Course</option>
                {courses.map((course, index) => (
                  <option key={index} value={course}>{course}</option>
                ))}
              </select>
            </div> 
            <div className="input-box">
              <span className="details">Department</span>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Department</option>
                {departments.map((department, index) => (
                  <option key={index} value={department}>{department}</option>
                ))}
              </select>
            </div> 
            <div className="input-box">
              <span className="details">Roll Number</span>
              <input
                type="text"
                name="roll_no"
                placeholder="Enter your Roll Number"
                value={formData.roll_no}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-box">
              <span className="details">Year of Study</span>
              <select
                name="year_of_study"
                value={formData.year_of_study}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Year of Study</option>
                {year_of_study.map((year_of_study, index) => (
                  <option key={index} value={year_of_study}>{year_of_study}</option>
                ))}
              </select>
            </div> 
            <div className="input-box">
              <span className="details">Upload Resume (PDF only)</span>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                required
              />
              {resumeUploaded && <span className="upload-message">File has been uploaded</span>}
            </div>
          </div>
          <div className="button">
            <input type="submit" value="Register" disabled={isSubmitting} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
