import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Registration.css';

const RegistrationForm = ({ closeModal, userId, iId }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    adddress: '',
    email: '',
    phone_number: '',
    college_name: '',
    department: '',
    custom_department: '',
    roll_no: '',
    course: '',
    year_of_study: '',
    resume: null,
    idCard: null,
    user_id: '',  
    i_id: '',  
    status: '',  
    skills: '',
    addskills: 'none'
  });

  const [availableSkills, setAvailableSkills] = useState([]); // State to store available skills
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [idCardUploaded, setIdCardUploaded] = useState(false); // New state for ID card upload
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const departments = [
    'Computer Science & Engineering', 'Electrical Engineering', 'Mechanical Engineering',
    'Civil Engineering', 'Architecture', 'Electronics and Communication Engineering',
    'Metallurgical Engineering', 'Materials Engineering', 'Other'
  ];

  const courses = ['B.Tech', 'M.Tech'];
  const year_of_study = ['1', '2', '3', '4'];

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/internships/${iId}/`);
        const skillsArray = response.data.Skills.split(',').map(skill => skill.trim()); // Convert string to array and trim spaces
        setAvailableSkills(skillsArray); // Set the available skills as an array
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    fetchSkills();
  }, [iId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      let updatedSkills = formData.skills.split(',').filter(skill => skill !== ''); // Convert string to array
      if (checked) {
        updatedSkills.push(value);
      } else {
        updatedSkills = updatedSkills.filter(skill => skill !== value);
      }
      setFormData({ ...formData, skills: updatedSkills.join(',') }); // Convert array back to string
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = (values) => {
    const errors = {};
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(values.email)) {
      errors.email = "This is not a valid email";
    }
    if (!/^\d{10}$/.test(values.phone_number)) {
      errors.phone_number = "Not a valid number";
    }

    const selectedSkills = values.skills.split(',').filter(skill => skill !== '');
    if (selectedSkills.length !== availableSkills.length) {
    errors.skills = "Please select all the required skills";
    }
    return errors;
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      if (file.size <= 10 * 1024 * 1024) {
        setFormData({ ...formData, [name]: file, user_id: JSON.stringify(userId), i_id: JSON.stringify(iId) });
        if (name === 'resume') {
          setResumeUploaded(true);
        } else if (name === 'idCard') {
          setIdCardUploaded(true);
        }

      } else {
        alert('File size should not exceed 10 MB.');
        e.target.value = null; 
        if (name === 'resume') {
          setResumeUploaded(false);
        } else if (name === 'idCard') {
          setIdCardUploaded(false);
        }
      }
    } else {
      alert('Please upload a PDF file.');
      e.target.value = null;
      if (name === 'resume') {
        setResumeUploaded(false);
      } else if (name === 'idCard') {
        setIdCardUploaded(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const errors = validate(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
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

        setFormData({
          ...formData,
          user_id: response.data.user_id || '',
          i_id: response.data.i_id || ''
        });

        alert('Registration successful!');
        closeModal();
      } catch (error) {
        console.error('There was an error submitting the form!', error);
        alert('There was an error submitting the form!');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmitting) {
      console.log(formData);
    }
  }, [formErrors]);

  return (
    <div className="container1">
      <button className="close1" onClick={closeModal}>&times;</button>
      <div className="title">Registration</div>
      <div className="content">
        <form onSubmit={handleSubmit}>
          <div className="user-details">
            <div className="input-box">
              <span className="details">First Name &#42;</span>
              <input
                type="text"
                name="first_name"
                placeholder="Enter your first name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-box">
              <span className="details">Last Name &#42;</span>
              <input
                type="text"
                name="last_name"
                placeholder="Enter your last name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-box">
              <span className="details">Address &#42;</span>
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
              <span className="details">Email &#42;</span>
              <input
                type="text"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              /><p>{formErrors.email}</p>
            </div>
            
            <div className="input-box">
              <span className="details">Phone Number &#42;</span>
              <input
                type="text"
                name="phone_number"
                placeholder="Enter your phone number"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />  <p>{formErrors.phone_number}</p>
            </div>
          
            <div className="input-box">
              <span className="details">College Name &#42;</span>
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
              <span className="details">Course &#42;</span>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Course </option>
                {courses.map((course, index) => (
                  <option key={index} value={course}>{course}</option>
                ))}
              </select>

            </div>
            <div className="input-box">
              <span className="details">Department (If other please specify ) &#42;</span>
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
              {formData.department === 'Other' && (
                <div className="input-box">
                  <span className="details">Other Department &#42;</span>
                  <input
                    type="text"
                    name="custom_department"
                    placeholder="Enter your department"
                    value={formData.custom_department}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
            </div>
            <div className="input-box">
              <span className="details">Roll Number &#42;</span>
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
              <span className="details">Year of Study &#42;</span>
              <select
                name="year_of_study"
                value={formData.year_of_study}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Year</option>
                {year_of_study.map((year, index) => (
                  <option key={index} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="input-box">
              <span className="details">Upload Resume (PDF only, max 10MB) &#42;</span>
              <input
                type="file"
                name="resume"
                accept="application/pdf"
                onChange={handleFileChange}
                required
              />
              {resumeUploaded && <span className="upload-message">Resume has been uploaded</span>}
            </div>
            <div className="input-box">
              <span className="details">Upload ID Card (PDF only, max 10MB) &#42;</span>
              <input
                type="file"
                name="idCard" // New input for ID card
                accept="application/pdf"
                onChange={handleFileChange}
                required
              />
              {idCardUploaded && <span className="upload-message">ID card has been uploaded</span>}
            </div>
            <div className="skill-box">
          <span className="details">Skills Required &#42;</span>
          {availableSkills.map((skill, index) => (
            <div key={index} className='checkboxes'>
              <label>
                {skill}
                <input 
                  type="checkbox" 
                  name="skills" 
                  value={skill}
                  checked={formData.skills.includes(skill)}
                  onChange={handleChange}
                />
              </label>
            </div>
          ))}
          {formErrors.skills && <p className="error">{formErrors.skills}</p>}
        </div>
            <div className="input-box">
              <span className="details">Additional Skills (comma-separated) &#42;</span>
              <input
                type="text"
                name="addskills"
                placeholder="Enter your Additional Skills if any"
                value={formData.addskills}
                onChange={handleChange}
                required
              />
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
