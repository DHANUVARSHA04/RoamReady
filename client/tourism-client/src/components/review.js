import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, Navigate } from 'react-router-dom';
import './packagedetails.css';
import { useNavigate } from 'react-router-dom';

const Review = () => {
    const { package_id } = useParams(); // Get package_id from URL
    const [packageDetails, setPackageDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [showForm, setShowForm] = useState(false); // State to toggle the form visibility
    const [reviewText, setReviewText] = useState(""); // State for review text
    const [rating, setRating] = useState(0); // State for rating (out of 5)
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
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching package details:', error);
                setError('Failed to load package details.');
                setLoading(false);
            });
    }, [package_id]);

    const HandleReview = () => {
        setShowForm(true); // Show the form when the button is clicked
    };

    const handleReviewChange = (e) => {
        setReviewText(e.target.value); // Update review text
    };

    const handleRatingChange = (newRating) => {
        setRating(newRating); // Update rating
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const intPackageId = parseInt(package_id, 10);
        // Collect data for review submission
        const reviewData = {
            userEmail: userEmail,
            packageId: intPackageId,
            reviewText: reviewText, // Include review text
            rating: rating // Include the rating
        };
        console.log(reviewData)
        // Send this data to the backend (assuming a POST request for review submission)
        axios.post('http://localhost:5000/api/reviews', reviewData)
            .then((response) => {
                alert("Review submitted successfully!");
                setShowForm(false); // Close the form after successful submission
                setReviewText(""); // Clear review text
                setRating(0); // Reset the rating
                navigate('/history')
            })
            .catch((error) => {
                console.error('Error submitting review:', error);
                alert("Failed to submit review.");
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

            <button className="Book" onClick={HandleReview}>Write a Review</button>

            {/* Conditionally render the review form */}
            {showForm && (
                <div className="ReviewForm">
                    <form onSubmit={handleFormSubmit}>
                        <label htmlFor="reviewText" >Your Review:</label>
                        <textarea
                            id="reviewText"
                            value={reviewText}
                            onChange={handleReviewChange}
                            placeholder="Write your review here..."
                            rows="4"
                            cols="50"
                            required
                        />
                        <br />
                        <label >Rating:</label>
                        {/* Render 5 stars for rating */}
                        <div className="rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`star ${rating >= star ? 'filled' : ''}`}
                                    onClick={() => handleRatingChange(star)}
                                >
                                    &#9733;
                                </span>
                            ))}
                        </div>
                        <br />
                        <button className='Buttonsub' type="submit">Submit Review</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Review;
