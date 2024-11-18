import React, { useEffect } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
const Logout = () => {
    // Function to handle scroll and apply/remove the 'blurred' class
    const navigate=useNavigate();
    useEffect(() => {
        localStorage.clear(); // Clears all data in localStorage
        console.log("localStorage after clearing:", localStorage);
        navigate("/");
    }, []);
    const handleScroll = () => {
        const navigationBar = document.querySelector('.navigation-bar');
        if (window.scrollY > 50) { // Apply blur after scrolling 50px
            navigationBar.classList.add('blurred');
        } else {
            navigationBar.classList.remove('blurred');
        }
    };

    useEffect(() => {
        // Add scroll event listener on component mount
        window.addEventListener('scroll', handleScroll);
        // Clean up event listener on component unmount
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div>
            <nav className="navigation-bar">
                <ul>
                    <li>
                        <img src="/RoamReady.png" alt="Roam Ready Logo" />
                    </li>
                    <li className="spacer"></li> {/* Spacer item */}
                    <li><a href="#">Home</a></li>
                    <li><a href="Packages">Find Packages</a></li>
                    <li><a id="Register" href="register">Register</a></li>
                    <li><a id="Login" href="login"> Login</a></li>
                    <li><a id="Loginadm" href="Loginadm">Login AS admin</a></li>
                </ul>
            </nav>
            <img className="background_image" src="/bg_jmg1.jpg" alt="Background" />
            <div className="image-container">
                <img  src="/mountainboy.jpeg" alt="Mountain Boy" />
                <img  src="/beachfamily.jpeg" alt="Mountain Boy" />
                <img src="/Mountaingirl.jpeg" alt="Mountain Boy" />
            </div>
            <h1>THANK YOU FOR USING RoamReady</h1>
        </div>
    );
};

export default Logout;
