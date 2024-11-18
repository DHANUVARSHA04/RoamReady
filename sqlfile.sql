USE TOURISM_APP;

-- 1. USERS table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,  -- Auto incrementing user_id
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
CREATE TABLE Admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,  -- Auto incrementing user_id
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- 2. DESTINATION table
CREATE TABLE Destination (
    destination_id INT AUTO_INCREMENT PRIMARY KEY,  -- Auto incrementing destination_id
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    description TEXT,
    rating DECIMAL(2, 1) CHECK (rating BETWEEN 1.0 AND 5.0)
);

-- 3. PACKAGE table
CREATE TABLE Package (
    package_id INT AUTO_INCREMENT PRIMARY KEY,  -- Auto incrementing package_id
    package_name VARCHAR(100) NOT NULL,
    destination_id INT,
    price DECIMAL(10, 2) NOT NULL,
    details TEXT,
    FOREIGN KEY (destination_id) REFERENCES Destination(destination_id)
);

-- 4. REVIEWS table
CREATE TABLE Reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,  -- Auto incrementing review_id
    user_id INT,
    package_id INT,  -- Changed from destination_id to package_id
    rating INT CHECK (rating BETWEEN 1 AND 5),
    review_date DATE,
    comment TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (package_id) REFERENCES package(package_id)  -- Updated to reference the 'package' table
);


-- 5. BOOKING table
CREATE TABLE Booking (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,  -- Auto incrementing booking_id
    user_id INT,
    package_id INT,
    booking_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (package_id) REFERENCES Package(package_id)
);

-- 6. PAYMENT table
CREATE TABLE Payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,  -- Auto incrementing payment_id
    booking_id INT,
    payment_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id)
);
DELIMITER $$


CREATE TRIGGER update_package_rating
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    -- Declare variable to store the average rating
    DECLARE avg_rating DECIMAL(10, 2);

    -- Calculate the average rating for the package
    SELECT AVG(rating) INTO avg_rating
    FROM reviews
    WHERE package_id = NEW.package_id;

    -- Update the package's rating with the new average rating
    UPDATE package
    SET rating = avg_rating
    WHERE package_id = NEW.package_id;
END $$

DELIMITER ;

