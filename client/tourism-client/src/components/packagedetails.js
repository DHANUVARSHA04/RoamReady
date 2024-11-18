import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './packagedetails.css';
import { useNavigate } from 'react-router-dom';

const PackageDetails = () => {
    const { package_id } = useParams(); // Get package_id from URL
    const [packageDetails, setPackageDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [showForm, setShowForm] = useState(false); // State to toggle the form visibility
    const [paymentMethod, setPaymentMethod] = useState("credit-card");
    const [reviews, setReviews] = useState([]); // State to hold reviews

    const navigate = useNavigate();

    useEffect(() => {
        const email = localStorage.getItem('userEmail');
        if (email) {
            setUserEmail(email);
        }
    }, []);

    useEffect(() => {
        // Fetch the details of the specific package by ID
        axios.get(`http://localhost:5000/api/places/${package_id}`)
            .then(response => {
                setPackageDetails(response.data);
                setReviews(response.data.reviews); // Set reviews from the response
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching package details:', error);
                setError('Failed to load package details.');
                setLoading(false);
            });
    }, [package_id]);

    const handleBookNow = () => {
        setShowForm(true); // Show the form when the button is clicked
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const bookingData = {
            userEmail: userEmail,
            packageId: package_id,
            paymentMethod: paymentMethod,
            amount: packageDetails.price,
            type: paymentMethod
        };

        axios.post('http://localhost:5000/api/bookings', bookingData)
            .then(response => {
                alert("Booking successful!");
                setShowForm(false);
                navigate('/Packages');
            })
            .catch(error => {
                console.error('Error processing booking:', error);
                alert("Failed to complete booking.");
            });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

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
                </ul>
            </nav>
            <div className="package-details">
                <h1>{packageDetails.package_name}</h1>
                <p>Destination: {packageDetails.destination_name}</p>
                <p>Price: ${packageDetails.price}</p>
                <p>Description: {packageDetails.details}</p>
            </div>
            
            <div className="reviews-section">
                <h2>Reviews</h2>
                {reviews.length === 0 ? (
                    <p>No reviews yet. Be the first to review!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.review_id} className="review">
                            <p><strong>{review.userEmail}</strong> rated it {review.rating}/5 commented {review.comment}</p>
                            <p></p>
                        </div>
                    ))
                )}
            </div>


            <button className="Book" onClick={handleBookNow}>Book NOW!!</button>

            {/* Conditionally render the booking form */}
            {showForm && (
                <div className="booking-form">
                    <h2>Book Your Package</h2>
                    <form onSubmit={handleFormSubmit}>
                        <label htmlFor="payment">Payment Method:</label>
                        <select id="payment" name="payment" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} required>
                            <option value="credit-card">Credit Card</option>
                            <option value="paypal">PayPal</option>
                            <option value="bank-transfer">Bank Transfer</option>
                        </select>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PackageDetails;
