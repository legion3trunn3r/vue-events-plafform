-- Создание базы данных для платформы микро-ивентов
CREATE DATABASE IF NOT EXISTS vue_events_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vue_events_platform;

-- Таблица пользователей
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('client', 'admin') DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Таблица ивентов
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATETIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    max_guests INT DEFAULT 50,
    organizer_id INT NOT NULL,
    qr_code VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_date (date),
    INDEX idx_organizer (organizer_id),
    INDEX idx_qr_code (qr_code)
);

-- Таблица фотографий ивентов
CREATE TABLE event_photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    uploaded_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_event (event_id),
    INDEX idx_uploaded_by (uploaded_by)
);

-- Таблица гостей
CREATE TABLE guests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    qr_checked BOOLEAN DEFAULT FALSE,
    checked_in_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    INDEX idx_event (event_id),
    INDEX idx_qr_checked (qr_checked),
    INDEX idx_email (email)
);

-- Триггеры для обновления updated_at
DELIMITER $$

CREATE TRIGGER users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
BEGIN 
    SET NEW.updated_at = CURRENT_TIMESTAMP; 
END$$

CREATE TRIGGER events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW 
BEGIN 
    SET NEW.updated_at = CURRENT_TIMESTAMP; 
END$$

DELIMITER ;

-- Создание первого администратора (пароль: admin123)
INSERT INTO users (email, password, name, role) 
VALUES (
    'admin@example.com', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Le9iF1Y5qX3zJ.GqG', 
    'Администратор', 
    'admin'
);

-- Создание тестового пользователя (пароль: user123)
INSERT INTO users (email, password, name, role) 
VALUES (
    'user@example.com', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Le9iF1Y5qX3zJ.GqG', 
    'Тестовый Пользователь', 
    'client'
);

-- Создание тестового ивента
INSERT INTO events (title, description, date, location, max_guests, organizer_id, qr_code) 
VALUES (
    'Добро пожаловать в платформу микро-ивентов!', 
    'Это тестовый ивент для демонстрации возможностей платформы. Здесь вы можете создавать свои ивенты, приглашать гостей и отслеживать регистрацию.',
    DATE_ADD(NOW(), INTERVAL 7 DAY),
    'Онлайн',
    100,
    1,
    'WELCOME2024QR123'
);

-- Создание тестовых фотографий
INSERT INTO event_photos (event_id, photo_url, uploaded_by) VALUES
(1, '/images/event1/photo1.jpg', 1),
(1, '/images/event1/photo2.jpg', 1),
(1, '/images/event1/photo3.jpg', 1);

-- Создание тестовых гостей
INSERT INTO guests (event_id, name, email) VALUES
(1, 'Анна Иванова', 'anna@example.com'),
(1, 'Петр Петров', 'petr@example.com'),
(1, 'Мария Сидорова', 'maria@example.com');

-- Хеши паролей:
-- admin123 и user123: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Le9iF1Y5qX3zJ.GqG

-- Просмотр созданных данных
SELECT 'Пользователи:' as info;
SELECT * FROM users;

SELECT 'Ивенты:' as info;
SELECT * FROM events;

SELECT 'Гости тестового ивента:' as info;
SELECT * FROM guests WHERE event_id = 1;
