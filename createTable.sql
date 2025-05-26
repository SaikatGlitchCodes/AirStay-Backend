-- Drop tables in correct order to avoid FK issues
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS request_subject_rel CASCADE;
DROP TABLE IF EXISTS user_subject_rel CASCADE;
DROP TABLE IF EXISTS requests CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;

-- Create addresses table
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    address_line_1 TEXT,
    address_line_2 TEXT,
    lat NUMERIC(10,8),
    lon NUMERIC(11,8),
    offset_std VARCHAR,
    abbreviation_std VARCHAR,
    zip VARCHAR,
    country VARCHAR NOT NULL,
    country_code VARCHAR(2) NOT NULL,
    state VARCHAR,
    state_code VARCHAR(2),
    city VARCHAR,
    street VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    role VARCHAR NOT NULL CHECK (role IN ('student', 'tutor', 'admin', 'user')),
    phone_number VARCHAR,
    gender VARCHAR,
    email VARCHAR UNIQUE NOT NULL,
    address_id INTEGER REFERENCES addresses(id) ON DELETE SET NULL,
    bio TEXT,
    years_of_experience FLOAT,
    rating DECIMAL(3,2),
    profile_img VARCHAR,
    hobbies TEXT,
    coin_balance INTEGER DEFAULT 0,
    status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'ban')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create subjects table
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    logo VARCHAR,
    slug VARCHAR UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create requests table
CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    phone_number VARCHAR NOT NULL,
    type VARCHAR NOT NULL CHECK (type IN ('tutoring', 'job support', 'assignment')),
    status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    level VARCHAR,
    tutors_want VARCHAR,
    gender_preference VARCHAR,
    description TEXT,
    nature VARCHAR,
    meeting_options VARCHAR,
    get_tutors_from VARCHAR,
    price_amount DECIMAL(10,2),
    price_currency_symbol VARCHAR(5),
    price_currency VARCHAR(3),
    price_option VARCHAR,
    upload_file VARCHAR,
    i_need_someone TEXT,
    address_id INTEGER REFERENCES addresses(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create user_subject_rel join table
CREATE TABLE user_subject_rel (
    user_id INTEGER NOT NULL REFERENCES users(id),
    subject_id INTEGER NOT NULL REFERENCES subjects(id),
    PRIMARY KEY (user_id, subject_id)
);

-- Create request_subject_rel join table
CREATE TABLE request_subject_rel (
    request_id INTEGER NOT NULL REFERENCES requests(id),
    subject_id INTEGER NOT NULL REFERENCES subjects(id),
    PRIMARY KEY (request_id, subject_id)
);

-- Create transactions table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    request_id INTEGER NOT NULL REFERENCES requests(id),
    transaction_type VARCHAR NOT NULL CHECK (transaction_type IN ('spend', 'earn')),
    amount INTEGER NOT NULL,
    payment_method VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
