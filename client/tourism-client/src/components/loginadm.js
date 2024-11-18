import React, { useEffect, useState } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import axios from 'axios';
import './login.css';
import { useNavigate } from 'react-router-dom';




export default function Loginadm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handle form submission
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Form submitted");

    try {
        const response = await axios.post('http://localhost:5000/loginadm', { email, password });
        console.log("Response:", response);  // Log the response to see if it's coming back
        if (response.status === 200) {
            navigate('/Packagesadm');
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
        <li><a id="Login" href="loginadm"> Login as user</a></li>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
