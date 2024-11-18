import React, { useState } from 'react';
import { FormControl, FormLabel, Input, Button } from '@mui/joy';
import axios from 'axios';
import './login.css';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Form submitted");

    try {
        const response = await axios.post('http://localhost:5000/login', { email, password });
        console.log("Response:", response);  // Log the response to see if it's coming back
        if (response.status === 200) {
          localStorage.setItem('userEmail', email);
          console.log(localStorage.getItem('userEmail')); // Log stored email for verification
          navigate('/Packages');
        }
    } catch (err) {
        console.log("Error:", err);  // Log the error if there's an issue
        if (err.response && err.response.data) {
            setError(err.response.data.message);
        } else {
            setError('Something went wrong!');
        }
    }
  };

  return (
    <div className="parent-container">
      <img className="background_image" src="/bg_jmg1.jpg" alt="Background" />
      <div className="container">
        <img src="/DarkRoamReady.png" alt="Roam Ready Logo" />
        <div className="Sign">Sign in to continue</div>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="johndoe@email.com"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
          </FormControl>
          <Button type="submit" variant="contained" color="primary">
            Sign In
          </Button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
