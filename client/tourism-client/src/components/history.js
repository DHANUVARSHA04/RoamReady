import axios from 'axios';
import './history.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const History = () => {
    const [history, setHistory] = useState([]); // For storing the booking history
    const [totalSpent, setTotalSpent] = useState(0); // For storing total amount spent
    const [userEmail, setUserEmail] = useState(''); // For storing the logged-in user's email

    useEffect(() => {
        console.log('useEffect triggered');
        const email = localStorage.getItem('userEmail'); // Retrieve email from localStorage
        console.log('Email from localStorage:', email);

        if (email) {
            setUserEmail(email); // Set user email in state

            // Fetch the user's booking history and total spent amount from the backend API
            axios
                .get('http://localhost:5000/api/user/history', { params: { email: email } })
                // Encoding the email
                .then((response) => {
                    console.log('API Response:', response.data); // Log API response for debugging
                    setHistory(response.data.history);  // Set the booking history data
                    setTotalSpent(parseFloat(response.data.totalSpent));  // Set the total amount spent (ensure it's a number)
                })
                .catch((error) => {
                    console.error("There was an error fetching the history:", error);
                });
        }
    }, []);

    return (
        <div>
            <img className="background_image" src="/bg_jmg1.jpg" alt="Background" />
            <nav className="navigation-bar">
                <ul>
                    <li>
                        <img src="/RoamReady.png" alt="Roam Ready Logo" />
                    </li>
                    <li className="spacer"></li>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/packages">Find Packages</Link></li>
                    {!userEmail && (
                        <>
                            <li><Link to="/register">Register</Link></li>
                            <li><Link to="/login">Login</Link></li>
                        </>
                    )}
                    {userEmail && (
                        <>
                            <li><Link to="/history">History</Link></li>
                            <li><Link to="/logout">Logout</Link></li>
                        </>
                    )}
                </ul>
            </nav>

            <h1>Welcome {userEmail ? userEmail : 'Guest'}</h1>
            <h2 className="Title">Booking History</h2>

            {/* Display Total Amount Spent */}
            {userEmail && (
                <div className="total-spent">
                    <h3>Total Amount Spent: ${totalSpent.toFixed(2)}</h3>
                </div>
            )}

            <div className="package-list">
                {history.length > 0 ? (
                    history.map((booking) => (
                        <div key={booking.booking_id} className="package-card">
                            <h2 className="package-name">{booking.package_name}</h2>
                            <p className="booking-date">Booked on: {new Date(booking.booking_date).toLocaleDateString()}</p>
                            <p className="payment-date">Payment Date: {new Date(booking.payment_date).toLocaleDateString()}</p>
                            <p className="package-price">Amount Paid: ${parseFloat(booking.amount).toFixed(2)}</p>
                            <Link to={`/packages/review/${booking.package_id}`} className="Review-link">Leave Review</Link>
                        </div>
                        
                    ))
                ) : (
                    <p>No bookings found</p>
                )}
                
            </div>
        </div>
    );
};

export default History;
