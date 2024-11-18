import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './package.css';

const PlaceList = () => {
    const [places, setPlaces] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve the email from localStorage
        const email = localStorage.getItem('userEmail');
        if (email) {
            setUserEmail(email);
    }}, [navigate]);

    // Fetch all places initially
    useEffect(() => {
        axios.get('http://localhost:5000/api/places')
            .then(response => setPlaces(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // Handle the search
    const handleSearch = () => {
        if (searchQuery.trim()) {
            axios.get(`http://localhost:5000/api/places/search?query=${searchQuery}`)
                .then(response => setPlaces(response.data))
                .catch(error => console.error('Error fetching search results:', error));
        } else {
            // If search is empty, reset to show all packages
            axios.get('http://localhost:5000/api/places')
                .then(response => setPlaces(response.data))
                .catch(error => console.error('Error fetching data:', error));
        }
    };

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
                            <li><Link to="/Logout"> Logout</Link></li>
                        </>
                    )

                    }
                </ul>
            </nav>
            <h1>Welcome {userEmail ? userEmail : 'Guest'}</h1>
            <h2 className='Title'>Our Packages</h2>
            
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by destination..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            <div className="package-list">
                {places.map((place, index) => (
                    <div key={index} className="package-card">
                        <h2 className="package-name">{place.package_name}</h2>
                        <p className='Package-Place'>{place.destination_name}</p>
                        <p className='Package-Rating'>Rating :{place.rating}</p>
                        <p className="package-price">Price: ${place.price}</p>
                        <Link to={`/packages/${place.package_id}`} className="details-link">View Details</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlaceList;
