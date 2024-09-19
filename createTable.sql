-- Drop the database if it exists and create a new one
DROP DATABASE IF EXISTS mentoring_mainlyrise;
CREATE DATABASE mentoring_mainlyrise;
USE mentoring_mainlyrise;

-- Create address table
CREATE TABLE IF NOT EXISTS address (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT,
    address_line_1 TEXT,
    address_line_2 TEXT,
    lat DECIMAL(10, 8),
    lon DECIMAL(11, 8),
    offset_std VARCHAR(50),
    abbreviation_std VARCHAR(50),
    zip VARCHAR(20),
    country VARCHAR(100),
    country_code CHAR(2),
    state VARCHAR(100),
    state_code CHAR(2),
    city VARCHAR(100),
    street VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create subject table
CREATE TABLE IF NOT EXISTS subject (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo VARCHAR(255),
    slug VARCHAR(255) UNIQUE NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create user table
CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('student', 'tutor', 'admin') NOT NULL,
    phone_number VARCHAR(20),
    gender VARCHAR(20),
    address_str TEXT,
    email VARCHAR(255) UNIQUE NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    address_id INT,
    bio LONGTEXT,
    years_of_experience DATE,
    rating DECIMAL(3, 2),
    profile_img VARCHAR(255),
    hobbies TEXT,
    subject_id INT,
    coin_balance INT DEFAULT 0,
    status ENUM('active', 'inactive', 'ban') DEFAULT 'active',
    FOREIGN KEY (address_id) REFERENCES address(id),
    FOREIGN KEY (subject_id) REFERENCES subject(id)
);

-- Create request table
CREATE TABLE IF NOT EXISTS request (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50),
    type ENUM('tutoring', 'job support', 'assignment') NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    level VARCHAR(50),
    tutors_want INT,
    gender_preference VARCHAR(20),
    description TEXT,
    nature VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    subject_id INT,
    address_id INT,
    FOREIGN KEY (student_id) REFERENCES user(user_id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subject(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (address_id) REFERENCES address(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create request_subject_rel table
CREATE TABLE IF NOT EXISTS request_subject_rel (
    request_id INT,
    subject_id INT,
    PRIMARY KEY (request_id, subject_id),
    FOREIGN KEY (request_id) REFERENCES request(id),
    FOREIGN KEY (subject_id) REFERENCES subject(id)
);

-- Create user_subject_rel table
CREATE TABLE IF NOT EXISTS user_subject_rel (
    user_id INT,
    subject_id INT,
    PRIMARY KEY (user_id, subject_id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (subject_id) REFERENCES subject(id)
);

-- Create transaction table
CREATE TABLE IF NOT EXISTS transaction (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    request_id INT,
    transaction_type ENUM('spend', 'earn') NOT NULL,
    amount INT NOT NULL, -- Amount of coins spent or earned
    payment_method VARCHAR(100), -- Optional: method used for payment (e.g., credit_card, paypal)
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (request_id) REFERENCES request(id)
);
