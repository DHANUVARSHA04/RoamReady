const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Dhanu',
    database: 'tourism_app'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Basic route to fetch data
app.get('/api/places', (req, res) => {
    const query = `
        SELECT p.package_id, p.package_name, p.price, p.details, d.destination_id, d.name AS destination_name,p.rating
        FROM package p
        JOIN destination d ON p.destination_id = d.destination_id;
    `;
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});


app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    console.log("Received data:", { name, email, password });
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, password], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                res.status(400).json({ message: 'Username or email already exists' });
            } else {
                res.status(500).json({ message: 'Database error', error: err });
            }
        } else {
            res.status(201).json({ message: 'User registered successfully' });
        }
    });
});
// User login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log("Received login data:", { email, password });

    // Query to find the user by email
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = results[0];
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful', user });
    });
});
app.post('/loginadm', (req, res) => {
    const { email, password } = req.body;
    console.log("Received login data:", { email, password });

    // Query to find the user by email
    const query = 'SELECT * FROM admin WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = results[0];
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful', user });
    });
});


// Search packages by destination name
app.get('/api/places/search', (req, res) => {
    const searchQuery = req.query.query; // The search query parameter
    const sql = `
        SELECT p.package_id, p.package_name, p.destination_id, p.price
        FROM package p
        JOIN destination d ON p.destination_id = d.destination_id
        WHERE d.name LIKE ?`;

    // Use wildcard (%) to match any string containing the query
    db.query(sql, [`%${searchQuery}%`], (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});
// Route to fetch a specific package by ID
app.get('/api/places/:id', (req, res) => {
    const packageId = req.params.id;
    const query = `
        SELECT p.package_id, p.package_name, p.price, p.details, d.destination_id, d.name AS destination_name,
               r.review_id, r.user_id, r.rating, r.review_date, r.comment
        FROM package p
        JOIN destination d ON p.destination_id = d.destination_id
        LEFT JOIN reviews r ON p.package_id = r.package_id
        WHERE p.package_id = ?;
    `;
    
    db.query(query, [packageId], (err, results) => {
        if (err) {
            console.error('Error fetching package:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        
        if (results.length === 0) {
            // No package found with the given ID
            return res.status(404).json({ message: 'Package not found' });
        }
        
        // Organize the results to include the reviews separately
        const packageDetails = {
            package_id: results[0].package_id,
            package_name: results[0].package_name,
            price: results[0].price,
            details: results[0].details,
            destination: {
                destination_id: results[0].destination_id,
                destination_name: results[0].destination_name
            },
            reviews: []
        };
        
        // Loop through results and add reviews to the packageDetails
        results.forEach(result => {
            if (result.review_id) {
                packageDetails.reviews.push({
                    review_id: result.review_id,
                    user_id: result.user_id,
                    rating: result.rating,
                    review_date: result.review_date,
                    comment: result.comment
                });
            }
        });
        
        // Send the package details with reviews
        res.json(packageDetails);
    });
});




// POST /api/bookings
app.post('/api/bookings', async (req, res) => {
    const { userEmail, packageId, paymentMethod, amount } = req.body;
    console.log("Received booking data:", { userEmail, packageId, paymentMethod, amount });

    try {
        // First, insert the booking
        const bookingQuery = `
            INSERT INTO booking (user_id, package_id, booking_date, status) 
            VALUES (
                (SELECT user_id FROM users WHERE email = ?), 
                ?, 
                CURDATE(), 
                "Confirmed"
            )
        `;
        
        db.query(bookingQuery, [userEmail, packageId], (bookingError, bookingResults) => {
            if (bookingError) {
                console.error('Error saving booking:', bookingError);
                return res.status(500).json({ error: 'An error occurred while processing your booking' });
            }

            // Now that we have the booking_id from the inserted booking, we can insert the payment
            const bookingId = bookingResults.insertId;  // Get the newly created booking_id

            const paymentQuery = `
                INSERT INTO payment (booking_id, payment_date, amount, type) 
                VALUES (?, CURDATE(), ?, ?)
            `;
            
            db.query(paymentQuery, [bookingId, amount, paymentMethod], (paymentError, paymentResults) => {
                if (paymentError) {
                    console.error('Error saving payment:', paymentError);
                    return res.status(500).json({ error: 'An error occurred while processing the payment' });
                }

                // Responding with a success message
                res.status(200).json({ message: 'Booking and payment processed successfully' });
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'An unexpected error occurred while processing your booking and payment' });
    }
});
app.get('/api/user/history', (req, res) => {
    console.log("Request query parameters:", req.query);  // Log the whole query object
    const email = req.query.email;
    console.log("Email from query:", email);
    const historyQuery = `
        SELECT b.booking_id, p.payment_date, p.amount, pkg.package_name, b.booking_date ,pkg.package_id
        FROM booking b
        JOIN payment p ON b.booking_id = p.booking_id
        JOIN package pkg ON b.package_id = pkg.package_id
        JOIN users u ON b.user_id = u.user_id
        WHERE u.email = ?;
    `;

    const totalSpentQuery = `
        SELECT SUM(p.amount) AS total_spent
        FROM booking b
        JOIN payment p ON b.booking_id = p.booking_id
        JOIN users u ON b.user_id = u.user_id
        WHERE u.email = ?;
    `;

    // Run both queries in parallel using db.query() instead of connection.query()
    db.query(historyQuery, [email], (err, historyResults) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching booking history' });
        }

        db.query(totalSpentQuery, [email], (err, totalSpentResults) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching total amount spent' });
            }

            res.json({
                history: historyResults,
                totalSpent: totalSpentResults[0].total_spent || 0,
            });
        });
    });
});
// POST /api/reviews
app.post('/api/reviews', (req, res) => {
  // Extract data from the request body
  const { userEmail, packageId, reviewText, rating } = req.body;

  // Validate if the required data is present
  if (!userEmail || !packageId || !reviewText || rating === undefined) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Here, you should fetch the user ID based on the userEmail
  // Assuming you have a method to get the user ID by email
  db.query('SELECT user_id FROM users WHERE email = ?', [userEmail], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching user data' });
    }

    const userId = results[0]?.user_id;
    if (!userId) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Proceed to insert the review
    const query = 'INSERT INTO reviews (user_id, package_id, rating, review_date, comment) VALUES (?, ?, ?, CURDATE(), ?)';
    
    // Execute the insert query
    db.query(query, [userId, packageId, rating, reviewText], (err, results) => {
      if (err) {
        console.error('Error saving review:', err);
        return res.status(500).json({ message: 'Error saving review' });
      }

      return res.status(201).json({ message: 'Review saved successfully', reviewId: results.insertId });
    });
  });
});
// PUT route to update package information
app.put('/api/places/:id', (req, res) => {
    const packageId = req.params.id; // Get package ID from the route parameters
    const { package_name, price, details, rating } = req.body; // Get updated fields from request body

    // Define the SQL query for updating the package
    const query = `
        UPDATE package 
        SET package_name = ?, price = ?, details = ?, rating = ?
        WHERE package_id = ?;
    `;

    // Execute the query
    db.query(query, [package_name, price, details, rating, packageId], (err, results) => {
        if (err) {
            console.error('Error updating package:', err);
            return res.status(500).json({ message: 'Error updating package' });
        }

        // Check if any rows were affected (i.e., the package was found and updated)
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Package not found' });
        }

        res.status(200).json({ message: 'Package updated successfully' });
    });
});

// DELETE route to delete a package by ID
app.delete('/api/places/:id', (req, res) => {
    const packageId = req.params.id; // Get package ID from the route parameters

    // SQL query to delete the package
    const query = 'DELETE FROM package WHERE package_id = ?';

    // Execute the delete query
    db.query(query, [packageId], (err, results) => {
        if (err) {
            console.error('Error deleting package:', err);
            return res.status(500).json({ message: 'Error deleting package' });
        }

        // Check if any rows were affected (i.e., the package was found and deleted)
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Package not found' });
        }

        res.status(200).json({ message: 'Package deleted successfully' });
    });
});

app.post('/api/add-package', (req, res) => {
    const { package_name, destination_id, price, details } = req.body;
    const rating = 0.0;  // Set a default rating

    const query = `
        INSERT INTO package (package_name, destination_id, price, details, rating)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [package_name, destination_id, price, details, rating], (err, result) => {
        if (err) {
            console.error('Error adding package:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'Package added successfully', package_id: result.insertId });
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
