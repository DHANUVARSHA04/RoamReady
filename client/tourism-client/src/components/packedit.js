import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './packagedetails.css';

const PackageEdit = () => {
    const { package_id } = useParams();
    const [packageDetails, setPackageDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("credit-card");
    const [reviews, setReviews] = useState([]);
    const [updatedDetails, setUpdatedDetails] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const email = localStorage.getItem('userEmail');
        if (email) setUserEmail(email);
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/places/${package_id}`)
            .then(response => {
                setPackageDetails(response.data);
                setUpdatedDetails(response.data); // Initialize form values
                setReviews(response.data.reviews);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching package details:', error);
                setError('Failed to load package details.');
                setLoading(false);
            });
    }, [package_id]);

    const handleEditNow = () => setShowForm(true);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:5000/api/places/${package_id}`, updatedDetails)
            .then(response => {
                alert("Package updated successfully!");
                setPackageDetails(updatedDetails); // Update displayed details
                setShowForm(false);
            })
            .catch(error => {
                console.error('Error updating package:', error);
                alert("Failed to update package.");
            });
    };

    const handleDeleteNow = () => {
        if (window.confirm("Are you sure you want to delete this package?")) {
            axios.delete(`http://localhost:5000/api/places/${package_id}`)
                .then(() => {
                    alert("Package deleted successfully!");
                    navigate('/packages'); // Redirect to packages list or home
                })
                .catch(error => {
                    console.error('Error deleting package:', error);
                    alert("Failed to delete package.");
                });
        }
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
                    <li><Link to="/packagesadm">Find Packages</Link></li>
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
                            <p><strong>{review.userEmail}</strong> rated it {review.rating}/5</p>
                            <p>{review.comment}</p>
                        </div>
                    ))
                )}
            </div>

            <button className="Book" onClick={handleEditNow}>Edit</button>
            <button className="Delete" onClick={handleDeleteNow}>Delete</button>
            {showForm && (
                <div className="edit-form">
                    <h2>Edit Package</h2>
                    <form onSubmit={handleFormSubmit}>
                        <label>
                            Package Name:
                            <input
                                type="text"
                                name="package_name"
                                value={updatedDetails.package_name || ''}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Destination Name:
                            <input
                                type="text"
                                name="destination_name"
                                value={updatedDetails.destination_name || ''}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Price:
                            <input
                                type="number"
                                name="price"
                                value={updatedDetails.price || ''}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Details:
                            <textarea
                                name="details"
                                value={updatedDetails.details || ''}
                                onChange={handleInputChange}
                            />
                        </label>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PackageEdit;
