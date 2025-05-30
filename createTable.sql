-- Drop in reverse order of dependencies
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS request_subject_rel CASCADE;
DROP TABLE IF EXISTS user_subject_rel CASCADE;
DROP TABLE IF EXISTS requests CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;

-- 1. Addresses Table
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    address_line_1 TEXT,
    address_line_2 TEXT,
    lat NUMERIC(10, 8),
    lon NUMERIC(11, 8),
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

-- 2. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    role VARCHAR NOT NULL CHECK (role IN ('student', 'tutor', 'admin', 'user')),
    phone_number VARCHAR,
    gender VARCHAR,
    email VARCHAR UNIQUE NOT NULL,
    address_id INTEGER REFERENCES addresses(id) ON DELETE SET NULL,
    bio TEXT,
    years_of_experience FLOAT,
    rating DECIMAL(3, 2),
    profile_img VARCHAR,
    hobbies TEXT,
    coin_balance INTEGER DEFAULT 0,
    status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'ban')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Subjects Table
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    logo VARCHAR,
    slug VARCHAR UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. User-Subject Join Table
CREATE TABLE user_subject_rel (
    user_email VARCHAR NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    PRIMARY KEY (user_email, subject_id)
);

-- 5. Requests Table
CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR NOT NULL REFERENCES users(email) ON DELETE SET NULL,
    phone_number VARCHAR NOT NULL,
    type VARCHAR NOT NULL CHECK (type IN ('tutoring', 'job support', 'assignment')),
    status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    level VARCHAR,
    tutors_want VARCHAR,
    gender_preference VARCHAR,
    description TEXT,
    nature VARCHAR,
    online_meeting BOOLEAN DEFAULT FALSE,
    offline_meeting BOOLEAN DEFAULT FALSE,
    travel_meeting BOOLEAN DEFAULT FALSE,
    get_tutors_from VARCHAR,
    price_amount DECIMAL(10, 2),
    price_currency_symbol VARCHAR(5),
    price_currency VARCHAR(3),
    price_option VARCHAR,
    upload_file VARCHAR,
    i_need_someone TEXT,
    language JSONB,
    address_id INTEGER REFERENCES addresses(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. Request-Subject Join Table
CREATE TABLE request_subject_rel (
    request_id INTEGER NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    PRIMARY KEY (request_id, subject_id)
);

-- 7. Transactions Table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    request_id INTEGER NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    transaction_type VARCHAR NOT NULL CHECK (transaction_type IN ('spend', 'earn')),
    amount INTEGER NOT NULL,
    payment_method VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
