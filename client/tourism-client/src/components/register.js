import React, { useState } from 'react';
import axios from 'axios';
import './register.css';
const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/register', formData)
            .then(response => {
                setMessage('Registration successful!');
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.message) {
                    setMessage(error.response.data.message); // Display specific error message
                    console.log("Error:", error.response.data.message); 
                } else {
                    setMessage('Registration failed. Please try again.');
                    console.log("Error:", error.message); 
                }
            });
    };

    return (
        <div className="parent-container">
            <img className="background_image" src="/bg_jmg1.jpg" alt="Background" />
            <div className="container">
            <img src="/DarkRoamReady.png" alt="Roam Ready Logo" />
            <div className="Sign">Register to continue</div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className='Name'>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className='Email'>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className='Password'>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit">Register</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default Register;
