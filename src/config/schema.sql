CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    profile TEXT,
    last_login TIMESTAMP,
    isVerified BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isDeleted BOOLEAN DEFAULT FALSE
);


//demo users inseted into users TABLE

INSERT INTO users (
    username, first_name, last_name, email, password, phone, profile, last_login, isVerified, isDeleted
) VALUES
    (
        'john_doe', 'John', 'Doe', 'john.doe@example.com', 'hashed_password_123',
        '9876543210', 'Software Developer', NOW(), TRUE, FALSE
    ),
    (
        'jane_smith', 'Jane', 'Smith', 'jane.smith@example.com', 'hashed_password_456',
        '9123456780', 'Data Analyst', NOW(), FALSE, FALSE
    );

create database ecommerce;
\c ecommerce
create table users(
    id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(150) NOT NULL
)

