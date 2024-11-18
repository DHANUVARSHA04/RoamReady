import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PlaceList from './components/placelist';
import Register from './components/register';
import Home from './components/Home';
import Login from './components/login'
import Loginadm from './components/loginadm';
import Packadm from './components/packadm'
import PackageDetails from './components/packagedetails'
import History from './components/history';
import Review from './components/review';
import Logout from './components/logout';
import PackageEdit from './components/packedit';
function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/Packages" element={<PlaceList />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/loginadm" element={<Loginadm />} />
                    <Route path="/Packagesadm" element={<Packadm />} />
                    <Route path="/packages/:package_id" element={<PackageDetails />} />
                    <Route path="/history" element={<History/>} />
                    <Route path="packages/review/:package_id" element={<Review/>} />
                    <Route path="editpackages/:package_id" element={<PackageEdit/>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
