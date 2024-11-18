import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import './package.css';

const Packadm = () => {
    const [places, setPlaces] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [newPackage, setNewPackage] = useState({
        package_name: '',
        destination_id: '',
        price: '',
        details: ''
    });

    // Fetch all places initially
    useEffect(() => {
        fetchAllPlaces();
    }, []);

    const fetchAllPlaces = () => {
        axios.get('http://localhost:5000/api/places')
            .then(response => setPlaces(response.data))
            .catch(error => console.error('Error fetching data:', error));
    };

    const fetchSearchResults = () => {
        if (searchQuery.trim()) {
            axios.get(`http://localhost:5000/api/places/search?query=${searchQuery}`)
                .then(response => setPlaces(response.data))
                .catch(error => console.error('Error fetching search results:', error));
        } else {
            fetchAllPlaces();
        }
    };

    useEffect(() => {
        fetchSearchResults();
    }, [searchQuery]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPackage({ ...newPackage, [name]: value });
    };

    const handleAdd = () => setShowForm(prevShowForm => !prevShowForm);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/api/add-package', newPackage)
            .then(response => {
                console.log('Package added:', response.data);
                fetchAllPlaces(); // Refresh package list
                setShowForm(false); // Hide form
                setNewPackage({
                    package_name: '',
                    destination_id: '',
                    price: '',
                    details: ''
                });
            })
            .catch(error => console.error('Error adding package:', error));
    };

    return (
        <div>
            <img className="background_image" src="/bg_jmg1.jpg" alt="Background" />
            <nav className="navigation-bar">
                <ul>
                    <li><img src="/RoamReady.png" alt="Roam Ready Logo" /></li>
                    <li className="spacer"></li>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/packagesadm">Find Packages</Link></li>
                    <li><Link to="/logout">Logout</Link></li>
                </ul>
            </nav>
            <h1>Edit Packages</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by destination..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={fetchSearchResults}>Search</button>
            </div>
            <button className="Add" onClick={handleAdd}>Add</button>
            {showForm && (
                <div className="add-form">
                    <h2>Add Package</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="package_name"
                            placeholder="Package Name"
                            value={newPackage.package_name}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="number"
                            name="destination_id"
                            placeholder="Destination ID"
                            value={newPackage.destination_id}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="number"
                            step="0.01"
                            name="price"
                            placeholder="Price"
                            value={newPackage.price}
                            onChange={handleInputChange}
                            required
                        />
                        <textarea
                            name="details"
                            placeholder="Details"
                            value={newPackage.details}
                            onChange={handleInputChange}
                        ></textarea>
                        <button type="submit">Add Package</button>
                    </form>
                </div>
            )}
            <div className="package-list">
                {places.length > 0 ? (
                    places.map((place) => (
                        <div key={place.package_id} className="package-card">
                            <h2 className="package-name">{place.package_name}</h2>
                            <button
                                onClick={() => window.location.href = `/editpackages/${place.package_id}`}
                                className="details-link"
                            >
                                Edit Package
                            </button>
                            <p className="Package-Place">{place.destination_name}</p>
                            <p className="package-price">Price: ${place.price}</p>
                            <Link to={`/packages/${place.package_id}`} className="details-link">View Details</Link>
                        </div>
                    ))
                ) : (
                    <p>No packages found.</p>
                )}
            </div>
        </div>
    );
};

export default Packadm;
